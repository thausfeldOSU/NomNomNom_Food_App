// ########################################
// ########## SETUP

// Express
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = 5000;

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

app.get('/nnn_food_items', async function (req, res) {
    try {
        // Create and execute our queries
        const query1 = `SELECT * FROM FOOD_ITEMS;`;
        const [food] = await db.query(query1);

        // Render the nnn_food_items.hbs file, and also send the renderer
        //  an object that contains the results of the query
        res.render('nnn_food_items', { food: food});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/nnn_restaurants', async function (req, res) {
    try {
        // Create and execute our queries
        const query1 = `SELECT * FROM RESTAURANTS;`;
        const [restaurant] = await db.query(query1);

        // Render the nnn_restaurants.hbs file, and also send the renderer
        //  an object that contains the results of the query
        res.render('nnn_restaurants', { restaurant: restaurant});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/nnn_customers', async function (req, res) {
    try {
        // Create and execute our queries
        const query1 = `SELECT * FROM CUSTOMERS;`;
        const [customer] = await db.query(query1);

        // Render the nnn_customers.hbs file, and also send the renderer
        //  an object that contains the results of the query
        res.render('nnn_customers', { customer: customer});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/nnn_orders', async function (req, res) {
    try {
        // Create and execute our queries

        /* 
           Tommy comments 2/10
           First off, I think turning the page for ORDERS into a view of our intersection table is appropriate. We could showcase the M:M CRUD
           operations on this page. If you agree, then we would need more than just this SELECT statement. I am assuming it would go here
           in this .get() block, but maybe that's for a seperate .get() block? Like would we have one .get() to catch a click on a DELETE
           button on this page or would we keep it in here? Same question for CREATE and UPDATE.
        */
        const query1 = `SELECT * FROM FOOD_ITEMS_ORDERS;`;
        const [customer] = await db.query(query1);

        // Render the nnn_food_items_orders.hbs file, and also send the renderer
        //  an object that contains the results of the query
        res.render('nnn_food_items_orders', { customer: customer});
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