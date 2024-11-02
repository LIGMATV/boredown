/*! boredown.js v1.0.0 | License MIT | https://github.com/LIGMATV/boredown */

const fetching = [
    "https://cdn.jsdelivr.net/npm/marked/marked.min.js",
    "https://cdn.jsdelivr.net/npm/katex@0.16.3/dist/katex.min.js",
    "https://cdn.jsdelivr.net/npm/katex@0.16.3/dist/katex.min.css",
    "template.js"
];

function parseFrontmatter(content) {
    const frontmatterRegex = /^---\n([\s\S]+?)\n---/;
    const match = content.match(frontmatterRegex);
    let frontmatter = {};
    let markdown = content;

    if (match) {
        frontmatter = match[1].split('\n').reduce((acc, line) => {
            const [key, value] = line.split(':').map(s => s.trim());
            acc[key] = value;
            return acc;
        }, {});
        markdown = content.slice(match[0].length);
    }

    return {
        frontmatter,
        markdown
    };
}

function addIdToHeadings() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
        const id = heading.textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
        heading.id = id;

        const anchor = document.createElement('a');
        anchor.className = 'heading-anchor';
        anchor.href = `#${id}`;
        anchor.ariaLabel = 'Permalink anchor for heading'
        heading.appendChild(anchor);
    });
}

function renderTemplate() {
    const markdownContent = document.querySelector('textarea').value;

    const {
        frontmatter,
        markdown
    } = parseFrontmatter(markdownContent);
    let htmlContent = marked.parse(markdown);

    htmlContent = htmlContent.replace(/\$\$(.*?)\$\$/g, (_, tex) =>
        katex.renderToString(tex, {
            displayMode: true,
            output: "mathml",
            strict: true
        })
    ).replace(/\$(.*?)\$/g, (_, tex) =>
        katex.renderToString(tex, {
            displayMode: false,
            output: "mathml",
            strict: true
        })
    );

    const template = generateTemplate(frontmatter, htmlContent);
    document.documentElement.innerHTML = template;
    addIdToHeadings();
    if (window.MathJax) {
        MathJax.typesetPromise();
    }
}

function loadScripts(sources, inOrder = false) {
    const head = document.head;
    if (inOrder) {
        return sources.reduce((p, src) =>
            p.then(() => new Promise((res, rej) => {
                const s = Object.assign(document.createElement(src.endsWith(".css") ? "link" : "script"),
                    src.endsWith(".css") ? {
                        href: src,
                        rel: "stylesheet",
                        onload: res,
                        onerror: rej
                    } : {
                        src,
                        async: false,
                        onload: res,
                        onerror: rej
                    }
                );
                head.appendChild(s);
            })), Promise.resolve());
    } else {
        sources.forEach(src => {
            const s = Object.assign(document.createElement(src.endsWith(".css") ? "link" : "script"),
                src.endsWith(".css") ? {
                    href: src,
                    rel: "stylesheet"
                } : {
                    src,
                    async: true
                }
            );
            head.appendChild(s);
        });
        return Promise.resolve();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadScripts(fetching, true).then(renderTemplate);
});