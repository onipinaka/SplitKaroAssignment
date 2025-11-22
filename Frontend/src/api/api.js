import axios from "axios";
const BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export const addExpense = (payload) => axios.post(`${BASE}/api/expenses`, payload).then(r => r.data);
export const fetchExpenses = (params) => axios.get(`${BASE}/api/expenses`, { params }).then(r => r.data);

export const queryLocal = (query) => axios.post(`${BASE}/api/query/local`, { query }).then(r => r.data);
export const queryGemini = (query) => axios.post(`${BASE}/api/query/gemini`, { query }).then(r => r.data);
