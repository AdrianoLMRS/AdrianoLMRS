# Auto generate PDFs

Using the [Puppeteer][puppeteer] library, I can create my resume automaticaly using an HTML file [(`curriculo.html`)](./src/curriculo.html).

## Why?

I hate using PDF editors and I wanted to have a way to do this programmatically.

### How?

Check the github workflow file: [`gen-pdf.yml`](../.github/workflows/gen-pdf.yml) for more information.

#### Step by step

1. **`npm run start`**: generate the PDF using [Puppeteer][puppeteer], this result in a `curriculo.pdf` file.  Check [`main.js`](./main.js).
2. **`npm run optimize`**: optimize PDF using [PDF-LIB](https://pdf-lib.js.org/ "pdf-lib library - website"), this result in a `curriculo.min.pdf` file.  Check [`optimize.js`](./optimize.js).
3. **`npm run compress`**: Optimize even more using [Ghostscript](https://ghostscript.com/ "Ghostscript oficial Website"), this result in a `curriculo.min-gh.pdf` file.  Check [`optimize-ghost.js`](./optimize-ghost.js)

---

[puppeteer]: https://pptr.dev/ "Puppeteer Library - Website"
