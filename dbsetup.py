import psycopg2
import csv
import math

def connect():
  # Establish connection and cursor for transactions
  conn = psycopg2.connect("dbname=covalent-ionic user=postgres password=password")
  print("Checking connection to db")
  cur = conn.cursor()
  cur.execute('SELECT version()')
  db_version = cur.fetchone()
  print(db_version)
  # cur.execute("rollback")
  # print("hi")

  # Create the user table
  cur.execute("CREATE TABLE IF NOT EXISTS users (user_id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, city VARCHAR(255) NOT NULL, years SMALLINT NOT NULL, interests TEXT[] NOT NULL);")
  # Create the match table
  cur.execute('CREATE TABLE IF NOT EXISTS matches (match_id SERIAL PRIMARY KEY, user1_id INT NOT NULL, user2_id INT NOT NULL, FOREIGN KEY (user1_id) REFERENCES users (user_id), FOREIGN KEY (user2_id) REFERENCES users (user_id));')
  print("Tables created successfully!")
  rowNum = 0
  # Import data from csv file
  with open('ionic.csv', 'r') as f:
    reader = csv.reader(f)

    for row in reader:
      if rowNum == 0:
        rowNum += 1
      else:
        # Take years experience and average interval, save as int
        row[4] = row[4].replace(">", '').strip().split("-")
        yearAvg = 0
        nums = 0
        for num in row[4]:
          nums += 1
          yearAvg += int(num)
        yearAvg = math.ceil(yearAvg / nums)
        row[4] = yearAvg
        # Transform interests to an array of strings
        row[5] = row[5].split(",")
        cur.execute("INSERT INTO users (email, name, city, years, interests) VALUES (%s, %s, %s, %s, %s)", (row[1], row[2], row[3], row[4], row[5]))

  print("Data inserted into tables successfully!")
  # Commit changes
  conn.commit()
  cur.close()
  conn.close()
  print("Commited and closed --> woot woot !!")




if __name__ == '__main__':
    connect()
