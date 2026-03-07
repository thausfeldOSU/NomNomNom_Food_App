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

// 5002 for testing
const PORT = 5001;
// 5001

// Database
const db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars'); // Import express-handlebars engine
const { validateHeaderName } = require('http');
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
        res.redirect('/food_items');
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
        res.redirect('/food_items_orders');
    } catch (error) {
        console.error("Error deleting:", error);
        res.status(500).send("An error occurred while deleting.");
    }
});

// ###### CREATE ROUTE
app.post('/create_food_item', async function (req, res) {
    try {
        const restaurantName = req.body.create_food_item_restaurant;
        const name = req.body.create_food_item_name;
        const price = req.body.create_food_item_price;

        await db.query('CALL CREATE_FOOD_ITEM(?, ?, ?)', [restaurantName, name, price]);
        res.redirect('/food_items');
    } catch (error) {
        console.error("Error creating food item:", error);
        res.status(500).send("An error occurred while creating the food item.");
    }
});

// ###### UPDATE ROUTE
app.post('/update_food_item', async function (req, res) {
    try {
        const foodItemID = req.body.update_food_item_name_id;
        const restaurantID = req.body.update_food_item_restaurant_id;
        const foodName = req.body.update_food_item_name;
        const price = req.body.update_food_item_price;

        await db.query('CALL UPDATE_FOOD_ITEM(?, ?, ?, ?)', [foodItemID, restaurantID, foodName, price]);
        res.redirect('/food_items');
    } catch (error) {
        console.error("Error updating food item:", error);
        res.status(500).send("An error occurred while updating the food item.");
    }
});

app.post('/update_food_items_orders', async function (req, res) {
    try {

        // const val = req.body.update_order_id_food_id
        // const [orderId, foodItemId] = val.split('|');
        const [orderId, foodItemId] = req.body.update_order_id_food_id.split('|');
        const quantity = req.body.update_food_item_order_quantity;

        await db.query('CALL UPDATE_FOOD_ITEMS_ORDERS(?, ?, ?)', [orderId, foodItemId, quantity]);
        res.redirect('/food_items_orders');
    } catch (error) {
        console.error("Error updating food item:", error);
        res.status(500).send("An error occurred while updating the food item.");
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

app.get('/food_items', async function (req, res) {
    try {
        // Create and execute our queries
        const query1 = fs.readFileSync(path.join(__dirname, 'queries', 'food_items.sql'), 'utf8');
        const [food] = await db.query(query1);

        const query2 = fs.readFileSync(path.join(__dirname, 'queries', 'food_items-restaurant_list.sql'), 'utf8');
        const [restaurant] = await db.query(query2);

        const query3 = fs.readFileSync(path.join(__dirname, 'queries', 'food_items-list.sql'), 'utf8');
        const [foods] = await db.query(query3);

        // Render the food_items.hbs file, and also send the renderer
        //  an object that contains the results of the query
        res.render('food_items', {food: food, restaurant: restaurant, foods: foods});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/restaurants', async function (req, res) {
    try {
        // Create and execute our queries
        const query1 = fs.readFileSync(path.join(__dirname, 'queries', 'restaurants.sql'), 'utf8');
        const [restaurant] = await db.query(query1);

        // Render the restaurants.hbs file, and also send the renderer
        //  an object that contains the results of the query
        res.render('restaurants', { restaurant: restaurant});
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
        const query1 = fs.readFileSync(path.join(__dirname, 'queries', 'customers.sql'), 'utf8');
        const [customer] = await db.query(query1);

        // Render the customers.hbs file, and also send the renderer
        //  an object that contains the results of the query
        res.render('customers', { customer: customer});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/food_items_orders', async function (req, res) {
    try {
        // Create and execute our queries

        const query1 = fs.readFileSync(path.join(__dirname, 'queries', 'food_items_orders.sql'), 'utf8');
        const [order] = await db.query(query1);

        const query2 = fs.readFileSync(path.join(__dirname, 'queries', 'orders.sql'), 'utf8');
        const [orders] = await db.query(query2);

        // Render the food_items_orders.hbs file, and also send the renderer
        //  an object that contains the results of the query
        res.render('food_items_orders', { order: order, orders: orders});
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