import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken, API_BASE_URL } from '../utils/auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // ⛔ Hindari reload halaman

    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      navigate('/');
    } else {
      alert('Login gagal');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col space-y-3 w-80">
        <input
          type="email"
          placeholder="Email"
          className="py-2 px-4 border rounded-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="py-2 px-4 border rounded-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 rounded-full hover:bg-indigo-700"
        >
          Login
        </button>
      </form>
      <p className="mt-4">
        Be;um punya akun? <a href="/register" className="text-indigo-600">Daftar di sini</a>
      </p>
    </div>
  );
}

export default Login;