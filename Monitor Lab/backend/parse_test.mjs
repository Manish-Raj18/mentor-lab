import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');

const buf = fs.readFileSync('C:/Users/user/OneDrive/Desktop/project/Monitor Lab/backend/uploads/BCA_50_Practice_MCQs_With_Answers.pdf');
const arr = new Uint8Array(buf);
const parser = new PDFParse(arr);
await parser.load();
const result = await parser.getText();
const fullText = result.pages.map(p => p.text).join('\n');
console.log(fullText.substring(0, 5000));
