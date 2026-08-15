import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const tauriConfig = JSON.parse(readFileSync(new URL('../src-tauri/tauri.conf.json', import.meta.url), 'utf8'));
const cargoToml = readFileSync(new URL('../src-tauri/Cargo.toml', import.meta.url), 'utf8');

function requireMatch(value, pattern, label) {
  const match = value.match(pattern);
  if (!match) throw new Error(`${label} is missing or invalid.`);
  return match[1];
}

const cargoVersion = requireMatch(cargoToml, /^version\s*=\s*"([^"]+)"/m, 'Cargo package version');
const cargoLicense = requireMatch(cargoToml, /^license\s*=\s*"([^"]+)"/m, 'Cargo license');
const packageVersion = packageJson.version;
const stableLine = packageVersion.replace(/-(?:dev|rc)\..*$/, '');

if (!/^\d+\.\d+\.\d+(?:-(?:dev|rc)\.\d+)?$/.test(packageVersion)) {
  throw new Error(`package.json version ${packageVersion} does not follow the GoreeCloud development/release-candidate version contract.`);
}
if (stableLine !== tauriConfig.version || stableLine !== cargoVersion) {
  throw new Error(`Release version drift: npm=${packageVersion}, Tauri=${tauriConfig.version}, Cargo=${cargoVersion}.`);
}
if (packageJson.name !== '@goreecloud/feed') throw new Error('Unexpected npm package identity.');
if (packageJson.private !== true) throw new Error('The application package must remain private/non-publishable.');
if (packageJson.license !== 'MIT' || cargoLicense !== 'MIT') throw new Error('Release metadata must preserve the approved MIT license.');
if (tauriConfig.productName !== 'GoreeCloud Feed') throw new Error('Unexpected Tauri product name.');
if (tauriConfig.identifier !== 'com.goreecloud.feed') throw new Error('Unexpected Tauri application identifier.');

console.log(`Release metadata valid for GoreeCloud Feed ${packageVersion} (Stable line ${stableLine}).`);
