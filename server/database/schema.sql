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


ALTER TABLE policies ADD pdf LONGBLOB;
ALTER TABLE claims ADD pdf LONGBLOB;


ALTER TABLE policies
ADD COLUMN total_premiums INT NOT NULL DEFAULT 1, -- Total number of premiums to be paid
ADD COLUMN payment_frequency ENUM('monthly', 'quarterly', 'yearly') NOT NULL DEFAULT 'monthly', -- Payment schedule
ADD COLUMN claim_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00; -- Amount paid to policyholder on a claim


-- Fuctions -- 

DELIMITER $$

CREATE FUNCTION GetAgentAverageRating(agent_id INT)
RETURNS DECIMAL(3,2)
DETERMINISTIC
BEGIN
  DECLARE average_rating DECIMAL(3,2);
  SELECT AVG(rating) INTO average_rating
  FROM agent_ratings
  WHERE agent_id = agent_id;
  RETURN COALESCE(average_rating, 0);
END$$

DELIMITER ;


DELIMITER $$

CREATE FUNCTION get_summary(user_type ENUM('policyholder', 'agent'), user_id INT)
RETURNS JSON
DETERMINISTIC
BEGIN
    DECLARE result JSON;

    IF user_type = 'policyholder' THEN
        SET result = JSON_OBJECT(
            'number_of_policies', (
                SELECT COUNT(p.id) 
                FROM policies p 
                WHERE p.policyholder_id = user_id
            ),
            'total_premium', (
                SELECT COALESCE(SUM(p.premium), 0) 
                FROM policies p 
                WHERE p.policyholder_id = user_id
            ),
            'number_of_agents', (
                SELECT COUNT(DISTINCT p.agent_id) 
                FROM policies p 
                WHERE p.policyholder_id = user_id
            ),
            'number_of_claims', (
                SELECT COUNT(c.id) 
                FROM claims c
                JOIN policies p ON c.policy_id = p.id
                WHERE p.policyholder_id = user_id
            )
        );
    ELSEIF user_type = 'agent' THEN
        SET result = JSON_OBJECT(
            'number_of_policies', (
                SELECT COUNT(p.id) 
                FROM policies p 
                WHERE p.agent_id = user_id
            ),
            'total_premium', (
                SELECT COALESCE(SUM(p.premium), 0) 
                FROM policies p 
                WHERE p.agent_id = user_id
            ),
            'number_of_policyholders', (
                SELECT COUNT(DISTINCT p.policyholder_id) 
                FROM policies p 
                WHERE p.agent_id = user_id
            ),
            'number_of_claims', (
                SELECT COUNT(c.id) 
                FROM claims c
                JOIN policies p ON c.policy_id = p.id
                WHERE p.agent_id = user_id
            )
        );
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid user type';
    END IF;

    RETURN result;
END$$

DELIMITER ;


-- -- Triggers --

DELIMITER $$

CREATE TRIGGER UpdatePolicyStatusOnPayment
AFTER INSERT ON payments
FOR EACH ROW
BEGIN

  IF (
    SELECT COUNT(*) 
    FROM payments 
    WHERE policy_id = NEW.policy_id AND status = 'successful'
  ) >= (
    SELECT total_premiums 
    FROM policies 
    WHERE id = NEW.policy_id
  ) THEN
    UPDATE policies
    SET status = 'expired'
    WHERE id = NEW.policy_id;
  END IF;
END$$

DELIMITER ;

-- Procedure --

DELIMITER $$

CREATE PROCEDURE UpdateClaimAndPolicyStatus(
  IN claimId INT,
  IN agentId INT,
  IN newStatus VARCHAR(20)
)
BEGIN
  -- Update claim status
  UPDATE claims
  SET status = newStatus
  WHERE id = claimId;

  -- Update policy status if claim is approved
  IF newStatus = 'approved' THEN
    UPDATE policies
    SET status = 'expired'
    WHERE id = (SELECT policy_id FROM claims WHERE id = claimId) AND agent_id = agentId;
  END IF;
END$$

DELIMITER ;


--  Roles --

CREATE ROLE POLICYHOLDER_ROLE;
CREATE ROLE AGENT_ROLE;

-- Grant privileges to POLICYHOLDER_ROLE
GRANT SELECT, INSERT ON policies TO POLICYHOLDER_ROLE;
GRANT SELECT, INSERT, UPDATE ON claims TO POLICYHOLDER_ROLE;

-- Grant privileges to AGENT_ROLE
GRANT SELECT, INSERT, UPDATE, DELETE ON policies TO AGENT_ROLE;
GRANT SELECT, INSERT ON agent_ratings TO AGENT_ROLE;