# SillySealsProject
**Contributors** <br>
Ahmed Dhaavoodhu Ali <br>
Aishath Nausheen Waseem <br>
Aishath Livaa Ahmed

## Project Description
A helpdesk ticketing system designed to manage support requests through a web-based interface. The project consists of a React frontend and a FastAPI backend with SQLite used for local data storage.

The system is designed around ticket management, including viewing tickets, creating tickets, updating ticket information, assigning tickets, adding comments, and managing categories. The backend also provides role-based access for users, staff, and administrators.

## Technology Stack
| Component | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| Backend | Python, FastAPI |
| Database | SQLite |
| API Server | Uvicorn |

## Setup Instructions
Install the following before setting up the project:

Python 3.11 or newer <br>
Node.js and npm <br>
Git

**1. Clone the repository** <br>
```git clone https://github.com/s2400116/SillySealsProject``` <br>
```cd SillySealsProject``` <br>

**2. Set up backend** <br>
Create and activate a Python virtual environment from the project root. <br>

Windows PowerShell: <br>
```python -m venv .venv``` <br>
```.\.venv\Scripts\Activate.ps1``` <br>

macOS/Linux: <br>
```python3 -m venv .venv``` <br>
```source .venv/bin/activate``` <br>

Install the Python dependencies: <br>
```python -m pip install -r requirements.txt``` <br>

**3. Set up frontend** <br>
Open a second terminal and move into the frontend directory: 

```cd frontend``` <br>
```npm install``` <br>

## Initializing Database
The active FastAPI application automatically creates the SQLite tables it requires when "backend/main.py" starts. No separate database server is required.

Start the backend from the project root so that the SQLite database is created/used in the expected location:

```cd backend``` <br>
```uvicorn backend.main:app --reload```

The API will be available at:

```http://localhost:8000```

FastAPI's interactive API documentation is available at:

```http://localhost:8000/docs```

## Running Backend and Frontend
From the project root, with the virtual environment activated:

```uvicorn backend.main:app --reload```

Keep this terminal running while using the frontend.

In a second terminal:

```cd frontend```
```npm run dev```

Vite will display the local development address in the terminal, normally:

```http://localhost:5173```

Open that address in a web browser.

## Default Test Users
| Username | Role | Email | Password |
|---|---|---|---|
| NighRaven | Admin | nightraven@sillyseals.com | 1 |
| Livv | Staff | livv@sillyseals.com | 2 |
| Naushyn | User | naush@sillyseals.com | 3 |
| staffUser2 | Staff | staff2@sillyseals.com | 4 |
| regularUser2 | User | user2@sillyseals.com | 5 |

## Main Features
User registration and login <br>
Role-based access for users, staff, and administrators
Create, view, and update support tickets <br>
Ticket assignment and status management <br>
Ticket comments <br>
Ticket deletion/soft deletion <br>
Category management for administrators <br>
Activity logging in the backend <br>
Responsive React-based user interface <br>
SQLite database for local persistence <br>

## Known Limitations
SQLite database files are intended for local development. They should not be relied on as a shared production database. <br>
The application is intended for local development/demo use and does not currently provide production deployment configuration. <br>

## Security Notice
The credentials listed above are development-only seed values from the repository and must not be reused for real accounts.
