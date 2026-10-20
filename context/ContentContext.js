import React, { createContext, useContext, useEffect, useState } from 'react';
import { request, useAuth } from './AuthContext';

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const { user } = useAuth();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadContents = async (search = '') => {
    setLoading(true);
    try {
      setContents(await request(`/contents${search ? `?search=${encodeURIComponent(search)}` : ''}`));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadContents().catch(() => setLoading(false)); }, []);

  const createContent = async (data) => {
    const content = await request('/contents', { method: 'POST', body: JSON.stringify(data) });
    setContents((items) => [content, ...items]);
  };
  const updateContent = async (id, data) => {
    const content = await request(`/contents/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    setContents((items) => items.map((item) => item._id === id ? content : item));
  };
  const deleteContent = async (id) => {
    await request(`/contents/${id}`, { method: 'DELETE' });
    setContents((items) => items.filter((item) => item._id !== id));
  };

  const toggleFavorite = async (id) => {
    const { isFavorite } = await request(`/contents/${id}/favorite`, { method: 'POST' });
    setContents((items) => items.map((item) => (
      item._id === id ? { ...item, isFavorite } : item
    )));
  };

  return <ContentContext.Provider value={{ contents, loading, loadContents, createContent, updateContent, deleteContent, toggleFavorite, canManage: !!user }}>
    {children}
  </ContentContext.Provider>;
}

export function useContents() {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContents deve ser usado dentro de ContentProvider.');
  return context;
}
