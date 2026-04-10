import React, { useEffect, useState } from 'react';
import { createTeller, listTellers, updateTellerPassword, deleteTeller } from '../api/client';

export default function AdminTellers() {
  const [tellers, setTellers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '' });
  const [editing, setEditing] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => { fetchTellers(); }, []);

  async function fetchTellers() {
    const data = await listTellers();
    setTellers(data);
  }

  async function handleCreate(e) {
    e.preventDefault();
    await createTeller(newUser.username, newUser.password);
    setNewUser({ username: '', password: '' });
    fetchTellers();
  }

  async function handleUpdate(id) {
    if (!newPassword) return;
    await updateTellerPassword(id, newPassword);
    setNewPassword('');
    setEditing(null);
    fetchTellers();
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete teller?')) return;
    await deleteTeller(id);
    fetchTellers();
  }

  return (
    <div>
      <h3>Admin: Tellers</h3>
      <form onSubmit={handleCreate} style={{ marginBottom: 12 }}>
        <input placeholder="username" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} />
        <input placeholder="password" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
        <button type="submit">Create Teller (POST)</button>
      </form>

      <ul>
        {tellers.map(t => (
          <li key={t.id} style={{ marginBottom: 8 }}>
            <strong>{t.username}</strong> (id: {t.id})
            {' '}
            <button onClick={() => setEditing(t.id)}>Change password (PUT)</button>
            <button onClick={() => handleDelete(t.id)}>Delete (DELETE)</button>
            {editing === t.id && (
              <div>
                <input placeholder="new password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                <button onClick={() => handleUpdate(t.id)}>Save</button>
                <button onClick={() => { setEditing(null); setNewPassword(''); }}>Cancel</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
