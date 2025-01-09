const express = require('express');
const { img } = require('vamtec');
const leaveDataController = require('../controllers/leaveDataController');
const router = express.Router();

router.get('/', leaveDataController.getAllLeaveData);
router.put('/admin/:user_id', leaveDataController.updateLeaveData);
router.post('/apply_leave', img(['uploads/users_leave_documents', 'timestamp', 'file']), leaveDataController.applyLeave);
router.put('/reduce_leave_balance', leaveDataController.reduceLeaveBalance);
router.get('/get-all-status', leaveDataController.getAllLeaveApplications);
router.put('/update-leave-status/:id', leaveDataController.updateLeaveStatus);
router.delete('/delete-leave-request/:id', leaveDataController.deleteLeaveApplication);

module.exports = router;