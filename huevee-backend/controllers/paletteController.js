import pool from '../db/index.js';

// Create palette
export async function createPalette(req, res) {
  const { title, theme, description, colors } = req.body;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      'INSERT INTO palettes (user_id, title, theme, description) VALUES ($1, $2, $3, $4) RETURNING id',
      [userId, title, theme, description]
    );
    const paletteId = result.rows[0].id;

    for (let i = 0; i < colors.length; i++) {
      await pool.query(
        'INSERT INTO colors (palette_id, hex_code, position) VALUES ($1, $2, $3)',
        [paletteId, colors[i], i]
      );
    }

    res.status(201).json({ message: 'Palette created!', paletteId });
  } catch (err) {
    console.error('Create palette error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// Get all palettes (public)
export async function getAllPalettes(req, res) {
  try {
    const result = await pool.query(
      `SELECT p.id, p.title, p.theme, p.description, p.created_at,
              json_agg(json_build_object('hex', c.hex_code, 'position', c.position) ORDER BY c.position) AS colors
       FROM palettes p
       LEFT JOIN colors c ON p.id = c.palette_id
       GROUP BY p.id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get all palettes error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// Get palette by ID (public)
export async function getPaletteById(req, res) {
  const paletteId = req.params.id;
  try {
    const result = await pool.query(
      `SELECT p.id, p.title, p.theme, p.description, p.created_at,
              json_agg(json_build_object('hex', c.hex_code, 'position', c.position) ORDER BY c.position) AS colors
       FROM palettes p
       LEFT JOIN colors c ON p.id = c.palette_id
       WHERE p.id = $1
       GROUP BY p.id`,
      [paletteId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Palette not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get palette detail error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// Update palette (auth required)
export async function updatePalette(req, res) {
  const paletteId = req.params.id;
  const { title, theme, description, colors } = req.body;
  const userId = req.user.userId;

  try {
    const check = await pool.query('SELECT user_id FROM palettes WHERE id = $1', [paletteId]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'Palette not found' });
    if (check.rows[0].user_id !== userId) return res.status(403).json({ error: 'Unauthorized' });

    await pool.query(
      'UPDATE palettes SET title = $1, theme = $2, description = $3 WHERE id = $4',
      [title, theme, description, paletteId]
    );

    await pool.query('DELETE FROM colors WHERE palette_id = $1', [paletteId]);

    for (let i = 0; i < colors.length; i++) {
      await pool.query(
        'INSERT INTO colors (palette_id, hex_code, position) VALUES ($1, $2, $3)',
        [paletteId, colors[i], i]
      );
    }

    res.json({ message: 'Palette updated successfully!' });
  } catch (err) {
    console.error('Update palette error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

// Delete palette (auth required)
export async function deletePalette(req, res) {
  const paletteId = req.params.id;
  const userId = req.user.userId;

  try {
    const check = await pool.query('SELECT user_id FROM palettes WHERE id = $1', [paletteId]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'Palette not found' });
    if (check.rows[0].user_id !== userId) return res.status(403).json({ error: 'Unauthorized' });

    await pool.query('DELETE FROM colors WHERE palette_id = $1', [paletteId]);
    await pool.query('DELETE FROM palettes WHERE id = $1', [paletteId]);

    res.json({ message: 'Palette deleted successfully!' });
  } catch (err) {
    console.error('Delete palette error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
