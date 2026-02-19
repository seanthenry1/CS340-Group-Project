// ########################################
// ########## SETUP

// Express
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = 8675;

// Database
const db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars'); // Import express-handlebars engine
app.engine('.hbs', engine({ extname: '.hbs' })); // Create instance of handlebars
app.set('view engine', '.hbs'); // Use handlebars engine for *.hbs files.

// ########################################
// ########## ROUTE HANDLERS

// READ ROUTES
app.get('/', async function (req, res) {
   try {
        res.render('home'); // Render the home.hbs file
        } catch (error) {
        console.error('Error rendering page:', error);
        // Send a generic error message to the browser
        res.status(500).send('An error occurred while rendering the page.');
        }
});

app.get('/movies', async function (req, res) {
    try {
        // Create and execute our queries
        const query1 = 'SELECT * FROM Movies ORDER BY title ASC;';
        const [movies] = await db.query(query1);

        // Render the movies.hbs file
        res.render('movies', { movies: movies});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/screens', async function (req, res) {
    try {
        // Create and execute our queries
        const query1 = 'SELECT * FROM Screens;';
        const [screens] = await db.query(query1);

        // Render screens.hbs file
        res.render('screens', { screens: screens});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/showtimes', async function (req, res) {
    try {
        // Create and execute our queries
        const query1 = `SELECT Showtimes.showtimeID, Showtimes.showDate, Showtimes.startTime, 
                        Movies.title AS movieTitle, Screens.screenNumber as screenNumber FROM Showtimes   
                        JOIN Movies ON Showtimes.movieID = Movies.movieID
                        JOIN Screens on Showtimes.screenID = Screens.screenID

                        ORDER BY Showtimes.showDate, Showtimes.startTime ASC;`;
        const query2 = `SELECT Movies.movieID, Movies.title FROM Movies 
                        ORDER BY Movies.title ASC;`;

        const query3 =  `SELECT Screens.screenID, Screens.screenNumber FROM Screens`;

        const [showtimes] = await db.query(query1);
        const [movies] = await db.query(query2);
        const [screens] = await db.query(query3);

        // Render showtimes.hbs file.
        res.render('showtimes', { showtimes:showtimes, movies:movies, screens:screens});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});


app.get('/customers', async function (req, res) {
    try {
        // Create and execute our queries
        // In query1, we use a JOIN clause to display the names of the homeworlds
        const query1 = 'SELECT * FROM Customers;';
        const [customers] = await db.query(query1);

        // Render the bsg-people.hbs file, and also send the renderer
        //  an object that contains our bsg_people and bsg_homeworld information
        res.render('customers', { customers: customers });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/tickets', async function (req, res) {
    try {
        // Create and execute our queries
        const query1 = `SELECT Tickets.ticketID, Tickets.purchaseDate, Tickets.ticketPrice,
                        CONCAT(Movies.title,' - ', Showtimes.showDate,' ',Showtimes.startTime) AS showtimeLabel,
                        Customers.name AS customerName FROM Tickets
                        JOIN Showtimes ON Tickets.showtimeID = Showtimes.showtimeID
                        JOIN Movies ON Showtimes.movieID = Movies.movieID
                        JOIN Customers ON Tickets.customerID = Customers.customerID
                        ORDER BY Customers.name ASC, purchaseDate DESC;`;

        const query2 =  `SELECT showtimeID,
                        CONCAT(Movies.title,' - ', showDate,' - ',startTime) AS showtimeLabel 
                        FROM Showtimes
                        JOIN Movies on Showtimes.movieID = Movies.movieID
                        ORDER BY showdate, showtimeLabel, startTime ASC;`;

        const query3 = `SELECT customerID,name
                        FROM Customers
                        ORDER BY name;`;

        const [tickets] = await db.query(query1);
        const [showtimes] = await db.query(query2);
        const [customers] = await db.query(query3);

        // Render the tickets.hbs file
        res.render('tickets', { tickets:tickets, showtimes:showtimes, customers:customers });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log(
        'Express started on http://localhost:' +
            PORT +
            '; press Ctrl-C to terminate.'
    );
});