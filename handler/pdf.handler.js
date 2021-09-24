const fs = require('fs-extra');
const tempy = require('./tempy');

async function useTempFiles(filenameSets, fn) {
  const filenames = {};

  for (const [k, config] of Object.entries(filenameSets)) {
    const { numFiles, writeBuffers, ...tempyConfig } = config;

    if (numFiles !== undefined) {
      filenames[k] = Array(numFiles)
        .fill(0)
        .map(() => tempy.file(tempyConfig));
    } else if (writeBuffers !== undefined) {
      filenames[k] = await Promise.all(writeBuffers.map(b => tempy.write(b, tempyConfig)));
    }
  }
  const ret = await fn(filenames);
  await Promise.all([].concat(...Object.values(filenames)).map(f => fs.unlink(f)));
  return ret;
}

async function useTempFilesPDF(filenameSets, fn) {
  Object.values(filenameSets).forEach(v => (v.extension = '.pdf'));
  return useTempFiles(filenameSets, fn);
}

async function useTempFilesPDFInOut(inputBuffer, fn) {
  return useTempFilesPDF(
    { input: { writeBuffers: [inputBuffer] }, output: { numFiles: 1 } },
    async ({ input, output }) => {
      await fn(input[0], output[0]);
      return await fs.readFile(output[0]);
    },
  );
}

async function useTempFilesPDFIn(inputBuffer, fn) {
  return useTempFilesPDF({ input: { writeBuffers: [inputBuffer] } }, async ({ input }) => fn(input[0]));
}


module.exports =  { useTempFilesPDFInOut }