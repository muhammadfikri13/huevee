import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: number;
  role: string;
}

export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function removeToken() {
  localStorage.removeItem('token');
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function getUserRole(): string | null {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.role || null;
  } catch (err) {
    console.error('Error decoding token:', err);
    return null;
  }
}

export function isRoot(): boolean {
  return getUserRole() === 'root';
}
