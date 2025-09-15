-- Database schema for OneMed1a friendship system
-- This script creates the necessary tables for user management and friendship relationships

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create friendships table
CREATE TABLE IF NOT EXISTS friendships (
    id BIGSERIAL PRIMARY KEY,
    requester_id BIGINT NOT NULL,
    addressee_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED', 'BLOCKED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    CONSTRAINT fk_friendship_requester FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_friendship_addressee FOREIGN KEY (addressee_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicate friendship requests
    CONSTRAINT uk_friendship_users UNIQUE (requester_id, addressee_id),
    
    -- Check constraint to prevent self-friendship
    CONSTRAINT chk_no_self_friendship CHECK (requester_id != addressee_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_friendships_requester ON friendships(requester_id);
CREATE INDEX IF NOT EXISTS idx_friendships_addressee ON friendships(addressee_id);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON friendships(status);
CREATE INDEX IF NOT EXISTS idx_friendships_created_at ON friendships(created_at);

-- Create a composite index for common query patterns
CREATE INDEX IF NOT EXISTS idx_friendships_user_status ON friendships(requester_id, addressee_id, status);

-- Insert sample users for testing (optional - remove in production)
INSERT INTO users (username, email, password, first_name, last_name) VALUES
('johndoe', 'john.doe@example.com', '$2a$10$abcd...', 'John', 'Doe'),
('janesmith', 'jane.smith@example.com', '$2a$10$efgh...', 'Jane', 'Smith'),
('bobwilson', 'bob.wilson@example.com', '$2a$10$ijkl...', 'Bob', 'Wilson')
ON CONFLICT (username) DO NOTHING;
