const path = require('path');
const generate = require('./src/static-site-generator').generate;

const postsDirectory = path.join(__dirname, 'src', 'posts');
const templatesDirectory = path.join(__dirname, 'src', 'templates');
const outputDirectory = path.join(__dirname, 'dist');

// We tell our generator where our posts and template are, and where do we want html files to be generated
generate(postsDirectory, templatesDirectory, outputDirectory);
