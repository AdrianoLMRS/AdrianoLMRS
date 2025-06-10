import fs from 'fs'; // Importing the 'fs' module to read files
import puppeteer from 'puppeteer'; // Importing 'puppeteer' to control headless Chrome for PDF generation

const args = process.argv.slice(2); // Get command line arguments

const header = `<h1 style=font-size:15px;text-align:center;width:100%>Currículo - <a href=https://portfolio-adriano-p4dj.onrender.com/ target=_blank>Adriano Rossi</a></h1>`
const footer = `<div style="font-size:10px;width:100%;padding:0 30px;display:flex;justify-content:space-between"><span style=display:inline;font-size:larger><small>PDF feito com pura programação.  <a href="https://github.com/AdrianoLMRS/AdrianoLMRS/tree/main/auto-pdf#readme">Veja mais</a></small></span><div style=margin-right:50px><a href=https://raw.githubusercontent.com/AdrianoLMRS/AdrianoLMRS/refs/heads/main/curriculo.pdf target=_blank style=margin-right:50px>Arquivo Bruto</a> <a href=https://github.com/AdrianoLMRS/AdrianoLMRS/blob/main/curriculo.pdf target=_blank>Ver no Github</a></div></div>`

async function run() {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Need this because Github Actions
    });
    const page = await browser.newPage();
    await page.goto(`file://${process.cwd()}/src/curriculo.html`, { waitUntil: 'networkidle0' }); // Load the HTML content into the page and wait until there are no more network connections for at least 500 ms
    
    if (!args[0]) {
        fs.mkdirSync('./src/dist', { recursive: true }); // Create the 'dist' directory if it doesn't exist
    }
    // Generate the PDF from the HTML content
    await page.pdf({
        path: args[0] || './src/dist/curriculo.pdf',
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: `${header}`,
        footerTemplate: `${footer}`,
        printBackground: true,
        scale: 0.77, // Scale the content to fit better on the page
        margin: { top: '15mm', right: '10mm', bottom: '15mm', left: '10mm' }
    });
    await browser.close(); // Close the browser after generating the PDF
}

run()
    .then(() => console.log('\x1b[32m PDF generated successfully! \x1b[0m'))
    .catch(err => console.error('\x1b[41m Error generating PDF:\n \x1b[0m', err));
