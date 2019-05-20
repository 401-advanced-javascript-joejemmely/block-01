module.exports = [
  {
    greyscale: function(buffer, header) {
      let palette = [];
      for (let j = 0; j < header.numberOfColors * 4; j++) {
        palette[j] = {
          b: 10,
          g: 128,
          r: 100,
          a: 0,
        };
      }
      for (let i = 0; i < header.numberOfColors * 4; i++) {
        var iOffset = 54 + i;
        buffer.writeUInt8(palette[i].b, iOffset);
        buffer.writeUInt8(palette[i].g, iOffset + 1);
        buffer.writeUInt8(palette[i].r, iOffset + 2);
        buffer.writeUInt8(palette[i].a, iOffset + 3);
      }
      return buffer;
    },
  },
  {
    reverse: function(buffer, header) {
      let end = header.size - 1;
      let start = header.pixelArray;
      while (end > start) {
        buffer.writeUInt8(buffer.readUInt8(start), end);
        end--;
        start++;
      }

      return buffer;
    },
  },
];
