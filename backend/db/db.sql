CREATE DATABASE IF NOT EXISTS keys_php;
USE keys_php;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    main_pass LONGTEXT,
    picture LONGTEXT
);

CREATE TABLE softwares (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon LONGTEXT
);

CREATE TABLE passwords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    value TEXT NOT NULL,
    user_id INT NOT NULL,
    software_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (software_id) REFERENCES softwares(id) ON DELETE SET NULL
);

CREATE TABLE feedbacks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    level TINYINT NOT NULL CHECK (level BETWEEN 0 AND 5),
    message TEXT NOT NULL
);

CREATE TABLE cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(100),
    masked_number VARCHAR(25),
    encrypted_number TEXT NOT NULL,
    cardholder_name VARCHAR(100),
    brand VARCHAR(50),
    type VARCHAR(20),
    issuer_bank VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE digital_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    photo LONGTEXT NOT NULL,
    nickname VARCHAR(100)
);

CREATE TABLE credit_cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(100),
    masked_number VARCHAR(25),
    encrypted_number TEXT NOT NULL,
    cardholder_name VARCHAR(100),
    brand VARCHAR(50),
    issuer_bank VARCHAR(100),
    credit_limit DECIMAL(10,2),
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE debit_cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(100),
    masked_number VARCHAR(25),
    encrypted_number TEXT NOT NULL,
    cardholder_name VARCHAR(100),
    brand VARCHAR(50),
    issuer_bank VARCHAR(100),
    linked_account VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
