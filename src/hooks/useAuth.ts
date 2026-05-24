import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

interface DemoUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'head' | 'staff';
}

const DEMO_USER: DemoUser = {
  id: 'demo-admin-1',
  email: 'admin@aksesdesa.id',
  full_name: 'Admin AksesDesa',
  role: 'admin',
};
const DEMO_PASSWORD = 'aksesdesa123';
const STORAGE_KEY = 'aksesdesa.auth';

export function useAuth() {
  const [user, setUser] = useState<DemoUser | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as DemoUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u: DemoUser = {
          id: session.user.id,
          email: session.user.email ?? '',
          full_name: (session.user.user_metadata?.full_name as string) ?? 'Admin Desa',
          role: 'admin',
        };
        setUser(u);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string) {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) {
          const u: DemoUser = {
            id: data.user.id,
            email: data.user.email ?? email,
            full_name: (data.user.user_metadata?.full_name as string) ?? 'Admin Desa',
            role: 'admin',
          };
          setUser(u);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
          return u;
        }
      }
      // Demo fallback
      if (email === DEMO_USER.email && password === DEMO_PASSWORD) {
        setUser(DEMO_USER);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USER));
        return DEMO_USER;
      }
      throw new Error('Email atau password salah.');
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  return { user, loading, signIn, signOut };
}
