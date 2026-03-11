-- Citation: Previously had a partner who supported throughout this query. We did it together, but we are no longer submitting together.
--           Otherwise, All My Work


-- The bottom READ queries are pretty straightforward. The ORDERS and FOOD_ITEMS_ORDERS query has some commentary, but otherwise, not much to say.
--CUSTOMERS
SELECT CUSTOMER_ID, FIRST_NAME, LAST_NAME, PHONE_NUMBER, ADDRESS, EMAIL 
FROM CUSTOMERS;

--RESTAURANTS
SELECT RESTAURANT_ID, RATING, NAME, PHONE_NUMBER, ADDRESS, EMAIL 
FROM RESTAURANTS;


-- This was the original query for the Orders page on the website, but it became clear that in order to delete and show the records appropriately after deleting,
-- the query needed to have the FOOD_ITEMS_ORDERS table as the main one to be pulled from.
-- We had just combined these two tables into one view since FOOD_ITEMS_ORDERS on it's own would be hard for the user to understand. All it has in it is two foreign
-- key IDs that together make up a primary key (they are unique together) and then a QUANTITY attribute, so didn't want to just show that.
--ORDERS
SELECT ORDERS.ORDER_ID, ORDER_DATE, CUSTOMERS.FIRST_NAME, CUSTOMERS.LAST_NAME,
RESTAURANTS.NAME, FOOD_ITEMS.NAME, FOOD_ITEMS.PRICE, FOOD_ITEMS_ORDERS.QUANTITY
FROM ORDERS
LEFT JOIN FOOD_ITEMS_ORDERS 
ON ORDERS.ORDER_ID = FOOD_ITEMS_ORDERS.ORDER_ID
LEFT JOIN FOOD_ITEMS 
ON FOOD_ITEMS.FOOD_ITEM_ID = FOOD_ITEMS_ORDERS.FOOD_ITEM_ID
LEFT JOIN RESTAURANTS 
ON FOOD_ITEMS.RESTAURANT_ID = RESTAURANTS.RESTAURANT_ID
LEFT JOIN CUSTOMERS 
ON ORDERS.CUSTOMER_ID = CUSTOMERS.CUSTOMER_ID;

--FOOD_ITEMS
SELECT FOOD_ITEMS.FOOD_ITEM_ID, RESTAURANTS.NAME, FOOD_ITEMS.NAME, FOOD_ITEMS.PRICE
FROM FOOD_ITEMS 
LEFT JOIN RESTAURANTS 
ON RESTAURANTS.RESTAURANT_ID = FOOD_ITEMS.RESTAURANT_ID;

-- After the realization as described above for the ORDERs query, decided to refactor that query to look like this to suite our needs.
-- It is used on the Orders page of the website.
--FOOD_ITEMS_ORDERS
SELECT ORDERS.ORDER_ID, FOOD_ITEMS.FOOD_ITEM_ID, FOOD_ITEMS.NAME, CUSTOMERS.FIRST_NAME, CUSTOMERS.LAST_NAME FROM FOOD_ITEMS_ORDERS
LEFT JOIN FOOD_ITEMS ON FOOD_ITEMS_ORDERS.FOOD_ITEM_ID = FOOD_ITEMS.FOOD_ITEM_ID
LEFT JOIN ORDERS ON FOOD_ITEMS_ORDERS.ORDER_ID = ORDERS.ORDER_ID
LEFT JOIN CUSTOMERS ON ORDERS.CUSTOMER_ID = CUSTOMERS.CUSTOMER_ID;

--Since the relationship requires a join, deleting a food item deletes all orders depending on/containing that food item
-- These TWO delete queries were used for the delete button functionality in the Food Items page. Of course changed a little since we used PL.
DELETE FROM FOOD_ITEMS_ORDERS 
WHERE FOOD_ITEM_ID = :FOOD_ITEM_ID_FROM_FORM;

DELETE FROM FOOD_ITEMS 
WHERE FOOD_ITEM_ID = :FOOD_ITEM_ID_FROM_FORM;

-- This was in order to delete a specific food that was ordered on a specific order. No intent of deleting all instances throughout the database
-- of the food item or order individually, just this specific intersection.
-- Used for the delete button functionality in the Orders page.
DELETE FROM FOOD_ITEMS_ORDERS
WHERE (ORDER_ID = :ORDER_ID_FROM_FORM AND FOOD_ITEM_ID = FOOD_ITEM_ID_FROM_FORM);

INSERT INTO FOOD_ITEMS (RESTAURANT_ID, NAME, PRICE) VALUES (:RESTAURANT_ID, :NAME, :PRICE);

-- Updates a particular food item. A peer review commented that you shouldn't be able to update a food item that doesn't already belong to a particular restaurant. That wasn't the 
-- intent of this. The intent was to be able to drill down to a particular food item in the database and be able to change anything about it, including the restaurant that
-- it is associated to. So this functionality has been kept.
UPDATE FOOD_ITEMS SET RESTAURANT_ID=:RESTAURANT_ID, FOOD_ITEM_ID=:FOOD_ITEM_ID,
NAME=:NAME, PRICE=:PRICE 
WHERE FOOD_ITEM_ID=:FOOD_ITEM_ID_TO_UPDATE;