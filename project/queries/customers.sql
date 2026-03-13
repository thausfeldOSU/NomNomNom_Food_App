-- Citation: All my work
-- Used for the Customers page

-- Used for the customers page to read the data from this entity.

SELECT CONCAT(TRIM(C.FIRST_NAME), ' ', TRIM(C.LAST_NAME)) AS NAME, C.PHONE_NUMBER, C.ADDRESS, C.EMAIL
FROM CUSTOMERS AS C