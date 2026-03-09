import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';

type Palette = {
  id: number;
  title: string;
  theme: string;
  description: string;
  colors: { hex: string; position: number }[];
};

function Dashboard() {
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchPalettes = async () => {
    const token = getToken();
    if (!token) return navigate('/login');

    try {
      const res = await fetch('http://13.219.3.29:8080/api/palettes/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPalettes(data);
    } catch (err) {
      console.error('Error fetching user palettes:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchPalettes();
}, []);

  const handleDelete = async (id: number) => {
    const token = getToken();
    const confirm = window.confirm('Are you sure you want to delete this palette?');
    if (!confirm || !token) return;

    const res = await fetch(`http://13.219.3.29:8080/api/palettes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setPalettes(palettes.filter((p) => p.id !== id));
    } else {
      alert('Failed to delete palette');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
        <div className='flex justify-between items-center mb-6'>
            <h2 className="text-3xl font-bold text-indigo-600 mb-6">Your Palettes</h2>
            <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                Home
            </button>
        </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : palettes.length === 0 ? (
        <p>You haven't created any palettes yet.</p>
      ) : (
        palettes.map((palette) => (
          <div key={palette.id} className="bg-white rounded shadow p-4 mb-4">
            <h3 className="text-xl font-semibold">{palette.title}</h3>
            <p className="text-sm text-gray-500">{palette.theme}</p>
            <p className="mt-1 text-gray-700">{palette.description}</p>
            <div className="flex mt-3">
              {palette.colors.map((color, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded mr-2"
                  style={{ backgroundColor: color.hex }}
                  title={color.hex}
                />
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => navigate(`/edit/${palette.id}`)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(palette.id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;