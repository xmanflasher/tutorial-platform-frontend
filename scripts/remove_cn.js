const fs = require('fs');
const path = require('path');

const files = [
    'src/components/layout/OnboardingOverlay.tsx',
    'src/components/courses/OrderHistory.tsx',
    'src/components/courses/CourseCard.tsx',
    'src/app/(public)/journeys/[slug]/orders/page.tsx'
];

for (const relPath of files) {
    const fullPath = path.join(__dirname, '..', relPath);
    if (!fs.existsSync(fullPath)) continue;

    let content = fs.readFileSync(fullPath, 'utf8');

    // Remove the function definition
    content = content.replace(/function\s+cn\s*\([^)]*\)\s*\{[\s\S]*?return\s+twMerge\s*\(\s*clsx\s*\(\s*inputs\s*\)\s*\)\s*;\s*\}/g, '');
    
    // Also remove the imports if they were only used for cn (clsx, twMerge)
    // Careful: some components might use clsx directly. Let's just remove the cn function 
    // and add `import { cn } from "@/lib/utils";` if not present.

    if (!content.includes('import { cn }')) {
        content = `import { cn } from "@/lib/utils";\n` + content;
    }

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Removed cn from:', relPath);
}
