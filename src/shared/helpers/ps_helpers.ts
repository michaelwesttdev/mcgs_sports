import {Settings} from "@/shared/settings";
import {PSEvent, PSEventResult, PSHouse, PSParticipant} from "@/db/sqlite/p_sports/schema";
import { getAge } from "./dates";

export function getPointsForParticipant(position:number,eventType:"team"|"individual",settings:Settings,isDisqualified:boolean){
    const pointAllocationInSettings = settings.points[eventType];
    if(!pointAllocationInSettings || !pointAllocationInSettings[position]){
        return 0;
    }
    if(isDisqualified) return 0;
    return pointAllocationInSettings[position];
}
export function assignPointsPreservingOrder(
    results: {
        id: string;
        participantId: string;
        position: number; // ignored
    }[],
    eventType: "team" | "individual",
    settings: Settings,
    eventId: string
): Omit<PSEventResult, "createdAt" | "updatedAt" | "deletedAt">[] {
    // Step 1: Parse valid numeric measurements
    const validResults = results
        .filter(r => r.position>0)
        .map(r => ({ ...r}));

    // Step 2: Sort based on event nature
    const sorted = [...validResults].sort((a, b) =>
        a.position - b.position
    );

    // Step 3: Group by measurement value to detect ties
    const groups: { position: number; participants: typeof sorted }[] = [];

    for (const r of sorted) {
        const existingGroup = groups.find(g=>g.position === r.position);
        if (existingGroup) {
            existingGroup.participants.push(r);
        } else {
            groups.push({ position: r.position, participants: [r] });
        }
    }

    // Step 4: Assign adjusted positions and average points
    const participantPoints = new Map<string, { adjustedPosition: number; points: number }>();
    let currentPosition = 1;

    for (const group of groups) {
        const groupSize = group.participants.length;

        const pointRange = Array.from({ length: groupSize }, (_, i) =>
            getPointsForParticipant(currentPosition + i, eventType, settings, false)
        );

        const averagePoints = pointRange.reduce((sum, pts) => sum + pts, 0) / groupSize;

        for (const participant of group.participants) {
            participantPoints.set(participant.participantId, {
                adjustedPosition: currentPosition,
                points: averagePoints,
            });
        }

        currentPosition += groupSize;
    }

    // Step 5: Map back to original result order
    return results.map(r => {
        const mapped = participantPoints.get(r.participantId);
        const isDisqualified = !mapped;

        return {
            id: r.id,
            eventId,
            participantId: r.participantId,
            position: isDisqualified ? 0 : mapped.adjustedPosition,
            participantType: eventType === "team" ? "house" : "participant",
            points: isDisqualified
                ? getPointsForParticipant(0, eventType, settings, true)
                : mapped.points,
        };
    });
}

export function checkIfRecordHasBeenBroken(bestScore:string,results:Omit<PSEventResult, "createdAt" | "updatedAt" | "deletedAt">[],eventNature:PSEvent["measurementNature"],event:PSEvent,participants:PSParticipant[],houses:PSHouse[]){
    const hasRecord = !!(event?.record && event?.recordHolder);
    const winner = results.find(r=>r.position === 1);
    if(!winner) return {
        isBroken:false
    };
    const individualParticipant = event.type === "individual"&&participants.find(p=>p.id===winner.participantId)
    const winnerName = event.type ==="team"?houses.find(h=>h.id===winner.participantId).name:`${individualParticipant.firstName.split("")[0].toUpperCase()}. ${individualParticipant.lastName} - ${houses.find(h=>h.id===individualParticipant.houseId).name}`
    if(!hasRecord){
        return {
            isBroken: true,
            newRecord: bestScore,
            recordHolder: winnerName
        };
    }
    const isBroken = event.measurementNature === "time"? parseFloat(event.record)>parseFloat(bestScore):parseFloat(event.record)<parseFloat(bestScore)
    if(isBroken){
        return {
            isBroken: true,
            newRecord: bestScore,
            recordHolder: winnerName
        };
    }
    return {
        isBroken:false
    };
}

export function getAgeGroupName(ageGroups:Settings["ageGroups"],dob:string){
    if(!dob) return "Unknown";
    const age = getAge(dob);
    
    // Find the first age group that matches the age
    for (const [groupName, groupRange] of Object.entries(ageGroups)) {
        if(!Array.isArray(groupRange)) {
           return age>=groupRange?groupName:"Unknown";
        }else if (age >= groupRange[0] && age <= groupRange[1]) {
            return groupName;
        }
    }
    
    return "Unknown"; // If no match found    
}