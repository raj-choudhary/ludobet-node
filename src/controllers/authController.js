const User = require('../models/User');

class AuthController {
  static async login(req, res) {
    try {
      const { mobile, name } = req.body;
      if (!mobile) return res.status(400).json({ error: 'Mobile number is required.' });

      let user = await User.findByMobile(mobile);
      if (!user) {
        user = await User.create({ mobile, name: name || 'Player_' + mobile.slice(-4) });
      }

      const token = 'JWT_USR_' + Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
      res.json({ success: true, token, user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = AuthController;
