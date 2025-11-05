// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes - ADD src/ to the paths
import bedRoutes from './modules/beds/bed.route.js';
import auth from './modules/auth/auth.routes.js';
import bookingRoutes from './modules/booking/booking.routes.js';
import roomRoutes from './modules/room/root.routes.js'
import customerRoutes from './modules/customers/cus.routes.js';
import roomBedRoutes from './modules/room_beds/rm.routes.js';

// Import other routes you want to test
// import bookingRoutes from './src/modules/booking/booking.route.js';
// import customerRoutes from './src/modules/customers/cus.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route for health check
app.get('/', (req, res) => {
    res.json({ 
        message: 'Server is running!', 
        timestamp: new Date().toISOString(),
        modules: ['beds', 'auth'] // Updated to include auth
    });
});

// API Routes - CORRECT PATHS
app.use('/api/beds', bedRoutes);
app.use("/api/auth", auth);
app.use('/api/booking', bookingRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/room_beds', roomBedRoutes);
app.use('/api/customers', customerRoutes);



// If you want to test other modules later, uncomment them:
// app.use('/api/booking', bookingRoutes);
// app.use('/api/customers', customerRoutes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found`
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global Error Handler:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

export default app;