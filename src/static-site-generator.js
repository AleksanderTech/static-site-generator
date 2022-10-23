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
    // 1. read post written in markdown
    let post = fs.readFileSync(postPath, { encoding: 'utf-8' });

    // 2. extract front matter and post content
    let searchResult = /^---(.*?)---/s.exec(post);
    let fMatter = JSON.parse(searchResult[1]);
    let postContent = post.replace(searchResult[0], '');

    // 3. parse post written in markdown to html
    let postAsHtml = marked.parse(postContent);

    // 4. read template corresponding to our post
    let template = fs.readFileSync(path.join(templatesDirectory, fMatter.template), { encoding: 'utf-8' });

    // 5. replace variables from template with corresponding values
    let staticWebPage = replaceVariables(
        template,
        { title: fMatter.title, author: fMatter.author, createdAt: fMatter.createdAt, content: postAsHtml }
    );

    // 6. create output directory if does not exist
    if (!fs.existsSync(outputDirectory)) fs.mkdirSync(outputDirectory, { recursive: true });

    // 7. save html result to output directory
    fs.writeFileSync(path.join(outputDirectory, `${path.parse(postPath).name}.html`), staticWebPage);
}

function replaceVariables(template, data) {
    let matches = template.matchAll(/\{\{(.*?)\}\}/g);

    for (let match of matches) {
        let dataName = match[1];
        let dataValue = data[dataName];

        if (!dataValue) throw new Error(`Variable with name "${dataName}" has not been provided`);

        template = template.replace(match[0], dataValue);
    }

    return template;
}

module.exports = {
    generate
}
