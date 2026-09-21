import { readFile } from 'node:fs/promises';
import process from 'node:process';

const checks = [];

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8');
}

function requireMatch(name, value, pattern, message) {
  checks.push({ name, passed: pattern.test(value), message });
}

function requireNoMatch(name, value, pattern, message) {
  checks.push({ name, passed: !pattern.test(value), message });
}

try {
  const [landing, dashboard, shell, sidebar, bottomNav, middleware, globals, themeProvider, designContract] = await Promise.all([
    source('app/page.tsx'),
    source('app/app/page.tsx'),
    source('components/AppShell.tsx'),
    source('components/Sidebar.tsx'),
    source('components/BottomNav.tsx'),
    source('lib/supabase/middleware.ts'),
    source('app/globals.css'),
    source('components/ThemeProvider.tsx'),
    source('docs/DESIGN_AND_ROUTE_CONTRACT.md'),
  ]);

  requireMatch(
    'public landing page ownership',
    landing,
    /export\s+default\s+function\s+LandingPage\b/,
    '`app/page.tsx` must export the public LandingPage.',
  );
  requireMatch(
    'landing page public calls to action',
    landing,
    /href=["']\/signup["']/,
    'The public landing page must retain a signup call to action.',
  );
  requireMatch(
    'authenticated dashboard ownership',
    dashboard,
    /export\s+default\s+function\s+Home\b|export\s+default\s+function\s+App\b|Opportunity Universe/i,
    '`app/app/page.tsx` must retain the Opportunity Universe dashboard.',
  );
  requireMatch(
    'public shell bypass',
    shell,
    /pathname\s*===\s*["']\/["']/,
    'AppShell must bypass authenticated application chrome at `/`.',
  );
  requireMatch(
    'desktop Opportunity Universe route',
    sidebar,
    /name:\s*["']Opportunity Universe["'],\s*href:\s*["']\/app["']/,
    'Sidebar Opportunity Universe must link to `/app`.',
  );
  requireMatch(
    'mobile Opportunity Universe route',
    bottomNav,
    /name:\s*["']Universe["'],\s*href:\s*["']\/app["']/,
    'Bottom navigation Universe must link to `/app`.',
  );
  requireMatch(
    'authenticated app protection',
    middleware,
    /protectedRoutes\s*=\s*\[[\s\S]*?["']\/app["']/,
    'Middleware must protect `/app`.',
  );
  requireNoMatch(
    'public landing remains unprotected',
    middleware,
    /protectedRoutes\s*=\s*\[[\s\S]*?^[\t ]*["']\/["'],?\s*$/m,
    'Middleware must not protect `/`.',
  );
  requireMatch(
    'design and route contract exists',
    designContract,
    /Oppverse Design and Route Contract/,
    'The immutable design and route contract must remain in the repository.',
  );
  requireMatch(
    'dark violet accent preserved',
    globals,
    /--accent:\s*#8272e8;/,
    'The protected dark-theme Oppverse violet token changed.',
  );
  requireMatch(
    'light violet accent preserved',
    globals,
    /:root\.light[\s\S]*?--accent:\s*#6757d7;/,
    'The protected light-theme Oppverse violet token changed.',
  );
  requireMatch(
    'purple selected-state system preserved',
    globals,
    /\.control-selected[\s\S]*?background:\s*var\(--accent\)\s*!important;/,
    'Selected navigation and filter controls must keep the semantic violet treatment.',
  );
  requireMatch(
    'landing theme isolation preserved',
    themeProvider,
    /pathname\s*===\s*['"]\/['"]/,
    'ThemeProvider must continue to isolate the public landing page from product themes.',
  );

  const failures = checks.filter((check) => !check.passed);
  if (failures.length > 0) {
    console.error('Oppverse route contract failed:');
    for (const failure of failures) console.error(`- ${failure.message}`);
    process.exitCode = 1;
  } else {
    console.log(`Oppverse route contract passed (${checks.length} checks).`);
  }
} catch (error) {
  console.error(`Oppverse route contract could not run: ${error.message}`);
  process.exitCode = 1;
}
