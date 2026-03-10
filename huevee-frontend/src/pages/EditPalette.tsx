import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getToken, API_BASE_URL } from '../utils/auth';

function EditPalette() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState('');
  const [description, setDescription] = useState('');
  const [colors, setColors] = useState<string[]>(['', '', '', '', '']);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchPalette = async () => {
    const token = getToken();
    if (!token) return navigate('/login');

    try {
      const res = await fetch(`${API_BASE_URL}/api/palettes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTitle(data.title);
      setTheme(data.theme);
      setDescription(data.description);
      const sortedColors = data.colors.sort((a: any, b: any) => a.position - b.position);
      setColors(sortedColors.map((c: any) => c.hex));
    } catch (err) {
      console.error('Error fetching palette:', err);
      navigate('/dashboard');
    }
  };

  fetchPalette();
}, [id]);

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

    const res = await fetch(`${API_BASE_URL}/api/palettes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      navigate('/dashboard');
    } else {
      alert('Failed to update palette');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">Edit Palette</h2>
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
            <div key={index} className="flex flex-col items-center">
              {/* Color picker */}
              <input
                type="color"
                value={hex}
                onChange={(e) => {
                  const newColors = [...colors];
                  newColors[index] = e.target.value;
                  setColors(newColors);
                }}
                className="w-12 h-8 cursor-pointer"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-full hover:bg-indigo-700"
        >
          Update Palette
        </button>
        <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="mb-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400"
            >
            ← Back to Dashboard
        </button>
      </form>
    </div>
  );
}

export default EditPalette;