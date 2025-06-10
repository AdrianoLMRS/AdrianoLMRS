import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execPromise = promisify(exec);

async function compressPdf(inputPath, outputPath) {
    try {
        // Verify if the input file exists
        await fs.promises.access(inputPath, fs.constants.F_OK);
        
        // Ghostscript command to compress the PDF
        const command = [
            'gs', // Ghostscript command
            
            // Basic PDF processing parameters:
            '-sDEVICE=pdfwrite', // Specifies we want to output a PDF
            '-dCompatibilityLevel=1.4', // Sets PDF version to 1.4 (good balance of features and compression)
            '-dPDFSETTINGS=/ebook', // Predefined settings for medium quality/small size (300dpi)
            
            // Execution control:
            '-dNOPAUSE', // Disables interactive prompts
            '-dQUIET', // Suppresses non-error output
            '-dBATCH', // Exits after processing
            
            // Image handling:
            '-dDetectDuplicateImages=true', // Finds and reuses duplicate images
            '-dColorImageDownsampleType=/Bicubic', // Quality algorithm for color image resizing
            '-dColorImageResolution=150', // Sets color images to 150dpi (good for screen viewing)
            '-dGrayImageDownsampleType=/Bicubic', // Algorithm for grayscale images
            '-dGrayImageResolution=150', // Grayscale images to 150dpi
            '-dMonoImageDownsampleType=/Bicubic', // Algorithm for monochrome images
            '-dMonoImageResolution=150', // Monochrome images to 150dpi
            
            // Image compression control:
            '-dDownsampleColorImages=true', // Enables resizing of color images
            '-dDownsampleGrayImages=true', // Enables resizing of grayscale images
            '-dDownsampleMonoImages=true', // Enables resizing of monochrome images
            '-dAutoFilterColorImages=false', // Disables automatic filter selection
            '-dAutoFilterGrayImages=false', // Disables automatic filter selection
            '-dColorImageFilter=/DCTEncode', // Uses JPEG compression for color images
            '-dGrayImageFilter=/DCTEncode', // Uses JPEG compression for grayscale images
            
            // Output control:
            '-dPrint=false', // Optimizes for screen viewing rather than printing
            
            // Font handling:
            '-dEmbedAllFonts=true', // Ensures all fonts are embedded
            '-dSubsetFonts=true', // Only includes used characters from fonts
            '-dCompressFonts=true', // Applies compression to embedded fonts
            
            // File handling:
            `-sOutputFile=${outputPath}`, // Output file path
            inputPath // Input file path (must be last parameter)
        ].join(' ');

        const { stdout, stderr } = await execPromise(command); // Execute the Ghostscript command
        
        await fs.promises.access(outputPath, fs.constants.F_OK); // Verify if the output file was created successfully
        
        // Success logs
        const inputStats = fs.statSync(inputPath);
        const outputStats = fs.statSync(outputPath);
        const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(2);
        
        console.log(`✅ PDF compressed successfully!`);
        console.log(`📥 Original: ${(inputStats.size / 1024).toFixed(2)} KB`);
        console.log(`📤 Compressed: ${(outputStats.size / 1024).toFixed(2)} KB`);
        console.log(`📉 Reduction: ${reduction}%`);
        
        return true;
    } catch (error) {
        console.error('❌ Ghostscript compression failed:');
        console.error(error.stderr || error.message);
        process.exit(1);
    }
}

// ghostscript-compress.js input.pdf output.pdf
const [input, output] = process.argv.slice(2);

if (!input || !output) {
  console.error('Usage: node ghostscript-compress.js <input.pdf> <output.pdf>');
  process.exit(1);
}

compressPdf(input, output);