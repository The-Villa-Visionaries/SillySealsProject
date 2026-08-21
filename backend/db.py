import sqlite3

DATABASE_PATH:str = 'main.db'

def InitAndSeedDb() -> None:
    conn:sqlite3.Connection = sqlite3.connect(DATABASE_PATH)
    cursor:sqlite3.Cursor = conn.cursor()
    cursor.execute('PRAGMA foreign_keys = ON;')
    cursor.execute('DROP TABLE IF EXISTS tickets')
    cursor.execute('DROP TABLE IF EXISTS sessions')
    cursor.execute('DROP TABLE IF EXISTS category')
    cursor.execute('DROP TABLE IF EXISTS users')
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user'
    )''')
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS sessions (
        primarySID TEXT PRIMARY KEY,
        altSID TEXT,
        userId INTEGER UNIQUE,
        expireTime REAL,
        FOREIGN KEY (userId) REFERENCES users(id)
    )''')
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS category (
        name TEXT PRIMARY KEY,
        color TEXT NOT NULL
    )''')
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS tickets (
        ticketId INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        staffId INTEGER,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL,
        category TEXT CHECK(category IN ('help', 'clean', 'maintenance')) DEFAULT 'help',
        deleted INTEGER DEFAULT 0,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (staffId) REFERENCES users(id)
    )''')
    sampleCategories:list[tuple[str, str]] = [
        ('help', "#23D488"),
        ('clean', "#6499EE"),
        ('maintenance', "#D12E2E")
    ]
    cursor.executemany('INSERT INTO category (name, color) VALUES (?, ?)', sampleCategories)
    sampleUsers:list[tuple[str, str, str]] = [
        ('Naush', '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b', 'user'),
        ('Livv', 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35', 'staff'),
        ('NightRaven', '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce', 'admin'),
        ('Zaain', '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a', 'user'),
        ('Yaish', 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d', 'staff')
    ]
    cursor.executemany('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', sampleUsers)
    sampleTickets:list[tuple[int, int | None, str, str, str, str, int]] = [
        (1, None, 'WiFi Not Working', 'The 5G network keeps dropping in Room 302.', 'open', 'help', 0),
        (4, 5, 'Password Reset Needed', 'Locked out of account after 3 failed attempts.', 'in-progress', 'help', 0),
        (1, None, 'Printer Offline', 'The 2nd floor library printer is not accepting print jobs.', 'open', 'help', 0),
        (3, 2, 'VPN Access Error', 'Unable to connect to the remote database VPN endpoint.', 'resolved', 'help', 0),
        (4, None, 'Software License Key', 'Need a software key renewal for local dev tools.', 'open', 'help', 0),
        (1, None, 'Spill in Hallway', 'Coffee spilled near the main lobby elevator.', 'in-progress', 'clean', 0),
        (3, 2, 'Trash Bin Overflow', 'Restroom bins on floor 3 need to be emptied.', 'resolved', 'clean', 0),
        (4, None, 'Window Cleaning Request', 'Exterior windows in room 104 are covered in smudge marks.', 'open', 'clean', 0),
        (1, 2, 'Whiteboard Erase Needed', 'Meeting room B whiteboard has permanent marker traces.', 'resolved', 'clean', 0),
        (3, None, 'Sanitizer Station Empty', 'Hand sanitizer dispenser near entrance is out of liquid.', 'open', 'clean', 0),
        (4, 2, 'Broken AC Unit', 'AC unit in room 201 is leaking water profusely.', 'resolved', 'maintenance', 0),
        (1, 5, 'Flickering Overhead Light', 'Fluorescent tube in lab 3 is blinking rapidly.', 'in-progress', 'maintenance', 0),
        (3, None, 'Door Lock Jammed', 'Electronic keycard reader on door 12 keeps flashing red.', 'open', 'maintenance', 0),
        (4, 5, 'Broken Chair Wheel', 'Desk chair in office 4B lost a castor wheel.', 'resolved', 'maintenance', 0),
        (1, None, 'Water Cooler Leaking', 'Breakroom water dispenser puddle forming on floor.', 'open', 'maintenance', 0)
    ]
    cursor.executemany('''
        INSERT INTO tickets (userId, staffId, title, description, status, category, deleted)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', sampleTickets)
    conn.commit()
    conn.close()
    print("Database main.db initialized and successfully seeded with 5 users and 15 tickets!")

if __name__ == '__main__':
    InitAndSeedDb()