#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use dev timestamp in development, actual timestamp in production
const isDev = process.env.NODE_ENV !== 'production';
const timestamp = isDev ? 'dev-1.0.0' : Date.now().toString();

console.log(`Building with timestamp: ${timestamp} (${isDev ? 'development' : 'production'} mode)`);

// 1. Generate version.json
const versionPath = path.join(__dirname, '..', 'client', 'public', 'version.json');
const versionContent = JSON.stringify({ 
  buildTimestamp: timestamp, 
  version: '1.0.0' 
}, null, 2);
fs.writeFileSync(versionPath, versionContent);
console.log(`✓ version.json created with timestamp: ${timestamp}`);

// 2. Generate sw.js from template
const templatePath = path.join(__dirname, '..', 'client', 'public', 'sw.template.js');
const swPath = path.join(__dirname, '..', 'client', 'public', 'sw.js');

if (!fs.existsSync(templatePath)) {
  console.error('✗ sw.template.js not found!');
  process.exit(1);
}

let swContent = fs.readFileSync(templatePath, 'utf-8');
swContent = swContent.replace(/__BUILD_TIMESTAMP__/g, timestamp);
fs.writeFileSync(swPath, swContent);
console.log(`✓ sw.js generated from template with timestamp: ${timestamp}`);

// 3. Export for Vite build process
process.env.VITE_BUILD_TIMESTAMP = timestamp;
console.log(`✓ VITE_BUILD_TIMESTAMP set to: ${timestamp}`);