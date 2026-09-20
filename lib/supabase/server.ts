import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://phtikvfamizngfmliprh.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBodGlrdmZhbWl6bmdmbWxpcHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MTk2ODgsImV4cCI6MjEwNTM5NTY4OH0.IppUeW0bUyYSMSG4gVhwKUzPZJ-1Bac98wkBEMV328M';

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Handled in middleware for Server Components
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch {
          // Handled in middleware for Server Components
        }
      },
    },
  });
}