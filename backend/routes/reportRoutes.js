const express = require('express');

const { getDashboardReport, getMonthlyReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/dashboard', getDashboardReport);
router.get('/monthly', getMonthlyReport);

module.exports = router;