import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false
});

export function setAuthToken(token) {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
}

// Auth
export async function login(username, password) {
  const res = await api.post('/auth/login', { username, password });
  return res.data; // { token, role }
}

export async function registerClient(username, password) {
  const res = await api.post('/auth/register-client', { username, password });
  return res.data;
}

// Admin - Tellers (CRUD)
export async function createTeller(username, password) {
  const res = await api.post('/admin/tellers', { username, password });
  return res.data;
}

export async function listTellers() {
  const res = await api.get('/admin/tellers');
  return res.data;
}

export async function updateTellerPassword(id, password) {
  const res = await api.put(`/admin/tellers/${id}/password`, { password });
  return res.data;
}

export async function deleteTeller(id) {
  await api.delete(`/admin/tellers/${id}`);
}

// Client endpoints (GET / POST)
export async function getMyAccounts() {
  const res = await api.get('/client/accounts');
  return res.data;
}

export async function requestCurrentAccount(currency = "EUR") {
  const res = await api.post('/client/accounts/request', { currency });
  return res.data;
}

export async function getMyCards() {
  const res = await api.get('/client/cards');
  return res.data;
}

export async function requestDebitCard(currentAccountId) {
  const res = await api.post('/client/cards/debit/request', { currentAccountId });
  return res.data;
}

export async function requestCreditCard(monthlyIncome) {
  const res = await api.post('/client/cards/credit/request', { monthlyIncome });
  return res.data;
}

export async function getMyTransactions() {
  const res = await api.get('/client/transactions');
  return res.data;
}

export async function transfer(fromAccountId, toIban, amount) {
  const res = await api.post('/client/transactions/transfer', { fromAccountId, toIban, amount });
  return res.data; // { transferRef }
}

// Teller actions (examples)
export async function createClient(username, password) {
  const res = await api.post('/teller/clients', { username, password });
  return res.data;
}

export async function listAllAccounts() {
  const res = await api.get('/teller/accounts');
  return res.data;
}

export async function approveAccountRequest(id) {
  const res = await api.post(`/teller/accounts/${id}/approve`);
  return res.data;
}

export async function rejectAccountRequest(id) {
  const res = await api.post(`/teller/accounts/${id}/reject`);
  return res.data;
}

export default api;
