import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaletteCard from '../components/PaletteCard';
import { isLoggedIn, removeToken, isRoot, getToken } from '../utils/auth';

type Palette = {
  id: number;
  title: string;
  theme: string;
  description: string;
  colors: { hex: string; position: number }[];
};

function Home() {
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const rootUser = isRoot();

  useEffect(() => {
    fetch('https://avntz.world/api/palettes')
      .then((res) => res.json())
      .then((data) => {
        setPalettes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching palettes:', err);
        setLoading(false);
      });
  }, []);

  const handleRootDelete = async (id: number) => {
    const token = getToken();
    const confirm = window.confirm('Are you sure you want to delete this palette?');
    if (!confirm || !token) return;

    const res = await fetch(`https://avntz.world/api/palettes/${id}`, {
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-indigo-600">🎨 Huevee Palettes</h1>
          {rootUser && <p className="text-sm text-red-600 font-semibold mt-1">🔐 Root Admin Mode</p>}
        </div>
        <div className="space-x-4">
          {loggedIn ? (
            <>
              <button
                onClick={() => navigate('/create')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Create Palette
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Manage Palettes
              </button>
              {rootUser && (
                <button
                  onClick={() => navigate('/manage-users')}
                  className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                >
                  👥 Manage Users
                </button>
              )}
              <button
                onClick={() => {
                  removeToken();
                  navigate('/');
                  window.location.reload(); // refresh UI
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded hover:bg-indigo-50"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
      {loading ? (
        <p>Loading palettes...</p>
      ) : palettes.length === 0 ? (
        <p>No palettes found.</p>
      ) : (
        <div className="space-y-4">
          {palettes.map((palette) => (
            <div key={palette.id} className="bg-white rounded-lg shadow-md p-4">
              <PaletteCard
                title={palette.title}
                theme={palette.theme}
                description={palette.description}
                colors={palette.colors}
              />
              {rootUser && (
                <button
                  onClick={() => handleRootDelete(palette.id)}
                  className="mt-3 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  🗑️ Delete (Admin)
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;