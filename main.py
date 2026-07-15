from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

ticketList:list[str] = []

class USER(BaseModel):
    username:str
    password:str # HASHED
    role: str

class TICKET(BaseModel):
    ticketID:int = None # Assigned Based on System
    byUser:str
    title:str
    desc:str
    status:str = None # Assigned Based on System
    assigned:str = None # Assigned Based on System
    isDeleted:bool = False
    

@app.get("/")
def root():
    return {"Hello": "World"}

@app.post("/view", response_model=list[TICKET])
def ViewTickets():
    if len(ticketList) <= 0:
        raise HTTPException(status_code=404, detail="No Tickets Found!")
    return ticketList

@app.get("/view/{id}")
def GetTicket(id:int) -> TICKET:
    if id > len(ticketList) or id < 0:
        raise HTTPException(status_code=404, detail="Ticket Not Found!")
    return ticketList[id]
    # 401 Unauthorized

@app.post("/create")
def CreateTicket(ticket: TICKET):
    ticketList.append(ticket)
    return f"Appended {ticket} to {ticketList}"
    # 409 Conflict
    
@app.post("/coffee")
def Coffee():
    # I HAD TO!
    raise HTTPException(status_code=418, detail="I refuse to Brew Coffee, I'ma Teapot!")