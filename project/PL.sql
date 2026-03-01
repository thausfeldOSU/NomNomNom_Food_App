-- Delete a food item
DROP PROCEDURE IF EXISTS DELETE_FOOD_ITEM;
DELIMITER //

CREATE PROCEDURE DELETE_FOOD_ITEM(
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
    -- WHERE ORDER_ID IN (SELECT ORDER_ID FROM FOOD_ITEM_ORDERS WHERE FOOD_ITEM_ID = p_foodItemId);
       
    -- Delete the food item itself
    DELETE FROM FOOD_ITEMS 
    WHERE FOOD_ITEM_ID = p_foodItemId;
    
    COMMIT;
END //


-- Delete an order
DROP PROCEDURE IF EXISTS DELETE_ORDER;
DELIMITER //

CREATE PROCEDURE DELETE_ORDER(
    IN p_orderId INT
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
    WHERE ORDER_ID = p_orderId;
    -- WHERE FOOD_ITEM_ID IN (SELECT FOOD_ITEM_ID FROM FOOD_ITEM_ORDERS WHERE ORDER_ID = p_orderId);
       
    -- Delete the order itself
    DELETE FROM ORDERS 
    WHERE ORDER_ID = p_orderId;
    
    COMMIT;
END //

DELIMITER ;