const pool = require('../config/db');

const Permission = {
  async addPermission(user_id, date, in_time, out_time, reason) {
    const query = `
      INSERT INTO Permissions (user_id, date, in_time, out_time, reason)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [user_id, date, in_time, out_time, reason];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getAllPermissions() {
    const query = 'SELECT * FROM permissions';
    const result = await pool.query(query);
    return result.rows;
  },

  async updatePermissionStatus(id, status) {
    const query = `
      UPDATE permissions SET status = $1 WHERE id = $2 RETURNING *`;
    const values = [status, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
};

module.exports = Permission;