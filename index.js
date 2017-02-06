const helpers = require('./helpers');

function onImageRead (options, stream, callback) {
  helpers.resizeImage(options, stream, (image) => {
    callback(options.mimeType, image);
  });
}

function resizer (options, callback) {
  try {
    if (new RegExp('http(s)?://', 'i').test(options.url)) {
      helpers.downloadFile(options.url, (type, data) => {
        options.mimeType = type;
        onImageRead(options, data, callback);
      });
    } else {
      helpers.readFile(options.url, (type, data) => {
        options.mimeType = type;
        onImageRead(options, data, callback);
      });
    }
  } catch (ex) {
    callback('text/plain', 'Error processing image. Probably due to an invalid image url');
  }
}

exports.resizeWith = resizer;

exports.resize = function(option, width, height, url, callback) {
  const options = { format: option, width, height, url };
  resizer(options, callback);
};