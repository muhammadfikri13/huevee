import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, isRoot } from '../utils/auth';

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
};

function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = getToken();
      if (!token || !isRoot()) {
        navigate('/');
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleDeleteUser = async (id: number, username: string) => {
    const token = getToken();
    const confirm = window.confirm(`Are you sure you want to delete user "${username}"? This will also delete all their palettes.`);
    if (!confirm || !token) return;

    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
        alert(`User "${username}" deleted successfully!`);
      } else {
        alert('Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Error deleting user');
    }
  };

  const openPasswordModal = (userId: number) => {
    setSelectedUserId(userId);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setPasswordSuccess('');
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setSelectedUserId(null);
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (!newPassword || !confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setChangingPassword(true);
    const token = getToken();

    try {
      const res = await fetch(`http://localhost:5000/api/users/${selectedUserId}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setPasswordSuccess('Password changed successfully!');
        setTimeout(() => closePasswordModal(), 1500);
      } else {
        setPasswordError(data.error || 'Failed to change password');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setPasswordError('An error occurred while changing password');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-indigo-600">👥 Manage Users</h2>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700"
        >
          Back
        </button>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Username</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Created At</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{user.id}</td>
                  <td className="px-6 py-4 text-sm font-medium">{user.username}</td>
                  <td className="px-6 py-4 text-sm">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                        user.role === 'root' ? 'bg-red-600' : 'bg-green-600'
                      }`}
                    >
                      {user.role === 'root' ? '🔐 Root' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    {user.role !== 'root' && (
                      <>
                        <button
                          onClick={() => openPasswordModal(user.id)}
                          className="px-3 py-1 rounded-full text-white text-sm bg-blue-600 hover:bg-blue-700"
                        >
                          🔑 Change Password
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.username)}
                          className="px-3 py-1 rounded-full text-white text-sm bg-red-600 hover:bg-red-700"
                        >
                          🗑️ Delete
                        </button>
                      </>
                    )}
                    {user.role === 'root' && (
                      <span className="px-3 py-1 text-gray-600 text-sm">🔒 Protected Account</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4">Change User Password</h3>

            {passwordError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
                {passwordSuccess}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={changingPassword}
                />
                <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={changingPassword}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleChangePassword}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 disabled:bg-gray-400 font-medium"
                  disabled={changingPassword}
                >
                  {changingPassword ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  onClick={closePasswordModal}
                  className="flex-1 bg-gray-400 text-white py-2 rounded-full hover:bg-gray-500 font-medium"
                  disabled={changingPassword}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
