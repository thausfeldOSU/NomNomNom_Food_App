-- Citation: Google AI directed me to the SQL script to format the date in a more readable format (www.google.com)
--    otherwise, All My Work


-- Used for the Orders page which is really a hybrid of two tables: ORDERS and FOOD_ITEMS_ORDERS
--    I thought that just showing the FOOD_ITEMS_ORDERS page would be boring/confusing on it's own as it would
--    just be showing IDs without names. So I joined things together to make this a multipurpose page.

SELECT O.ORDER_ID, FI.FOOD_ITEM_ID AS FOOD_ID, DATE_FORMAT(O.ORDER_DATE, '%m/%d/%Y') AS ORDER_DATE, CONCAT(TRIM(C.FIRST_NAME), ' ', TRIM(C.LAST_NAME)) AS CUSTOMER_NAME,
R.NAME AS RESTAURANT_NAME, FI.NAME AS FOOD_NAME, FI.PRICE AS ITEM_PRICE, FIO.QUANTITY
FROM FOOD_ITEMS_ORDERS AS FIO
LEFT JOIN ORDERS AS O
ON FIO.ORDER_ID = O.ORDER_ID
LEFT JOIN FOOD_ITEMS AS FI
ON FIO.FOOD_ITEM_ID = FI.FOOD_ITEM_ID
LEFT JOIN RESTAURANTS AS R
ON FI.RESTAURANT_ID = R.RESTAURANT_ID
LEFT JOIN CUSTOMERS AS C
ON O.CUSTOMER_ID = C.CUSTOMER_ID