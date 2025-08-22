const fs = require('fs');
const path = require('path');

// Read the original package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Remove the dist/ prefix from n8n node and credential paths
if (packageJson.n8n) {
    if (packageJson.n8n.credentials) {
        packageJson.n8n.credentials = packageJson.n8n.credentials.map(credPath => 
            credPath.replace('dist/', '')
        );
    }
    
    if (packageJson.n8n.nodes) {
        packageJson.n8n.nodes = packageJson.n8n.nodes.map(nodePath => 
            nodePath.replace('dist/', '')
        );
    }
}

// Remove the files field since we're publishing from dist
delete packageJson.files;

// Remove scripts that aren't needed in the published package
delete packageJson.scripts;
delete packageJson.devDependencies;

// Write the modified package.json to the dist folder
const distPath = path.join(__dirname, '..', 'dist', 'package.json');
fs.writeFileSync(distPath, JSON.stringify(packageJson, null, 2));

console.log('✅ Package.json prepared for publishing in dist/');