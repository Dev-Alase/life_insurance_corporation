-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS insurance_db;


-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  type ENUM('policyholder', 'agent') NOT NULL,
  license_number VARCHAR(50) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Policies table
CREATE TABLE IF NOT EXISTS policies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type VARCHAR(100) NOT NULL,
  status ENUM('pending', 'active', 'expired', 'cancelled') NOT NULL,
  premium DECIMAL(10,2),
  expiry_date DATE,
  policyholder_id INT NOT NULL,
  agent_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (policyholder_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (agent_id) REFERENCES users(id)
);

-- Claims table
CREATE TABLE IF NOT EXISTS claims (
  id INT PRIMARY KEY AUTO_INCREMENT,
  policy_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  status ENUM('pending', 'approved', 'rejected') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (policy_id) REFERENCES policies(id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  policy_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'successful', 'failed') NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (policy_id) REFERENCES policies(id) ON DELETE CASCADE
);

-- Agent ratings table
CREATE TABLE IF NOT EXISTS agent_ratings (
  agent_id INT NOT NULL,
  policyholder_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (agent_id, policyholder_id),
  FOREIGN KEY (agent_id) REFERENCES users(id),
  FOREIGN KEY (policyholder_id) REFERENCES users(id) ON DELETE CASCADE
);
