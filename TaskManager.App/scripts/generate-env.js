#!/usr/bin/env node
/**
 * Reads SUPABASE_URL and SUPABASE_ANON_KEY from the environment (set in
 * Vercel project settings) and writes them into environment.prod.ts before
 * the Angular build runs. The placeholder tokens %%SUPABASE_URL%% and
 * %%SUPABASE_ANON_KEY%% in environment.prod.ts are replaced at build time.
 */
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env['SUPABASE_URL'];
const supabaseAnonKey = process.env['SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'ERROR: SUPABASE_URL and SUPABASE_ANON_KEY environment variables must be set.'
  );
  process.exit(1);
}

const envFilePath = path.join(
  __dirname,
  '..',
  'src',
  'environments',
  'environment.prod.ts'
);

let content = fs.readFileSync(envFilePath, 'utf8');
content = content.replace('%%SUPABASE_URL%%', supabaseUrl);
content = content.replace('%%SUPABASE_ANON_KEY%%', supabaseAnonKey);
fs.writeFileSync(envFilePath, content, 'utf8');

console.log('environment.prod.ts updated with Supabase credentials.');
