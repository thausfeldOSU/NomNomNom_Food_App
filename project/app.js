// ########################################
// ########## SETUP

// Express
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = 5001;

// Database
const db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars'); // Import express-handlebars engine
app.engine('.hbs', engine({ extname: '.hbs' })); // Create instance of handlebars
app.set('view engine', '.hbs'); // Use handlebars engine for *.hbs files.

// ########################################
// ########## ROUTE HANDLERS


// ##### RESET TO BASELINE DATABASE WITH DUMMY DATA
app.post('/reset_db', async (req, res) => {
    try {
        const query1 = 'CALL sp_load_nnndb();';
        await db.query(query1);
        res.redirect('/');
        // res.status(200).json({ message: 'Database reset successfully' });
    } 
    catch (error) {
        console.error("Error resetting database:", error);
        res.status(500).send("An error occurred while resetting the database.");
    }
});

// ###### DELETE ROUTES
app.post('/delete_food_item', async function (req, res) {
    try {
        const foodId = req.body.delete_food_id;

        await db.query('CALL DELETE_FOOD_ITEM(?)', [foodId]);
        res.redirect('/nnn_food_items');
    } catch (error) {
        console.error("Error deleting food item:", error);
        res.status(500).send("An error occurred while deleting the food item.");
    }
});

app.post('/delete_order_food', async function (req, res) {
    try {
        const orderId = req.body.delete_order_id
        const foodId = req.body.delete_food_id;

        await db.query('CALL DELETE_ORDER_FOOD_ITEM(?, ?)', [orderId, foodId]);
        res.redirect('/nnn_food_items_orders');
    } catch (error) {
        console.error("Error deleting:", error);
        res.status(500).send("An error occurred while deleting.");
    }
});

// ###### READ ROUTES
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
        const query1 = fs.readFileSync(path.join(__dirname, 'queries', 'nnn_food_items.sql'), 'utf8');
        const [food] = await db.query(query1);

        const query2 = fs.readFileSync(path.join(__dirname, 'queries', 'nnn_food_items-restaurant_list.sql'), 'utf8');
        const [restaurant] = await db.query(query2);

        const query3 = fs.readFileSync(path.join(__dirname, 'queries', 'nnn_food_items-list.sql'), 'utf8');
        const [foods] = await db.query(query3);

        // Render the nnn_food_items.hbs file, and also send the renderer
        //  an object that contains the results of the query
        res.render('nnn_food_items', {food: food, restaurant: restaurant, foods: foods});
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
        const query1 = fs.readFileSync(path.join(__dirname, 'queries', 'nnn_restaurants.sql'), 'utf8');
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
        const query1 = fs.readFileSync(path.join(__dirname, 'queries', 'nnn_customers.sql'), 'utf8');
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

app.get('/nnn_food_items_orders', async function (req, res) {
    try {
        // Create and execute our queries

        /* 
           Tommy comments 2/10
           First off, I think turning the page for ORDERS into a view of our intersection table is appropriate. We could showcase the M:M CRUD
           operations on this page. If you agree, then we would need more than just this SELECT statement. I am assuming it would go here
           in this .get() block, but maybe that's for a seperate .get() block? Like would we have one .get() to catch a click on a DELETE
           button on this page or would we keep it in here? Same question for CREATE and UPDATE.
        */
        const query1 = fs.readFileSync(path.join(__dirname, 'queries', 'nnn_food_items_orders.sql'), 'utf8');
        const [order] = await db.query(query1);

        const query2 = fs.readFileSync(path.join(__dirname, 'queries', 'nnn_orders.sql'), 'utf8');
        const [orders] = await db.query(query2);

        // Render the nnn_food_items_orders.hbs file, and also send the renderer
        //  an object that contains the results of the query
        res.render('nnn_food_items_orders', { order: order, orders: orders});
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