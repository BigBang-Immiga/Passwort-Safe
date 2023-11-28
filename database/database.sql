CREATE DATABASE vault;
USE vault;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE data (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER NOT NULL,
    website VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    remarks VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (username, password)
VALUES 
('bob', '1234'),
('john', '1122');

INSERT INTO vaults (user_id, vault_name)
VALUES
(1, 'Bob\'s Vault'),
(2, 'John\'s Vault');

INSERT INTO data (vault_id, website, username, password, remarks)
VALUES
(1, 'www.digitec.com', 'bob', '1234', 'very good website');
