const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        if (file.includes('node_modules') || file.includes('.next')) return;
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));
let changedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Hardcoded Colors
    content = content.replace(/bg-\[#1[Ee]293[Bb]\]/g, 'bg-card');
    content = content.replace(/bg-\[#111827\]/g, 'bg-card');
    content = content.replace(/bg-\[#0[Dd]0[Ee]11\]/g, 'bg-background');
    content = content.replace(/bg-\[#0[Aa]0[Bb]0[Dd]\]/g, 'bg-background');
    
    // Border replacements
    content = content.replace(/border-slate-700/g, 'border-border-ui');
    content = content.replace(/border-slate-800/g, 'border-border-ui');
    content = content.replace(/border-gray-800/g, 'border-border-ui');
    content = content.replace(/border-white\/10/g, 'border-border-ui');
    content = content.replace(/border-white\/20/g, 'border-border-ui');
    
    // Yellow Replacements (Theme)
    content = content.replace(/text-yellow-400/g, 'text-primary');
    content = content.replace(/text-yellow-500/g, 'text-primary');
    content = content.replace(/bg-yellow-400/g, 'bg-primary');
    content = content.replace(/bg-yellow-500/g, 'bg-primary');
    content = content.replace(/border-yellow-400/g, 'border-primary');
    content = content.replace(/border-yellow-500/g, 'border-primary');
    
    // Specific text-slate-900 replacements for black text on button
    content = content.replace(/text-slate-900/g, 'text-black');
    content = content.replace(/text-gray-900/g, 'text-black');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedCount++;
        console.log('Updated:', file);
    }
});

console.log('Total files updated: ' + changedCount);
