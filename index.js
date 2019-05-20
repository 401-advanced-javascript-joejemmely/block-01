'use strict';

const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const Bitmap = require('./lib/bitmap.js');

const [file, operation] = process.argv.slice(2);

async function transformBitmap(filepath) {
  const buffer = await readFileAsync(filepath);
  const bitmap = new Bitmap(buffer);
  bitmap.showInfo();
  bitmap.transform(operation);
}

transformBitmap(file);
