import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white px-4">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-6xl font-bold font-display tracking-tight text-white">404</h1>
        <h2 className="text-xl font-semibold text-zinc-300">Page Not Found</h2>
        <p className="text-zinc-400 text-sm">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}