
import fs from 'fs';
const content = fs.readFileSync('c:\\Users\\favaz\\attention span\\webapp\\src\\pages\\Day2.jsx', 'utf8');

let braceCount = 0;
let parenCount = 0;

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '{') braceCount++;
    if (char === '}') braceCount--;
    if (char === '(') parenCount++;
    if (char === ')') parenCount--;
}

const divs = content.match(/<div(?![^>]*\/>)/g) || [];
const closeDivs = content.match(/<\/div>/g) || [];

console.log('Braces:', braceCount);
console.log('Parens:', parenCount);
console.log('Divs:', divs.length - closeDivs.length);
