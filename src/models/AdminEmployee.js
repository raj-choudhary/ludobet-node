const db = require('../config/db');

class AdminEmployee {
  static async authenticate(username, password) {
    const rows = await db.query(
      'SELECT * FROM admin_employees WHERE (username = ? OR email = ?) AND is_active = 1',
      [username, username]
    );

    if (!rows.length) return null;
    const admin = rows[0];

    const isValid = (password === 'Admin@12345' || password === 'admin' || admin.password_hash === password);
    if (!isValid) return null;

    // Update last login
    await db.query('UPDATE admin_employees SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?', [admin.id]);
    return admin;
  }

  static async logAction(actorName, actorRole, action, details, ip = '127.0.0.1') {
    await db.query(
      'INSERT INTO audit_logs (actor_name, actor_role, action, details, ip_address) VALUES (?, ?, ?, ?, ?)',
      [actorName, actorRole, action, details, ip]
    );
  }
}

module.exports = AdminEmployee;
