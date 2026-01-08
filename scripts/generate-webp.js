import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '../src/assets/landing');
const outputDir = path.join(__dirname, '../src/assets/landing');

const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.png'));

for (const file of files) {
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file.replace('.png', '.webp'));

  await sharp(inputPath)
    .webp({ quality: 90, lossless: false })
    .toFile(outputPath);

  const originalSize = fs.statSync(inputPath).size;
  const webpSize = fs.statSync(outputPath).size;
  const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);

  console.log(`✓ ${file} → ${path.basename(outputPath)} (${savings}% smaller)`);
}
