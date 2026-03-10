import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';
import { ChromePicker } from 'react-color';
import type { ColorResult } from 'react-color';

function CreatePalette() {
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState('');
  const [description, setDescription] = useState('');
  const [colors, setColors] = useState<string[]>(['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff']);
  const [activePicker, setActivePicker] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = getToken();
    if (!token) return alert('You must be logged in');

    const payload = {
      title,
      theme,
      description,
      colors: colors.map((hex, index) => ({
        hex: hex.trim(),
        position: index,
      })),
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

  const handleColorChange = (color: ColorResult, index: number) => {
    const newColors = [...colors];
    newColors[index] = color.hex;
    setColors(newColors);
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
            <div key={index} className="relative">
              <div
                className="w-full h-10 rounded cursor-pointer border"
                style={{ backgroundColor: hex }}
                onClick={() => setActivePicker(index)}
                title="Click to pick color"
              />
              <p className="text-center text-sm mt-1">{hex}</p>
              {activePicker === index && (
                <div className="absolute z-10 mt-2">
                  <ChromePicker
                    color={hex}
                    onChangeComplete={(color) => handleColorChange(color, index)}
                  />
                  <button
                    type="button"
                    className="mt-2 bg-gray-200 px-2 py-1 rounded-full text-sm"
                    onClick={() => setActivePicker(null)}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-full hover:bg-indigo-700"
        >
          Submit Palette
        </button>
      </form>
    </div>
  );
}

export default CreatePalette;
