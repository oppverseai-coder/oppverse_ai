import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://phtikvfamizngfmliprh.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBodGlrdmZhbWl6bmdmbWxpcHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MTk2ODgsImV4cCI6MjEwNTM5NTY4OH0.IppUeW0bUyYSMSG4gVhwKUzPZJ-1Bac98wkBEMV328M';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createClient();
