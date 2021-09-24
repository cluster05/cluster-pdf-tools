const childProcess = require('child_process');
const util = require('util');
const exec = util.promisify(childProcess.exec);
const { useTempFilesPDFInOut } = require("./handler/pdf.handler");


async function compress(buffer){
    try {
        return await useTempFilesPDFInOut(buffer, async (input, output) => {
            await exec(
                `gs \ -q -dNOPAUSE -dBATCH -dSAFER \ -sDEVICE=pdfwrite \ -dCompatibilityLevel=1.3 \ -dPDFSETTINGS=/ebook \ -dEmbedAllFonts=true \ -dSubsetFonts=true \ -dAutoRotatePages=/None \ -dColorImageDownsampleType=/Bicubic \ -dColorImageResolution=72 \ -dGrayImageDownsampleType=/Bicubic \ -dGrayImageResolution=72 \ -dMonoImageDownsampleType=/Subsample \ -dMonoImageResolution=72 \ -sOutputFile=${output} \ ${input}`
            );
          });

    } catch (error) {
        throw new Error('Failed to compress pdf : ' + error.message);
    }
}


module.exports = { compress }

