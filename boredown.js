const fetching = [
    "https://cdn.jsdelivr.net/npm/marked/marked.min.js",
    "https://cdn.jsdelivr.net/npm/katex@0.16.3/dist/katex.min.js", // KaTeX library
    "https://cdn.jsdelivr.net/npm/katex@0.16.3/dist/katex.min.css", // KaTeX CSS for styling
    "template.js"
];

// Fungsi untuk mengambil Frontmatter
function parseFrontmatter(content) {
    const frontmatterRegex = /^---\n([\s\S]+?)\n---/;
    const match = content.match(frontmatterRegex);
    let frontmatter = {};
    let markdown = content;

    if (match) {
        // Parse Frontmatter
        frontmatter = match[1].split('\n').reduce((acc, line) => {
            const [key, value] = line.split(':').map(s => s.trim());
            acc[key] = value;
            return acc;
        }, {});
        // Hapus Frontmatter dari konten Markdown
        markdown = content.slice(match[0].length);
    }

    return { frontmatter, markdown };
}

// Fungsi untuk menambahkan id dan anchor ke semua heading
function addIdToHeadings() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
        // Membuat id berdasarkan teks heading
        const id = heading.textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
        heading.id = id; // Menambahkan id ke heading

        // Membuat elemen anchor
        const anchor = document.createElement('a');
        anchor.className = 'heading-anchor'; // Menambahkan class untuk styling
        anchor.href = `#${id}`; // Menetapkan href ke id
        // Menambahkan anchor ke dalam heading
        heading.appendChild(anchor);
    });
}

// Fungsi untuk merender halaman menggunakan template dari htmlTemplate.js
function renderTemplate() {
    const markdownContent = document.querySelector('textarea').value;

    // Parsing Frontmatter dan Markdown
    const { frontmatter, markdown } = parseFrontmatter(markdownContent);
    let htmlContent = marked.parse(markdown);

    // Render KaTeX hanya dalam format MathML
    htmlContent = htmlContent.replace(/\$\$(.*?)\$\$/g, (_, tex) =>
        katex.renderToString(tex, { displayMode: true, output: "mathml", strict: true })
    ).replace(/\$(.*?)\$/g, (_, tex) =>
        katex.renderToString(tex, { displayMode: false, output: "mathml", strict: true })
    );

    // Buat template menggunakan fungsi dari htmlTemplate.js
    const template = generateTemplate(frontmatter, htmlContent);

    // Gantikan isi halaman dengan template yang sudah diisi
    document.documentElement.innerHTML = template;

    // Tambahkan id dan anchor ke semua heading
    addIdToHeadings();

    // Panggil MathJax untuk merender LaTeX
    if (window.MathJax) {
        MathJax.typesetPromise();
    }
}

// Fungsi untuk memuat skrip
function loadScripts(sources, inOrder = false) {
    const head = document.head;

    if (inOrder) {
        return sources.reduce((p, src) => 
            p.then(() => new Promise((res, rej) => {
                const s = Object.assign(document.createElement(src.endsWith(".css") ? "link" : "script"), 
                    src.endsWith(".css")
                        ? { href: src, rel: "stylesheet", onload: res, onerror: rej }
                        : { src, async: false, onload: res, onerror: rej }
                );
                head.appendChild(s);
            })), Promise.resolve());
    } else {
        sources.forEach(src => {
            const s = Object.assign(document.createElement(src.endsWith(".css") ? "link" : "script"), 
                src.endsWith(".css")
                    ? { href: src, rel: "stylesheet" }
                    : { src, async: true }
            );
            head.appendChild(s);
        });
        return Promise.resolve();
    }
}

// Load scripts dan render setelah semuanya dimuat
document.addEventListener("DOMContentLoaded", () => {
    loadScripts(fetching, true).then(renderTemplate);
});
