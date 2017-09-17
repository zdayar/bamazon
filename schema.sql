drop database if exists bamazon;

create database bamazon;

use bamazon;

create table products (
	item_id integer(12) auto_increment not null,
    product_name varchar(200) not null,
    department_name varchar(100) not null,
    price decimal(10,2) null,
    stock_quantity integer(12),
    primary key (item_id)
);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
    ('Knife Set', 'Housewares', 130.00, 89),
    ('Table Lamp', 'Housewares', 75.00, 70),
    ('Floor Lamp', 'Housewares', 110.99, 90),
    ('Bistro Set', 'Outdoor', 175.00, 6),
    ('Comforter Set', 'Bedding', 150.00, 62),
    ('Down Comforter', 'Bedding', 140.00, 46),
    ('Ceramic Planter', 'Outdoor', 55.00, 78),
    ('Umbrella Stand', 'Outdoor', 75.00, 65),
    ('Umbrella', 'Outdoor', 110.00, 70),
    ('Pillow', 'Bedding', 35.00, 115);


