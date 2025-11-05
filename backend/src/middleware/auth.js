// src/middleware/auth.js
import jwt from 'jsonwebtoken';
import sydClass from "../core/sydClass.js";

const syd = new sydClass();

export const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await syd.search("SELECT * FROM users WHERE user_id = $1", [decoded.id]);
        
        if (!user[0]) {
            return res.status(401).json({ error: 'Invalid token.' });
        }

        req.user = user[0];
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

export const requireRole = (requiredRole) => {
    return async (req, res, next) => {
        try {
            const userRole = await syd.getUserRole(req.user.id);
            const roleHierarchy = {
                'viewer': 1,
                'staff': 2,
                'manager': 3,
                'admin': 4
            };

            if (roleHierarchy[userRole] < roleHierarchy[requiredRole]) {
                return res.status(403).json({ error: 'Insufficient permissions' });
            }

            next();
        } catch (error) {
            res.status(403).json({ error: 'Permission check failed' });
        }
    };
};