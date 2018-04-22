DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE inventory (
ID INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(30) NOT NULL,
department VARCHAR(30) NOT NULL,
price INT(10) NOT NULL,
quantity INT(10) NOT NULL
);

INSERT INTO inventory (name, department, price, quantity)
VALUES ("Very Good Bike", "Sporting Goods", 300, 25);

INSERT INTO inventory (name, department, price, quantity)
VALUES ("OK Bike", "Sporting Goods", 150, 40);

INSERT INTO inventory (name, department, price, quantity)
VALUES ("Nice Shirt", "Clothing", 40, 100);

INSERT INTO inventory (name, department, price, quantity)
VALUES ("Fancy Pants", "Clothing", 55, 70);

INSERT INTO inventory (name, department, price, quantity)
VALUES ("Xbox One", "Electronics", 350, 140);

INSERT INTO inventory (name, department, price, quantity)
VALUES ("Nintendo Switch", "Electronics", 250, 65);

INSERT INTO inventory (name, department, price, quantity)
VALUES ("LG SmartTV", "Electronics", 500, 35);

INSERT INTO inventory (name, department, price, quantity)
VALUES ("Eat Pray Love", "Books", 20, 125);

INSERT INTO inventory (name, department, price, quantity)
VALUES ("Gone Girl", "Books", 20, 200);

INSERT INTO inventory (name, department, price, quantity)
VALUES ("Large Fancy Clock", "Decor", 250, 15);