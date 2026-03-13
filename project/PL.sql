-- Citation: Google AI helped remind me how to properly take in a value and setup the exception case when there is an error. This was used in every PL statement below (www.google.com)
--           otherwise, All My Work

-- Delete a food item
DROP PROCEDURE IF EXISTS DELETE_FOOD_ITEM;
DELIMITER //

CREATE PROCEDURE DELETE_FOOD_ITEM(
    -- take in the specific food item to delete, as it's ID
    IN p_foodItemId INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error deleting food item';
    END;
    
    START TRANSACTION;
    
    -- Delete all instances of the food item in the intersection table
    DELETE FROM FOOD_ITEMS_ORDERS
    WHERE FOOD_ITEM_ID = p_foodItemId;
       
    -- Delete the food item itself
    DELETE FROM FOOD_ITEMS 
    WHERE FOOD_ITEM_ID = p_foodItemId;
    
    COMMIT;
END //


-- Delete an order
DROP PROCEDURE IF EXISTS DELETE_ORDER_FOOD_ITEM;
DELIMITER //

CREATE PROCEDURE DELETE_ORDER_FOOD_ITEM(
    -- take in a particular order and food item to delete
    IN p_orderId INT,
    IN p_foodId INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error deleting order';
    END;
    
    START TRANSACTION;
    
    -- Delete all instances of the order in the intersection table
    DELETE FROM FOOD_ITEMS_ORDERS
    WHERE (ORDER_ID = p_orderId AND FOOD_ITEM_ID = p_foodId);
    
    COMMIT;
END //

-- Create a food item
DROP PROCEDURE IF EXISTS CREATE_FOOD_ITEM;
DELIMITER //

CREATE PROCEDURE CREATE_FOOD_ITEM(
    -- take in a given retaurant ID, food name (not id), and price to make a new food item
    IN RESTAURANT_ID_IN INT,
    IN FOOD_NAME_IN VARCHAR(255),
    IN PRICE_IN DECIMAL(6,2)
    
)
BEGIN
    DECLARE RESTAURANT_ID_VAR INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error creating food item';
    END;
    
    START TRANSACTION;
    
    -- insert the new food item to the database
    INSERT INTO FOOD_ITEMS (RESTAURANT_ID, NAME, PRICE) VALUES (RESTAURANT_ID_IN, FOOD_NAME_IN, PRICE_IN);
    
    COMMIT;
END //

-- Update a food item
DROP PROCEDURE IF EXISTS UPDATE_FOOD_ITEM;
DELIMITER //

CREATE PROCEDURE UPDATE_FOOD_ITEM(
    -- take in these values to update the food item
    IN FOOD_ITEM_ID_IN INT,
    IN RESTAURANT_ID_IN INT,
    IN FOOD_NAME_IN VARCHAR(255),
    IN PRICE_IN DECIMAL(6,2)
    
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error updating food item';
    END;
    
    START TRANSACTION;
    
    -- use the values above to update a food item in the database. It's important to note that a given record (a food item) can change the restaurant it is assigned to
    UPDATE FOOD_ITEMS 
    SET RESTAURANT_ID = RESTAURANT_ID_IN, NAME = FOOD_NAME_IN, PRICE = PRICE_IN 
    WHERE FOOD_ITEM_ID = FOOD_ITEM_ID_IN;

    COMMIT;
END //


-- Update a food item order
DROP PROCEDURE IF EXISTS UPDATE_FOOD_ITEMS_ORDERS;
DELIMITER //

CREATE PROCEDURE UPDATE_FOOD_ITEMS_ORDERS(
    -- take in these values for updating
    IN ORDER_ID_IN INT,
    IN FOOD_ITEM_ID_IN INT,
    IN QUANTITY_IN INT
    
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error updating food item';
    END;
    
    START TRANSACTION;
    
    -- update the database with the given values we took in above
    UPDATE FOOD_ITEMS_ORDERS
    SET QUANTITY = QUANTITY_IN
    WHERE FOOD_ITEM_ID = FOOD_ITEM_ID_IN AND ORDER_ID = ORDER_ID_IN;

    COMMIT;
END //

DELIMITER ;