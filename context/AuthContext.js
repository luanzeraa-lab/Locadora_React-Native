import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3333/api';

export async function request(path, options = {}) {
  const token = await AsyncStorage.getItem('technologic_token');
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const payload = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(payload?.message || 'Não foi possível concluir a solicitação.');
  return payload;
}

export async function saveSession(data) {
  await AsyncStorage.setItem('technologic_token', data.token);
  await AsyncStorage.setItem('technologic_user', JSON.stringify(data.user));
}

export async function clearSession() {
  await AsyncStorage.multiRemove(['technologic_token', 'technologic_user']);
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('technologic_user');
        const token = await AsyncStorage.getItem('technologic_token');
        if (saved && token) setUser(JSON.parse(saved));
      } catch {
        await clearSession();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = async (email, password) => {
    const data = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    await saveSession(data);
    setUser(data.user);
  };

  const signUp = async (name, email, password) => {
    const data = await request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
    await saveSession(data);
    setUser(data.user);
  };

  const signOut = async () => {
    await clearSession();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, setUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return context;
}
