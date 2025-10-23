-- Migration: Add category and split_type columns to expenses table
USE expense_splitter;

-- Add category column (string) to store category directly
ALTER TABLE expenses 
ADD COLUMN category VARCHAR(50) DEFAULT 'other' AFTER category_id;

-- Add split_type column to store how expense is split
ALTER TABLE expenses 
ADD COLUMN split_type ENUM('equal', 'custom', 'percentage') DEFAULT 'equal' AFTER category;

-- Update existing rows
UPDATE expenses SET category = 'other' WHERE category IS NULL;
UPDATE expenses SET split_type = 'equal' WHERE split_type IS NULL;

-- Add index for better query performance
ALTER TABLE expenses ADD INDEX idx_category (category);
