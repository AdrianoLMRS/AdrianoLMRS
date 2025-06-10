import { PDFDocument } from 'pdf-lib';
import { readFileSync, writeFileSync } from 'fs';

const args = process.argv.slice(2); // Get command line arguments

async function optimizePdf(inputPath, outputPath) {
    const inputBytes = readFileSync(inputPath); // Read the input PDF
    
    // Load the PDF
    const pdfDoc = await PDFDocument.load(inputBytes, {
        ignoreEncryption: true,
        throwOnInvalidObject: false,
    });

    // Flatten form fields if they exist
    if (pdfDoc.getForm) {
        const form = pdfDoc.getForm();
        form.flatten();
    }
    
    // 2. Optimize images (if any)
    // const pages = pdfDoc.getPages();
    // for (const page of pages) {
    //     const { width, height } = page.getSize();
    //     // You could resize the page here if appropriate
    // }
    
    // Save the optimized PDF
    const optimizedBytes = await pdfDoc.save({
        useObjectStreams: true,      // Groups objects into streams
        useCompression: true,        // Compresses streams
        removeUnusedObjects: true,   // Removes unused objects
        removeUnusedResources: true, // Cleans up resources
        embedFonts: true,            // Ensures fonts are embedded
        compressStreams: true,       // Applies compression to streams
        // Additional aggressive options:
        downsampleImages: true,      // Reduces image quality
        imageQuality: 0.5,           // Quality factor (0-1)
        // PDF version (lower versions are often smaller)
        pdfVersion: '1.4',
    });
    
    writeFileSync(outputPath, optimizedBytes);

    // Log compression results
    const originalSize = (inputBytes.length / 1024).toFixed(2);
    const optimizedSize = (optimizedBytes.length / 1024).toFixed(2);
    console.log(`Compressed from ${originalSize}KB to ${optimizedSize}KB (${((1 - optimizedSize/originalSize) * 100).toFixed(2)}% reduction)`);
}

optimizePdf(args[0] || './src/dist/curriculo.pdf', args[1] || './src/dist/curriculo.min.pdf')
    .then(() => console.log('\n \x1b[32m PDF optimized successfully! \x1b[0m'))
    .catch(err => console.error('\n \x1b[41m Error optimizing PDF:\n \x1b[0m', err));