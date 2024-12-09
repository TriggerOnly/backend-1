CREATE TABLE shop (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    address VARCHAR(255)
);

CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    shop_id INT,
    PLU VARCHAR(255),
    name VARCHAR(255),
    count_on_shelf INT,
    count_in_basket INT,
    CONSTRAINT fk_shop FOREIGN KEY (shop_id) REFERENCES shop(id) ON DELETE CASCADE
); 

CREATE TABLE remain (
    id SERIAL PRIMARY KEY,
    shop_id INT,
    product_id INT,
    quantity INT,
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
); 
