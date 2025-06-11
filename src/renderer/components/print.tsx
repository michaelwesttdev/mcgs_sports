import { PSEvent, PSEventResult } from "@/db/sqlite/p_sports/schema";
import { Button } from "./ui/button";
import { usePrinters } from "../hooks/use_printers";

type Props = {
  id: string;
  type: "session" | "event";
  sessionId: string;
};
export default function Print({ id, type, sessionId }: Props) {
  const {selectedPrinter} = usePrinters();
  function handlePrint() {
    switch (type) {
      case "event":
        printEvent();
        break;
      case "session":
        printSession();
        break;
      default:
        return;
    }
  }
  async function printEvent() {
    const dataToPrint = await getEventDataToPrint(id, sessionId);
    const dataResults = await Promise.all(dataToPrint.results);
    const firstPos = dataResults.filter(res=>res.pos === 1);
    const structure = `
   <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Event Record Sheet</title>
  <style>
    @media print {
      @page {
        size: A4 portrait; /* Change to A5 if needed */
        margin: 1.5cm;
      }

      body {
        margin: 0;
      }

      input {
        border: none;
        background: transparent;
        padding: 0;
      }
    }

    body {
      font-family: Arial, sans-serif;
      margin: 1.5cm;
      font-size: 11pt;
    }

    h2 {
      text-align: center;
      text-transform: uppercase;
      margin-bottom: 20px;
      font-size: 14pt;
    }

    .field-group {
      display: grid;
      grid-template-columns: 4.5cm 1fr;
      row-gap: 8px;
      max-width: 100%;
      margin-bottom: 20px;
    }

    .field-group label {
      font-weight: bold;
    }

    .field-group input {
      border: none;
      background: transparent;
      border-bottom: 1px solid #000;
      width: 100%;
      padding: 2px 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      table-layout: fixed;
      font-size: 10pt;
    }

    th, td {
      border: 1px solid #000;
      text-align: center;
      padding: 5px;
      overflow: hidden;
      white-space: nowrap;
    }

    th.pos, td.pos { width: 1.2cm; }
    th.name, td.name { width: 6.5cm; }
    th.small, td.small { width: 2.2cm; }

    .footer-section {
      margin-top: 30px;
    }

    .footer-section label {
      display: inline-block;
      width: 5.5cm;
      font-weight: bold;
    }

    .footer-section input {
      border: none;
      background: transparent;
      border-bottom: 1px solid #000;
      width: 7cm;
      padding: 2px 0;
    }
  </style>
</head>
<body>

  <h2>Event Record Sheet</h2>

  <div class="field-group">
    <label for="eventNumber">Event Number:</label>
    <input type="text" value={${dataToPrint.eventNumber}} id="eventNumber">

    <label for="eventName">Event Name:</label>
    <input type="text" value={${dataToPrint.eventName}} id="eventName">

    <label for="eventSex">Event Sex:</label>
    <input type="text" value={${dataToPrint.sex}} id="eventSex">

    <label for="eventAgeGroup">Event Age Group:</label>
    <input type="text" value={${dataToPrint.age_group}} id="eventAgeGroup">

    <label for="eventType">Event Type:</label>
    <input type="text" value={${dataToPrint.event_type}} id="eventType">

    <label for="eventRecord">Event Record:</label>
    <input type="text" value={${dataToPrint.eventRecord}} id="eventRecord">
  </div>

  <table>
    <thead>
      <tr>
        <th class="pos">Pos</th>
        <th class="name">Name</th>
        <th class="small">House</th>
        <th class="small">Age G</th>
        <th class="small">Sex</th>
        <th class="small">HP</th>
        <th class="small">VLP</th>
        <th class="small">Additional Info</th>
      </tr>
    </thead>
    <tbody>
      ${
        dataResults.map(res=>(
          `
          <tr>
            <td class="pos">${res.pos}</td>
            <td class="name">${res.name}</td>
            <td class="small">${res.house}</td>
            <td class="small">${res.age_group}</td>
            <td class="small">${res.sex}</td>
            <td class="small">${res.hp}</td>
            <td class="small">${res.vlp}</td>
            <td class="small">${res.additionalInfo}</td>
          </tr>
          `
        ))
      }
    </tbody>
  </table>

  <div class="footer-section">
    <p><label for="firstPosition">First Position (Time/Distance):</label><input type="text" value={${dataToPrint.eventRecord}} id="firstPosition"></p>
    ${dataToPrint.newRecord&&`<p><label for="newRecord">New Record:</label><input type="text" ${dataToPrint.newRecord}  id="newRecord"></p> <p><label for="setBy">Set By:</label><input type="text" ${firstPos[0].name} id="setBy"></p>`}
  </div>

</body>
</html>

    `;
    await window.api.printHTML({
    html: structure,
    printerName: selectedPrinter?.name,
    silent: true
  });
  }
  function printSession() {}
  return <Button onClick={handlePrint}>Print</Button>;
}

async function getSessionDataToPrint(id: string, sessionId: string) {
  const session = await window.api.mainReadSession(id);
  const sessionEvents = await window.api.psListEvent([id]);
  if (!sessionEvents.success) return;

  return {
    sessionName: "Hello",
    events: [
      {
        eventName: "100 m sprint U14 Boys",
        positions: {},
      },
    ],
  };
}
async function getEventDataToPrint(id: string, sessionId: string) {
  const { data, success, error } = await window.api.psReadEvent([
    sessionId,
    id,
  ]);
  if (!success) return null;
  const event = data as PSEvent;
  const results = await window.api.psListEventResults(sessionId);
  if (!results.success) return null;
  const thisEventResults = (results.data as PSEventResult[]).filter(
    (res) => res.eventId === id
  );

  return {
    eventName: event.title,
    eventNumber: event.eventNumber,
    sex: event.gender,
    age_group: event.ageGroup,
    event_type: event.type,
    eventRecord: event.record,
    results: thisEventResults.map(async (res) => {
      const isHuman = res.participantType === "participant";
      let pName = "";
      let hName = "";
      let participantSex = "";
      let p_age_group = "";
      let add = "";
      if (isHuman) {
        const p = await window.api.psReadParticipant([
          sessionId,
          res.participantId,
        ]);
        if (!p.success) {
          pName = "Unknown";
          hName = "Unknown";
          participantSex = "Unknown";
          p_age_group = "Unknown";
          add = "Internal App Error";
        } else {
          const house = await window.api.psReadHouse([
            sessionId,
            p.data.houseId,
          ]);
          pName = `${p.data.firstName} ${p.data.lastName}`;
          hName = !house.success ? "Unknown" : house.data?.name;
          participantSex = p.data.gender;
          p_age_group = "progress";
          add = "progress";
        }
      }
      return {
        pos: res.position,
        name: pName,
        house: hName,
        age_group: p_age_group,
        sex: participantSex,
        hp: res.points,
        vlp: res.points,
        additionalInfo: add,
      };
    }),
    firstPosMeasurement:event.bestScore,
    newRecord:event.isRecordBroken?event.bestScore:"",
  };
}
