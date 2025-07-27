-- Création de la base de données
CREATE DATABASE IF NOT EXISTS library_management;
USE library_management;

-- Création de la table users
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table libraries
CREATE TABLE IF NOT EXISTS libraries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(200) NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- Création de la table books
CREATE TABLE IF NOT EXISTS books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(150) NOT NULL,
    genre VARCHAR(50) NOT NULL,
    library_id INT NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (library_id) REFERENCES libraries(id) ON DELETE CASCADE,
    INDEX idx_library_id (library_id),
    INDEX idx_available (available),
    INDEX idx_genre (genre)
);

-- Création de la table loans
CREATE TABLE IF NOT EXISTS loans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    borrower_id INT NOT NULL,
    book_id INT NOT NULL,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP NOT NULL,
    returned BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (borrower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    INDEX idx_borrower_id (borrower_id),
    INDEX idx_book_id (book_id),
    INDEX idx_returned (returned),
    INDEX idx_end_date (end_date)
);

-- Insertion de données de test
INSERT INTO users (name, email, password) VALUES 
('Jean Dupont', 'jean.dupont@email.com', '$2b$10$rOlTkw.7Vx8qzYhJwF.Pu.YtlxhvGxF9Kt4J2tK6zF9wE2hR8mS7i'), -- motdepasse: password123
('Marie Martin', 'marie.martin@email.com', '$2b$10$rOlTkw.7Vx8qzYhJwF.Pu.YtlxhvGxF9Kt4J2tK6zF9wE2hR8mS7i'), -- motdepasse: password123
('Pierre Durand', 'pierre.durand@email.com', '$2b$10$rOlTkw.7Vx8qzYhJwF.Pu.YtlxhvGxF9Kt4J2tK6zF9wE2hR8mS7i'); -- motdepasse: password123

INSERT INTO libraries (name, location, user_id) VALUES 
('Bibliothèque Centrale de Jean', 'Paris 1er arrondissement', 1),
('Collection de Marie', 'Lyon 2e arrondissement', 2),
('Librairie Pierre', 'Marseille Centre', 3);

INSERT INTO books (title, author, genre, library_id, available) VALUES 
-- Livres de Jean (library_id = 1)
('Le Petit Prince', 'Antoine de Saint-Exupéry', 'roman', 1, TRUE),
('1984', 'George Orwell', 'science-fiction', 1, TRUE),
('Les Misérables', 'Victor Hugo', 'roman', 1, FALSE),
('L\'Étranger', 'Albert Camus', 'roman', 1, TRUE),

-- Livres de Marie (library_id = 2)  
('Pride and Prejudice', 'Jane Austen', 'romance', 2, TRUE),
('To Kill a Mockingbird', 'Harper Lee', 'fiction', 2, TRUE),
('The Great Gatsby', 'F. Scott Fitzgerald', 'fiction', 2, FALSE),

-- Livres de Pierre (library_id = 3)
('Dune', 'Frank Herbert', 'science-fiction', 3, TRUE),
('The Lord of the Rings', 'J.R.R. Tolkien', 'fantasy', 3, TRUE),
('Harry Potter à l\'école des sorciers', 'J.K. Rowling', 'fantasy', 3, TRUE);

INSERT INTO loans (borrower_id, book_id, start_date, end_date, returned) VALUES 
-- Marie emprunte un livre de Jean (Les Misérables - non retourné)
(2, 3, '2024-01-15 10:00:00', '2024-01-29 10:00:00', FALSE),
-- Pierre emprunte un livre de Marie (The Great Gatsby - non retourné)  
(3, 7, '2024-01-20 14:30:00', '2024-02-03 14:30:00', FALSE),
-- Jean emprunte un livre de Pierre et l'a déjà retourné
(1, 8, '2024-01-01 09:00:00', '2024-01-15 09:00:00', TRUE);

-- Affichage des données pour vérification
SELECT 'Users:' as table_name;
SELECT * FROM users;

SELECT 'Libraries:' as table_name;
SELECT * FROM libraries;

SELECT 'Books:' as table_name;
SELECT * FROM books;

SELECT 'Loans:' as table_name;
SELECT * FROM loans;