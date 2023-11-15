CREATE DATABASE vault;
USE vault;

CREATE TABLE users (
    id integer PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO users (username, password)
VALUES 
('bob', '1234'),
('john', '1122');

CREATE TABLE data (
    id integer PRIMARY KEY AUTO_INCREMENT,
    website VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    remarks VARCHAR(255) NOT NULL
);

INSERT INTO data (website, username, password, remarks )
VALUES
('www.digitec.com', 'bob', '1234', 'very good website');