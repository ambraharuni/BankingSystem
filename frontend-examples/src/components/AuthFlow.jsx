import React, { useEffect, useState } from 'react';
import api, { login, setAuthToken, getMyAccounts } from '../api/client';

export default function AuthFlow() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      setLoggedIn(true);
      fetchAccounts();
    }

    const interceptor = api.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          setAuthToken(null);
          setLoggedIn(false);
          setAccounts([]);
          setError('Session expired — please log in again.');
        }
        return Promise.reject(err);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);
    try {
      const resp = await login(username, password);
      localStorage.setItem('token', resp.token);
      setAuthToken(resp.token);
      setLoggedIn(true);
      fetchAccounts();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    }
  }

  async function fetchAccounts() {
    try {
      const data = await getMyAccounts();
      setAccounts(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setAuthToken(null);
    setLoggedIn(false);
    setAccounts([]);
    setError(null);
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h3>Example: Login → call protected endpoint</h3>

      {!loggedIn ? (
        <form onSubmit={handleLogin} style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
          <input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Login (POST /auth/login)</button>
          {error && <div style={{ color: 'red' }}>{error}</div>}
        </form>
      ) : (
        <div>
          <div style={{ marginBottom: 8 }}>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={fetchAccounts} style={{ marginLeft: 8 }}>Refresh accounts (GET /client/accounts)</button>
          </div>

          {error && <div style={{ color: 'red' }}>{error}</div>}

          <h4>Accounts (protected)</h4>
          <ul>
            {accounts.map((a) => (
              <li key={a.id}>{a.iban} — {a.balance} {a.currency}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
