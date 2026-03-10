import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Password tidak cocok');
      return;
    }

    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } else {
      alert('Registrasi gagal: ' + (data.error || 'Unknown error'));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleRegister} className="flex flex-col space-y-3 w-80">
        <input
          type="text"
          placeholder="Username"
          className="py-2 px-4 border rounded-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
        <input
          type="password"
          placeholder="Konfirmasi Password"
          className="py-2 px-4 border rounded-full"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 rounded-full hover:bg-indigo-700"
        >
          Register
        </button>
      </form>
      <p className="mt-4">
        Sudah punya akun? <a href="/login" className="text-indigo-600">Login di sini</a>
      </p>
      <p>
        <a href="/" className="text-indigo-300">🔙</a>
      </p>
    </div>
  );
}

export default Register;