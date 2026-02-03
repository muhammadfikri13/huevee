import pool from '../db/index.js';
import bcrypt from 'bcrypt';

// Get all users (root only)
export async function getAllUsers(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get all users error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// Delete user (root only)
export async function deleteUser(req, res) {
  const userId = req.params.id;

  try {
    // Check if user exists
    const check = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    // Delete user's palettes and colors first
    const palettes = await pool.query('SELECT id FROM palettes WHERE user_id = $1', [userId]);
    for (const palette of palettes.rows) {
      await pool.query('DELETE FROM colors WHERE palette_id = $1', [palette.id]);
    }
    await pool.query('DELETE FROM palettes WHERE user_id = $1', [userId]);

    // Delete user
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);

    res.json({ message: 'User deleted successfully!' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// Change user password (root only)
export async function changeUserPassword(req, res) {
  const userId = req.params.id;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ error: 'New password is required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  try {
    const check = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, userId]);

    res.json({ message: 'User password changed successfully!' });
  } catch (err) {
    console.error('Change user password error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
