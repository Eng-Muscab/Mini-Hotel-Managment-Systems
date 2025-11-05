import pool from "../config/db.js";

// src/core/sydClass.js
export default class sydClass {
    constructor() {
        this.db = pool; // Your database connection
    }

    async search(query, params = []) {
        // Add query logging and sanitization
        // console.log(`Query: ${query}, Params: ${params}`);
        return await this.db.query(query, params);
    }

    async operation(query, params = []) {
        // Add transaction support and error handling
        // console.log(`Operation: ${query}, Params: ${params}`);
        return await this.db.query(query, params);
    }

    // Add method to check user permissions
    async checkPermission(userId, permission) {
        const result = await this.search(
            "SELECT * FROM user_permissions WHERE user_id = $1 AND permission = $2",
            [userId, permission]
        );
        return result.length > 0;
    }

    // Add method to get user role
    async getUserRole(userId) {
        const result = await this.search(
            "SELECT role FROM users WHERE user_id = $1",
            [userId]
        );
        return result[0]?.role || null;
    }
}