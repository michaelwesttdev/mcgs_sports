import {Settings} from "@/shared/settings";
import {PSEvent, PSEventResult, PSHouse, PSParticipant} from "@/db/sqlite/p_sports/schema";

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
        measurement: string; // e.g., "12.34" (seconds or meters)
    }[],
    eventType: "team" | "individual",
    eventNature: "timed" | "distance",
    settings: Settings,
    eventId: string
): Omit<PSEventResult, "createdAt" | "updatedAt" | "deletedAt">[] {
    // Step 1: Parse valid numeric measurements
    const validResults = results
        .filter(r => r.measurement.trim() !== "" && !isNaN(parseFloat(r.measurement)))
        .map(r => ({ ...r, value: parseFloat(r.measurement) }));

    // Step 2: Sort based on event nature
    const sorted = [...validResults].sort((a, b) =>
        eventNature === "timed" ? a.value - b.value : b.value - a.value
    );

    // Step 3: Group by measurement value to detect ties
    const groups: { value: number; participants: typeof sorted }[] = [];
    const precision = 0.0001;

    for (const r of sorted) {
        const existingGroup = groups.find(g => Math.abs(g.value - r.value) < precision);
        if (existingGroup) {
            existingGroup.participants.push(r);
        } else {
            groups.push({ value: r.value, participants: [r] });
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
            measurement: r.measurement,
            participantType: eventType === "team" ? "house" : "participant",
            points: isDisqualified
                ? getPointsForParticipant(0, eventType, settings, true)
                : mapped.points,
        };
    });
}

export function checkIfRecordHasBeenBroken(results:Omit<PSEventResult, "createdAt" | "updatedAt" | "deletedAt">[],eventNature: "timed" | "distance",event:PSEvent,participants:PSParticipant[],houses:PSHouse[]){
    const hasRecord = !!(event.record && event.recordHolder);
    const winner = results.find(r=>r.position === 1);
    if(!winner) return {
        isBroken:false
    };
    const individualParticipant = event.type === "individual"&&participants.find(p=>p.id===winner.participantId)
    const winnerName = event.type ==="team"?houses.find(h=>h.id===winner.participantId).name:`${individualParticipant.firstName.split("")[0].toUpperCase()}. ${individualParticipant.lastName} - ${houses.find(h=>h.id===individualParticipant.houseId).name}`
    if(!hasRecord){
        return {
            isBroken: true,
            newRecord: winner.measurement,
            recordHolder: winnerName
        };
    }
    const isBroken = eventNature === "timed"? event.record>winner.measurement:event.record<winner.measurement
    if(isBroken){
        return {
            isBroken: true,
            newRecord: winner.measurement,
            recordHolder: winnerName
        };
    }
    return {
        isBroken:false
    };
}