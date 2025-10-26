#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const timestamp = Date.now().toString();

// Inject timestamp into version.json
const versionPath = path.join(__dirname, '..', 'client', 'public', 'version.json');
const versionContent = JSON.stringify({ buildTimestamp: timestamp, version: '1.0.0' }, null, 2);
fs.writeFileSync(versionPath, versionContent);

console.log(`✓ Build timestamp ${timestamp} injected into version.json`);

// Also export it for the build process
process.env.VITE_BUILD_TIMESTAMP = timestamp;