const im = require('imagemagick');
const http = require('http');
const https = require('https');
const fs = require('fs');
const mime = require('mime');
const path = require('path');

function onFileDownload (response, callback) {
  const buffer = [];
  // as data is received, push to buffer
  response.on('data', (data) => {
    buffer.push(data);
  });

  // download complete
  response.on('end', () => {
    const stream = Buffer.concat(buffer);
    const type = response.headers['content-type'];
    callback(type, stream);
  });
}

exports.resizeImage = function (options, stream, callback) {
  const format = options.format || '';
  const width = options.width;
  const height = options.height;

  if (format === 'c') {
    im.crop({
      srcData: stream,
      width: width,
      height: height,
      gravity: 'center'
    }, (err, stdout) => {
      callback(new Buffer(stdout, 'binary'));
    });
  } else {
    im.resize({
      srcData: stream,
      width: width,
      height: height
    }, (err, stdout) => {
      callback(new Buffer(stdout, 'binary'));
    });
  }
};

exports.readFile = function (url, callback) {
  let filename = url;

  try {
    // try absolute path first
    fs.accessSync(filename);
  } catch (ex) {
    // try to find image relative to project root
    filename = path.join(__dirname, url).replace(`node_modules${path.sep}node-imager${path.sep}`, '');
  }

  try {
    // relative path was given, let's try that
    fs.accessSync(filename);
  } catch (ex) {
    callback('text/plain', 'Image not found');
  }
  
  try {
    fs.readFile(filename, (err, data) => {
      if (err) throw err;
      const type = mime.lookup(filename);
      callback(type, data);
    });
  } catch (ex) {
    callback('text/plain', 'Image not found');
  }
};

exports.downloadFile = function (url, callback) {
  if (url.includes('https://')) {
    https.get(url).on('response', (response) => {
      onFileDownload(response, callback);
    });
  } else if (url.includes('http://')) {
    http.get(url).on('response', (response) => {
      onFileDownload(response, callback);
    });
  } else {
    callback('text/plain', 'Invalid url');
  }
};