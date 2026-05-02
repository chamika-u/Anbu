import sqlite3

def upgrade():
    try:
        conn = sqlite3.connect('instance/anbu.db')
        c = conn.cursor()
        c.execute("ALTER TABLE repository_analyses ADD COLUMN progress_json TEXT DEFAULT '{}'")
        conn.commit()
        print("Successfully added progress_json column.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == '__main__':
    upgrade()
