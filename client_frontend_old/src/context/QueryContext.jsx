import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { queryApi } from '../services/api';
import { useAuth } from './AuthContext';
const Ctx = createContext(null);
const normalize = q => ({
  ...q,
  id: q.queryId || q.id,
  assignedTo: q.pickedBy?.name || 'Awaiting Assignment',
  messages: (q.messages || []).map(m => ({
    ...m,
    from: m.senderType,
    name: m.senderName || (m.senderType === 'customer' ? 'You' : 'Support'),
    text: m.message,
    time: new Date(m.createdAt).toLocaleString('en-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }),
  })),
});
export function QueryProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadQueries = async () => {
    if (!isLoggedIn) return setQueries([]);
    setLoading(true);
    try { const r = await queryApi.myQueries(); setQueries((r.data || []).map(normalize)); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadQueries(); }, [isLoggedIn]);
  const addQuery = async payload => { const r = await queryApi.create(payload); const item = normalize(r.data); setQueries(prev => [item, ...prev]); return item; };
  const addMessage = async (id, text) => { const r = await queryApi.message(id, text); const item = normalize(r.data); setQueries(prev => prev.map(q => q.id === id ? item : q)); return item; };
  const value = useMemo(() => ({ queries, loading, addQuery, addMessage, loadQueries }), [queries, loading]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useQueries = () => useContext(Ctx);
