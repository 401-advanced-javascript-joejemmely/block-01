'use strict';

const fs = require('fs');

const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);

const operations = require('./operations.js');

const FILE_SIZE_OFFSET = 2;
const WIDTH_OFFSET = 18;
const HEIGHT_OFFSET = 22;
const BYTES_PER_PIXEL_OFFSET = 28;
const PIXELSTART_OFFSET = 10;

module.exports = class Bitmap {
  /**
   * Create a bitmap.
   * @param {buffer} buffer - The buffer
   * @param {string} destination - The destination filepath
   * @param {string} operation - The operation to do on the bitmap
   */
  constructor(buffer, destination, operation) {
    this.buffer = buffer;
    this.destination = destination;
    this.operation = operation;

    // Header
    this.header = {};
    this.header.type = this.buffer.toString('utf-8', 0, 2);
    if (this.header.type !== 'BM') {
      throw new Error(
        'Type of file loaded is not a Bitmap file. Header type read does not match \'BM\''
      );
    }

    this.header.size = this.buffer.readInt32LE(FILE_SIZE_OFFSET);
    this.header.compressionType = this.buffer.readInt32LE(30);
    this.header.width = this.buffer.readUInt32LE(WIDTH_OFFSET);
    this.header.height = this.buffer.readUInt32LE(HEIGHT_OFFSET);
    this.header.bitsPerPx = this.buffer.readInt16LE(BYTES_PER_PIXEL_OFFSET);
    this.header.pixelArray = this.buffer.readInt32LE(PIXELSTART_OFFSET);
    this.header.numberOfColors = this.buffer.readInt32LE(46);

    // Color Table
    this.colorTableOffset = buffer.readInt32LE(14);
    this.colorTable = [];
  }

  /**
   * Validate the bitmap.
   * @return {boolean} If the the filetype is a bitmap.
   */
  isValid() {
    return this.header.type == 'BM';
  }

  /**
   * Display the header information
   */
  showInfo() {
    console.table(this.header);
  }

  /**
   * Apply a transformation
   */
  transform(operation) {
    if (this.isValid()) {
      const op = operations.reduce((acc, fn) => {
        let [f] = Object.values(fn);
        acc[Object.keys(fn)] = f;
        return acc;
      }, {});

      if (op.hasOwnProperty(operation)) {
        writeFileAsync(
          'assets/test.bmp',
          op[operation](this.buffer, this.header)
        );
        console.log(`the image has been ${operation}d `);
      } else console.error('this operation is not supported');
    } else {
      console.log('Invalid file');
    }
  }
};
