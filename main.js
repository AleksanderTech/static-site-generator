const path = require('path');
const generate = require('./src/static-site-generator').generate;

const postsDirectory = path.join(__dirname, 'src', 'posts');
const templatesDirectory = path.join(__dirname, 'src', 'templates');
const outputDirectory = path.join(__dirname, 'dist');

generate(postsDirectory, templatesDirectory, outputDirectory);
