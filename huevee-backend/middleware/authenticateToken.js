import jwt from 'jsonwebtoken';
import pool from '../db/index.js'; // pastikan ini mengarah ke koneksi PostgreSQL kamu

export async function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query('SELECT id, role FROM users WHERE id = $1', [decoded.userId]);

    if (result.rows.length === 0) return res.sendStatus(403);

    req.user = {
      userId: result.rows[0].id,
      role: result.rows[0].role, // 'user' atau 'admin'
    };

    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.sendStatus(403);
  }
}