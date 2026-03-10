import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, API_BASE_URL } from '../utils/auth';
import PaletteCard from '../components/PaletteCard';

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
      const res = await fetch(`${API_BASE_URL}/api/palettes/user`, {
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
}, [navigate]);

  const handleDelete = async (id: number) => {
    const token = getToken();
    const confirm = window.confirm('Are you sure you want to delete this palette?');
    if (!confirm || !token) return;

    const res = await fetch(`${API_BASE_URL}/api/palettes/${id}`, {
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
                className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
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
          <div key={palette.id}>
            <PaletteCard
              title={palette.title}
              theme={palette.theme}
              description={palette.description}
              colors={palette.colors}
            />
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => navigate(`/edit/${palette.id}`)}
                className="px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(palette.id)}
                className="px-3 py-1 bg-red-600 text-white rounded-full hover:bg-red-700"
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