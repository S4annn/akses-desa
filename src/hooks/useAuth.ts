import { useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../services/supabaseClient';

interface AppUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'head' | 'staff';
  village_id?: string;
}

const DEMO_USER: AppUser = {
  id: 'demo-admin-1',
  email: 'admin@aksesdesa.id',
  full_name: 'Admin AksesDesa',
  role: 'admin',
};
const DEMO_PASSWORD = 'aksesdesa123';
const STORAGE_KEY = 'aksesdesa.auth';

async function fetchProfile(userId: string, email: string): Promise<AppUser | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, village_id')
    .eq('id', userId)
    .maybeSingle();
  if (!data) return null;
  return {
    id: String(data.id),
    email: (data.email as string) ?? email,
    full_name: (data.full_name as string) ?? 'Admin Desa',
    role: (data.role as AppUser['role']) ?? 'staff',
    village_id: (data.village_id as string) ?? undefined,
  };
}

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AppUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    // Sync existing session on mount
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session?.user) {
        const u = await fetchProfile(data.session.user.id, data.session.user.email ?? '');
        if (u) {
          setUser(u);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
        }
      }
    });

    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      const u =
        (await fetchProfile(session.user.id, session.user.email ?? '')) ?? {
          id: session.user.id,
          email: session.user.email ?? '',
          full_name: (session.user.user_metadata?.full_name as string) ?? 'Admin Desa',
          role: 'admin' as const,
        };
      setUser(u);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
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
          const u =
            (await fetchProfile(data.user.id, data.user.email ?? email)) ?? {
              id: data.user.id,
              email: data.user.email ?? email,
              full_name: (data.user.user_metadata?.full_name as string) ?? 'Admin Desa',
              role: 'admin' as const,
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
