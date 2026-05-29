const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            // Skip the logger itself
            if (fullPath.endsWith('logger.ts')) continue;

            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Check if there's any console.xxx
            if (/(?<!\/\/\s*)console\.(log|info|warn|error)\b/.test(content)) {
                // Replace console. with logger.
                content = content.replace(/(?<!\/\/\s*)console\.(log|info|warn|error)\b/g, 'logger.$1');
                
                // Add import if not present
                if (!content.includes('import { logger } from')) {
                    // Find the last import statement
                    const importsEndMatch = [...content.matchAll(/^import .*?;?\r?\n/gm)].pop();
                    
                    if (importsEndMatch) {
                        const idx = importsEndMatch.index + importsEndMatch[0].length;
                        content = content.slice(0, idx) + "import { logger } from '@/lib/logger';\n" + content.slice(idx);
                    } else {
                        content = "import { logger } from '@/lib/logger';\n\n" + content;
                    }
                }
                
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated: ' + fullPath);
            }
        }
    }
}

processDir(path.join(__dirname, '../src'));
console.log('Refactor complete!');
