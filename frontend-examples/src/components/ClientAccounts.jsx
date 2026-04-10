import React, { useEffect, useState } from 'react';
import { getMyAccounts, requestCurrentAccount } from '../api/client';

export default function ClientAccounts() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => { fetchAccounts(); }, []);

  async function fetchAccounts() {
    const data = await getMyAccounts();
    setAccounts(data);
  }

  async function handleRequest(e) {
    e.preventDefault();
    await requestCurrentAccount('EUR');
    fetchAccounts();
  }

  return (
    <div>
      <h3>My Accounts (GET)</h3>
      <button onClick={fetchAccounts}>Refresh</button>
      <ul>
        {accounts.map(a => (
          <li key={a.id}>{a.iban} - {a.balance} {a.currency}</li>
        ))}
      </ul>

      <h4>Request a current account (POST)</h4>
      <form onSubmit={handleRequest}>
        <button type="submit">Request Current Account</button>
      </form>
    </div>
  );
}
