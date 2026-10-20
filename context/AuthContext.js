import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3333/api';
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

export async function request(path, options = {}) {
  const token = await AsyncStorage.getItem('technologic_token');
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new Error(`Não foi possível conectar à API em ${API_URL}. Verifique se o backend está rodando.`);
  }
  const payload = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || 'Não foi possível concluir a solicitação.');
  return payload;
}

export async function uploadImage(asset) {
  const token = await AsyncStorage.getItem('technologic_token');
  const formData = new FormData();
  const name = asset.fileName || `image-${Date.now()}.jpg`;
  const type = asset.mimeType || 'image/jpeg';
  if (typeof window !== 'undefined') {
    const file = await fetch(asset.uri).then((response) => response.blob());
    formData.append('image', file, name);
  } else {
    formData.append('image', { uri: asset.uri, name, type });
  }
  let response;
  try {
    response = await fetch(`${API_URL}/uploads/image`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
  } catch {
    throw new Error('Não foi possível conectar à API para enviar a imagem.');
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || 'Não foi possível enviar a imagem.');
  return `${API_ORIGIN}${payload.imageUrl}`;
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
    let mounted = true;
    (async () => {
      try {
        const token = await AsyncStorage.getItem('technologic_token');
        if (token) {
          const { user: currentUser } = await request('/auth/me');
          if (mounted) {
            setUser(currentUser);
            await AsyncStorage.setItem('technologic_user', JSON.stringify(currentUser));
          }
        } else {
          await clearSession();
        }
      } catch {
        await clearSession();
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const signIn = async (email, password) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });
    await saveSession(data);
    setUser(data.user);
  };

  const signUp = async (name, email, password) => {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password }),
    });
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
