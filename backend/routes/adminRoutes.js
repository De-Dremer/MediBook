const express = require('express');
const router = express.Router();

// ✅ Basic admin routes
router.get('/stats', (req, res) => {
    res.json({
        success: true,
        message: 'Admin stats endpoint',
        stats: {
            totalUsers: 5,
            totalAppointments: 0,
            systemStatus: 'healthy'
        }
    });
});

module.exports = router;
