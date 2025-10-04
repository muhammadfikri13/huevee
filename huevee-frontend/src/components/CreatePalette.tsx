import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';

function CreatePalette() {
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState('');
  const [description, setDescription] = useState('');
  const [colors, setColors] = useState<string[]>(['', '', '', '', '']);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = getToken();
    if (!token) return alert('You must be logged in');

    const payload = {
      title,
      theme,
      description,
      colors: colors.map((hex, index) => ({ hex, position: index })),
    };

    const res = await fetch('http://localhost:5000/api/palettes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      navigate('/');
    } else {
      alert('Failed to create palette');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">Create New Palette</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Theme"
          className="w-full p-2 border rounded"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-5 gap-2">
          {colors.map((hex, index) => (
            <input
              key={index}
              type="text"
              placeholder="#HEX"
              className="p-2 border rounded text-center"
              value={hex}
              onChange={(e) => {
                const newColors = [...colors];
                newColors[index] = e.target.value;
                setColors(newColors);
              }}
              required
            />
          ))}
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Submit Palette
        </button>
      </form>
    </div>
  );
}

export default CreatePalette;