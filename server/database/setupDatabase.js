import fs from 'fs';
import pool from '../config/database.js';

async function initializeDatabase() {
    try {
        const schemaApplied = fs.existsSync('.schema_applied');
        
        // Check if schema has already been applied
        if (schemaApplied) {
            console.log('Schema has already been applied.');
            return;
        }
        
        // Load and apply schema
        const schema = fs.readFileSync('./schema.sql', 'utf-8');
        await pool.query(schema);
        
        // Create a file to indicate that the schema has been applied
        fs.writeFileSync('.schema_applied', 'Schema applied');
        console.log('Database schema applied successfully.');
    } catch (error) {
        console.error('Error applying schema:', error);
    }
}

// Run the function immediately when the file is executed
initializeDatabase();
