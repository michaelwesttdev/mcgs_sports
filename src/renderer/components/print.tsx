import { Button } from "./ui/button";

type Props={
  id:string,
  type:"session"|"event"
}
export default function Print({id,type}:Props){
  function handlePrint(){
    switch(type){
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
  async function printEvent(){
    const dataToPrint = await getEventDataToPrint(id)
    const structure = `
    <html>
    <head>
    <title>${dataToPrint.sessionName}</title>
    </head>
    <main>
    </main>
    </html>
    `
    
  }
  function printSession(){}
return(
    <Button onClick={handlePrint}>Print</Button>
)
}

async function getSessionDataToPrint(id:string){
  const session = await window.api.mainReadSession(id);
  const sessionEvents = await window.api.psListEvent([id]);
  if(!sessionEvents.success) return;

  return {
    sessionName:"Hello",
    events:[
      {
        eventName:"100 m sprint U14 Boys",
        positions:{

        }
      }
    ]
  }
}
async function getEventDataToPrint(id:string){
  return {
    sessionName:"Hello",
    events:[
      {
        eventName:"100 m sprint U14 Boys",
        positions:{

        }
      }
    ]
  }
}


