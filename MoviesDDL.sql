/*
Epic Theater Management System
CS 340 - Introduction to Databases
Prepared by: 
  Alvaro Espinoza
  Sean Henry
*/

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

/*Drop any tables if they exist*/
DROP TABLE IF EXISTS Movies;
DROP TABLE IF EXISTS Screens;
DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS Showtimes;
DROP TABLE IF EXISTS Tickets;

/* Creating Movies Table */
CREATE OR REPLACE TABLE Movies (
  movieID int AUTO_INCREMENT NOT NULL,
  title varchar(145) NOT NULL,
  genre varchar(145) NOT NULL,
  duration int NOT NULL,
  PRIMARY KEY (movieID)
);

/* Creating Screens Table */
CREATE OR REPLACE TABLE Screens (
  screenID int AUTO_INCREMENT NOT NULL,
  screenNumber int UNIQUE NOT NULL,
  seatingCapacity int NOT NULL,
  PRIMARY KEY (screenID)
);

/* Creating Customers Table */
CREATE OR REPLACE TABLE Customers (
  customerID int AUTO_INCREMENT NOT NULL,
  name varchar(145) NOT NULL,
  email varchar(145) UNIQUE,
  PRIMARY KEY (customerID)
);

/* Creating Showtimes Table */
CREATE OR REPLACE TABLE Showtimes (
  showtimeID int AUTO_INCREMENT NOT NULL,
  showDate date NOT NULL,
  startTime time NOT NULL,
  movieID int NOT NULL,
  screenID int NOT NULL,
  PRIMARY KEY (showtimeID),
  FOREIGN KEY (movieID) references Movies(movieID)
    ON DELETE RESTRICT,
  FOREIGN KEY (screenID) references Screens(screenID)
    ON DELETE RESTRICT
);

/* Creating Tickets Table */
CREATE OR REPLACE TABLE Tickets (
  ticketID int AUTO_INCREMENT NOT NULL,
  purchaseDate dateTime NOT NULL,
  ticketPrice decimal(5,2) NOT NULL,
  showtimeID int NOT NULL,    
  customerID int NOT NULL,
  PRIMARY KEY (ticketID),
  FOREIGN KEY (customerID) references Customers(customerID)
    ON DELETE RESTRICT,
  FOREIGN KEY (showtimeID) references Showtimes(showtimeID)
    ON DELETE CASCADE
);

/* Inserting data to Movies Table */
INSERT INTO Movies (title, genre, duration) VALUES
('Avatar Fire and Ash', 'Action', 197),
('Zootopia 2', 'Computer Animated', 108),
('Dune: Part Two', 'Adventure', 166),
('A Minecraft Movie', 'Adventure', 101);

/* Inserting data to Screens Table */
INSERT INTO Screens (screenNumber, seatingCapacity) VALUES
(1,30),
(2,35),
(3,25),
(4,30);

/* Inserting data to Showtimes,es Table */
INSERT INTO Showtimes (showDate, startTime, movieID, screenID) VALUES
('2026-01-20', '10:00:00', 1, 2),
('2026-01-20', '12:30:00', 1, 4),
('2026-01-20', '15:00:00', 3, 3),
('2026-01-20', '15:30:00', 4, 1);

/* Inserting data to Customers Table */
INSERT INTO Customers (name, email) VALUES
('Kevin','kevinG@example.com'),
('Bob',NULL),
('Robert','robertL@example.net'),
('Isaac','isaacK@example.net');

/* Inserting data to Tickets Table */
INSERT INTO Tickets (purchaseDate, ticketPrice, customerID, showtimeID) VALUES
('2026-01-20 09:30:00', 15.50, 3, 1),
('2026-01-18 13:31:00', 12.75, 1, 3),
('2026-01-15 20:43:00', 15.50, 4, 3),
('2026-01-20 09:57:00', 12.75, 2, 1);


SET FOREIGN_KEY_CHECKS=1;
COMMIT;