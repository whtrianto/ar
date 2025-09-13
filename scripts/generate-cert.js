const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const certDir = path.join(__dirname, '..');
const keyPath = path.join(certDir, 'key.pem');
const certPath = path.join(certDir, 'cert.pem');

if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.log('Generating SSL certificate for HTTPS...');
  
  try {
    execSync(`openssl req -x509 -newkey rsa:2048 -keyout "${keyPath}" -out "${certPath}" -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"`, {
      stdio: 'inherit',
      cwd: certDir
    });
    console.log('SSL certificate generated successfully!');
  } catch (error) {
    console.error('Failed to generate SSL certificate:', error.message);
    console.log('Please install OpenSSL or run: npm install -g mkcert');
  }
} else {
  console.log('SSL certificate already exists.');
}
