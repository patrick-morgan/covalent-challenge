# Ionic Matchmaker

This is a React web app that connects with a Postgresql db running on Django. To populate the db and run this project follow the instructions below.

## Database Setup

In order to setup the backend and load it with our data we first need to create a postgresql server with user `postgres`, password `password`, host `127.0.0.1`, port `5432`. Upon installing pgAdmin and the postgresql command line it should prompt you to setup this initial server and a default superuser. If you already have a server or postgres/pgAdmin installed either change your user credentials and host address/port to match above, or change the user credentials on line 7 inside of the 'dbsetup.py' file. Then change the user credentials / host / port listed on lines 84-87 in the 'settings.py' file inside the `backend/covalent_challenge/covalent_challenge` directory.

After setting up the server as listed above, we need to setup the db.

I used pgAdmin to create this db, but feel free to use whatever tool you are most comfortable with. To create the db using pgAdmin, open pgAdmin, right click on 'Databases', click 'Create', and 'Database...'. Name the db `covalent-ionic` and then click save. Our db is now ready to be populated with the data from the 'ionic.csv' file.

To populate the db, run the command `python dbsetup.py` from the root of the project directory. If the script outputs `Commited and closed --> woot woot !!` as its last print statement then the db has been successfully populated and we are ready to build/run our app.

## How To Run

### Backend

Inside of the `backend/covalent_challenge/` directory run the command `python manage.py runserver` to run the Django server locally on port 8000. You will likely get a few 'No module named X' errors. You will need to manually install these modules using either pip or your virtual environment (if you are using one). Some of the modules you will need include django, corsheaders, djangorestframework...

### Frontend

Inside of the `frontend/covalent_challenge` directory run the command `npm install` to install all required node modules. Next, run `yarn start`. This will run the React app in development mode on port 3000. All requests made from the React app will automatically be proxied to port 8000 (where the backend is running).
