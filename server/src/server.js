// ========================================
// IMPORTS - Load the packages we need
// ========================================

import express from 'express';        // Web framework for handling HTTP requests
import cors from 'cors';              // Allows frontend (different port) to connect to backend
import dotenv from 'dotenv';          // Loads secret keys and settings from .env file

// ========================================
// CONFIGURATION
// ========================================

// Load environment variables from .env file into process.env
dotenv.config();

// Create Express application instance (this is our server!)
const app = express();

// Get port number from environment variable, or use 5000 if not set
const PORT = process.env.PORT || 5000;

// ========================================
// MIDDLEWARE (runs on EVERY request before it reaches our routes)
// ========================================

// 1. CORS - Cross-Origin Resource Sharing
// Allows our React app (localhost:5173) to talk to this server (localhost:5000)
// Without this, browsers block requests between different ports (security feature)
app.use(cors());

// 2. JSON Parser
// Converts incoming JSON data into JavaScript objects
// Example: {"name": "Acme Corp"} becomes req.body.name = "Acme Corp"
app.use(express.json());

// 3. URL-Encoded Parser
// Parses data from HTML forms
// extended: true means it can handle complex objects
app.use(express.urlencoded({ extended: true }));

// ========================================
// ROUTES (API Endpoints)
// ========================================

// Health Check Endpoint
// Purpose: Test if the server is running and responding
// URL: GET http://localhost:5000/api/health
// Response: JSON object with status and timestamp
app.get('/api/health', (req, res) => {
  // req = request object (data coming FROM the client)
  // res = response object (data going BACK to the client)
  
  res.json({ 
    status: 'OK',                        // Server is working
    message: 'Server is running!',       // Human-readable message
    timestamp: new Date().toISOString()  // Current time (ISO format)
  });
});

// ========================================
// START SERVER
// ========================================

// Listen for incoming requests on the specified PORT
// Once server starts, the callback function runs
app.listen(PORT, () => {
  // These messages print to the terminal when server starts
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});