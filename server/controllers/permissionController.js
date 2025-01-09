const Permission = require('../models/permissionModel');

const permissionController = {
  async addPermission(req, res) {
    const { user_id, date, in_time, out_time, reason } = req.body;

    if (!user_id || !date || !in_time || !out_time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const permission = await Permission.addPermission(user_id, date, in_time, out_time, reason);
      res.status(200).json({
        message: 'Permission added successfully',
        data: permission,
      });
    } catch (err) {
      console.error('Error details:', err);
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  },

  async getAllPermissions(req, res) {
    try {
      const permissions = await Permission.getAllPermissions();
      res.status(200).json({ message: "Success", result: permissions });
    } catch (err) {
      console.error('Error fetching permissions:', err);
      res.status(500).json({ error: 'Failed to fetch permission data' });
    }
  },

  async updatePermissionStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    try {
      const updatedPermission = await Permission.updatePermissionStatus(id, status);

      if (!updatedPermission) {
        return res.status(404).json({ error: 'Permission request not found' });
      }

      res.status(200).json({
        message: 'Permission status updated successfully',
        data: updatedPermission,
      });
    } catch (err) {
      console.error('Error updating permission status:', err);
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  }
};

module.exports = permissionController;