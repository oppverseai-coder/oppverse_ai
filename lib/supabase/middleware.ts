import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://phtikvfamizngfmliprh.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBodGlrdmZhbWl6bmdmbWxpcHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MTk2ODgsImV4cCI6MjEwNTM5NTY4OH0.IppUeW0bUyYSMSG4gVhwKUzPZJ-1Bac98wkBEMV328M';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value,
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: '',
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value: '',
          ...options,
        });
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
                     request.nextUrl.pathname.startsWith('/signup') ||
                     request.nextUrl.pathname.startsWith('/forgot-password') ||
                     request.nextUrl.pathname.startsWith('/reset-password');

  // If logged in and trying to access auth pages, redirect to dashboard
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}