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
    fetch('http://localhost:5000/api/palettes')
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

    const res = await fetch(`http://localhost:5000/api/palettes/${id}`, {
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
          <h1 className="text-3xl font-bold text-indigo-600">Huevee Palettes</h1>
          {rootUser && <p className="text-sm text-red-600 font-semibold mt-1">🔐 Root Admin Mode</p>}
        </div>
        <div className="space-x-4">
          {loggedIn ? (
            <>
              <button
                onClick={() => navigate('/create')}
                className="px-4 py-2 border-2 border-green-600 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all duration-300"
              >
                Create Palette
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                Manage Palettes
              </button>
              {rootUser && (
                <button
                  onClick={() => navigate('/manage-users')}
                  className="px-4 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700"
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
                className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : null}
        </div>
      </div>
      
      {!loggedIn && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-12 mb-8 text-white">
          <h2 className="text-4xl font-bold mb-4">Welcome to Huevee</h2>
          <p className="text-lg mb-6 max-w-2xl">
            Discover and create beautiful color palettes for your next design project. Explore thousands of carefully curated palettes or create your own masterpiece.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-indigo-600 transition-all duration-300"
            >
              Sign In
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading palettes...</p>
      ) : palettes.length === 0 ? (
        <p>No palettes found.</p>
      ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-2">          {palettes.map((palette) => (
            <div key={palette.id}>
              <PaletteCard
                title={palette.title}
                theme={palette.theme}
                description={palette.description}
                colors={palette.colors}
              />
              {rootUser && (
                <button
                  onClick={() => handleRootDelete(palette.id)}
                  className="mt-3 px-3 py-1 bg-red-600 text-white rounded-full hover:bg-red-700 text-sm"
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