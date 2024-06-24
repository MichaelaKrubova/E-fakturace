// start.js
const { exec } = require('child_process');

// Start the JSON server
const jsonServer = exec('npm run server');
jsonServer.stdout.on('data', data => console.log(`JSON Server: ${data}`));
jsonServer.stderr.on('data', data => console.error(`JSON Server Error: ${data}`));

// Start the React app
const reactApp = exec('npm run dev');
reactApp.stdout.on('data', data => console.log(`React App: ${data}`));
reactApp.stderr.on('data', data => console.error(`React App Error: ${data}`));