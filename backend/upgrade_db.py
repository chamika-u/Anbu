import sqlite3

def upgrade():
    try:
        conn = sqlite3.connect('instance/anbu.db')
        c = conn.cursor()
        c.execute("ALTER TABLE repository_analyses ADD COLUMN user_id INTEGER REFERENCES users(id)")
        conn.commit()
        print("Successfully added user_id column.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == '__main__':
    upgrade()
