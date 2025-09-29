const fs = require('fs');
const path = require('path');

// Configuration
const PAGES_DIR = './src/pages';
const OUTPUT_FILE = './docs/index.html';
const TEMPLATE_FILE = './src/pages/Header.html'; // Use Header.html as template for <head>

function extractBodyContent(htmlContent) {
    // Extract content between <body> and </body> tags
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    return bodyMatch ? bodyMatch[1].trim() : '';
}

function extractHeadContent(htmlContent) {
    // Extract content between <head> and </head> tags
    const headMatch = htmlContent.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    return headMatch ? headMatch[1].trim() : '';
}

function getPageFiles() {
    try {
        const files = fs.readdirSync(PAGES_DIR)
            .filter(file => file.endsWith('.html'))
            .sort(); // This will sort by filename, so "01-" comes before "02-"

        console.log('Found pages:', files);
        return files;
    } catch (error) {
        console.error('Error reading pages directory:', error.message);
        console.log('Make sure you have a "src/pages" folder with your HTML files.');
        return [];
    }
}

function generateSectionId(filename) {
    // Convert "01-Header.html" to "header"
    // Convert "02-When-90s-aesthetics-meets-mayhem.html" to "when-90s-aesthetics-meets-mayhem"
    const nameWithoutNumber = filename.replace(/^\d+-/, ''); // Remove number prefix
    const nameWithoutExtension = nameWithoutNumber.replace(/\.html$/, ''); // Remove .html
    return nameWithoutExtension.toLowerCase().replace(/[^a-z0-9]/g, '-'); // Make URL-friendly
}

function buildPortfolio() {
    console.log('🔨 Building portfolio...');

    const pageFiles = getPageFiles();
    if (pageFiles.length === 0) {
        console.log('❌ No HTML files found in pages directory');
        return;
    }

    // Get template head content
    let templateHead = '';
    try {
        const templateContent = fs.readFileSync(path.join(PAGES_DIR, 'Header.html'), 'utf8');
        templateHead = extractHeadContent(templateContent);

        // Fix CSS path: change "styles.css" to "../src/styles.css" since index.html is in docs folder
        templateHead = templateHead.replace(/href="styles\.css"/g, 'href="../src/styles.css"');

        console.log('✅ Using Header.html as template and fixed CSS paths');
    } catch (error) {
        console.log('⚠️  Could not read Header.html for template, using basic head');
        templateHead = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="variables.css">
<link rel="stylesheet" href="styles.css">
    <title>Portfolio</title>`;
    }

    // Always ensure fonts are included (regardless of what's in Header.html)
    const fontLinks = `
    <!-- Albert Sans from Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Albert+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <!-- Adobe fonts -->
    <link rel="stylesheet" href="https://use.typekit.net/atg4tkh.css">`;

    // Remove any existing font links to avoid duplicates
    templateHead = templateHead.replace(/<!-- Albert Sans[\s\S]*?typekit\.net\/atg4tkh\.css">/g, '');

    // Add our font links
    templateHead += fontLinks;

    console.log('✅ Font links added to build');

    // Build sections from each page
    let sectionsHTML = '';

    pageFiles.forEach(filename => {
        try {
            const filePath = path.join(PAGES_DIR, filename);
            const content = fs.readFileSync(filePath, 'utf8');
            const bodyContent = extractBodyContent(content);
            const sectionId = generateSectionId(filename);

            if (bodyContent) {
                sectionsHTML += `
    <!-- ===== SECTION FROM: ${filename} ===== -->
    <section id="${sectionId}" class="page-section">
${bodyContent}
    </section>
    <!-- ===== END SECTION: ${filename} ===== -->
`;
            }

            console.log(`✅ Processed: ${filename} → #${sectionId}`);
        } catch (error) {
            console.error(`❌ Error processing ${filename}:`, error.message);
        }
    });

    // Create the final HTML
    const finalHTML = `<!DOCTYPE html>
<html lang="en">
<head>
${templateHead}
</head>
<body>
<div class="flier">
<canvas id="rive-canvas" width="300" height="300"></canvas>
</div>
${sectionsHTML}
    <!-- Build script: Add your JavaScript here -->
    <script src="https://unpkg.com/@rive-app/canvas@2.24.0"></script>
    <script src="scripts.js"></script>
</body>
</html>`;

    // Write the output file
    try {
        // Create docs directory if it doesn't exist
        const distDir = path.dirname(OUTPUT_FILE);
        if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir, { recursive: true });
            console.log(`📁 Created ${distDir} directory`);
        }

        fs.writeFileSync(OUTPUT_FILE, finalHTML);
        console.log(`🎉 Successfully built ${OUTPUT_FILE}`);
        console.log(`📄 Combined ${pageFiles.length} pages into a single file`);
    } catch (error) {
        console.error('❌ Error writing output file:', error.message);
    }
}

// Run the build
buildPortfolio();