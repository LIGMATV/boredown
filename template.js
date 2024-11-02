// Fungsi untuk membuat template HTML
function generateTemplate(frontmatter, content) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="${frontmatter.description || "Simple way to render markdown documents by HTML with math"}">
        <title>${frontmatter.title || "Default Title"}</title>
        <style>
            html {
                scroll-behavior: smooth;
            }
            body {
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                line-height: 1.75;
                margin: 0;
            }
            .info {
                border-bottom: 1px solid #dbdbdb;
                padding: 1.25rem 0;
            }
            b, h1, h2, h3, h4, h5, h6, strong, th {
                font-weight: 600;
            }
            h1, h2, h3, h4, h5, h6 {
                margin: 0 0 .75rem 0;
            }
            h1 {
                font-size: 3rem;
            }
            h2 {
                font-size: 2.25rem;
            }
            h3 {
                font-size: 1.75rem;
            }
            .main>* {
                margin: 1rem 0;
            }

            header nav {
                padding: .75rem 0;
            }
            nav ul {
                list-style-type: none;
                text-align: center;
                margin: 0;
            }
            nav ul li {
                display: inline-block;
                margin: 0 .1rem;
            }
            nav ul li a {
                text-decoration: none;
                padding: .5rem;
                border-radius: .5rem;
                color: #000000;
            }
            nav ul li a:hover {
                background-color: #f3f3f3;
            }
            article {
                width: 80%;
                margin: auto;
            }
            img, video {
                max-width: 100%;
            }
            table {
                border-collapse: collapse;
                width: 100%;
            }
            th, td {
                text-align: left;
                padding: .4rem;
            }
            thead {
                border-bottom: 1px solid #dbdbdb;
            }
            tr:nth-child(even) {
                background-color: #f2f2f2;
            }
            a {
                color: #000000;
            }
            pre, code {
                background-color: #f2f2f2;
                border-radius: .3rem;
            }
            pre {
                padding: 1rem;
            }
            pre>code {
                padding: 0;
            }
            code {
                padding: .25rem;
            }
            hr {
                border: none;
                border-bottom: 1px solid #dbdbdb;
            }
            blockquote {
    border-left: 4px solid #dbdbdb;
    padding: .5rem 1rem;
    font-style: italic
}
blockquote p {
    margin: 0;
}
math[display="block"] {
    margin: 1rem 0;
}

:is(h1, h2, h3, h4, h5, h6):hover .heading-anchor {
    opacity: 1;
}
.heading-anchor {
    margin: 0 1rem;
    text-decoration: none;
    opacity: 0;
    transition: .1s;
}
.heading-anchor::before {
    content: "#";
}
        </style>
    </head>
    <body>
        <section>
            <article>
                <div class="info">
                    <h1>${frontmatter.title}</h1>
                    <div id="date">${frontmatter.date || "No Date"}</div>
                </div>
                <div id="content" class="main">
                    ${content}
                </div>
            </article>
        </section>
    </body>
    </html>
    `;
}
