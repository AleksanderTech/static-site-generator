const path = require('path');
const fs = require('fs');
const marked = require('marked');

function generate(postsDirectory, templatesDirectory, outputDirectory) {
    let postsFileNames = fs.readdirSync(postsDirectory);
    let postPaths = postsFileNames.map(name => path.join(postsDirectory, name));

    for (let postPath of postPaths) {
        generatePost(postPath, templatesDirectory, outputDirectory);
    }
}

function generatePost(postPath, templatesDirectory, outputDirectory) {
    // read post written in markdown
    let post = fs.readFileSync(postPath, { encoding: 'utf-8' });

    // extract front matter and post content
    let searchResult = /^(---)(.*?)(---)/s.exec(post);
    let frontMatter = JSON.parse(searchResult[2]);
    let postContent = post.replace(searchResult[0], '');

    // parse post written in markdown to html
    let postAsHtml = marked.parse(postContent);

    // read template corresponding to our post
    let template = fs.readFileSync(path.join(templatesDirectory, frontMatter.template), { encoding: 'utf-8' });

    // replace variables from template with corresponding values
    let result = replaceVariables(template, 
        { title: frontMatter.title, author: frontMatter.author, createdAt: frontMatter.createdAt, content: postAsHtml });

    // create output directory if does not exist
    if (!fs.existsSync(outputDirectory)) fs.mkdirSync(outputDirectory, { recursive: true });

    // write html result  
    let outputPath = path.join(outputDirectory, `${path.parse(postPath).name}.html`);
    fs.writeFileSync(outputPath, result);
}

function replaceVariables(template, data) {
    let matches = template.matchAll(/(\{\{)(.*?)(\}\})/g);

    for (let match of matches) {
        let dataName = match[2];
        let dataValue = data[dataName];

        if (!dataValue) throw new Error(`Variable with name "${dataName}" has not been provided`);

        template = template.replace(match[0], dataValue);
    }

    return template;
}

module.exports = {
    generate
}
