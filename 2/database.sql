CREATE TABLE productHistoryAction (
    id SERIAL PRIMARY KEY,
    shop_id INT,
    PLU VARCHAR(255),
    date VARCHAR(255), 
    action VARCHAR(255)
); 

CREATE TABLE remainHistoryAction (
    id SERIAL PRIMARY KEY,
    shop_id INT, 
    date VARCHAR(255), 
    action VARCHAR(255)
); 
