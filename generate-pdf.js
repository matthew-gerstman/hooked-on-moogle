const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
    console.log('🚀 Starting PDF generation...');
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Load the HTML file
    const htmlPath = path.resolve(__dirname, 'src/worksheet.html');
    console.log(`📄 Loading HTML from: ${htmlPath}`);
    
    await page.goto(`file://${htmlPath}`, {
        waitUntil: 'networkidle0',
        timeout: 60000
    });
    
    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');
    console.log('✅ Fonts loaded');
    
    // Wait a bit more for images
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate PDF
    const outputPath = path.resolve(__dirname, 'output/hooked-on-moogle-workbook.pdf');
    
    // Ensure output directory exists
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    
    await page.pdf({
        path: outputPath,
        format: 'Letter',
        printBackground: true,
        margin: {
            top: '0',
            right: '0',
            bottom: '0',
            left: '0'
        }
    });
    
    console.log(`✅ PDF generated: ${outputPath}`);
    
    // Validate - check file size and page count
    const stats = fs.statSync(outputPath);
    console.log(`📊 PDF file size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    
    await browser.close();
    console.log('🎉 Done!');
}

generatePDF().catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
