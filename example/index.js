const express = require('express');
const imager = require('../index');
const app = express();

app.get('/imager/', (req, res) => {  
  // node-imager will try to find this image relative the root of your application
  // absolute file paths or urls work too
  const url = 'http://i.imgur.com/1KDwL1M.png';
  // const url = 'http://i.imgur.com/McAyGt5.gif';

  const options = {
    width: 500,
    height: 500,
    format: 'c',
    url
  };
  
  // crop image
  imager.resizeWith(options, (contentType, imageBuffer) => {
    res.setHeader('Content-Type', contentType);
    res.send(imageBuffer);
  });
});

app.get('/imager2/', (req, res) => {  
  // node-imager will try to find this image relative the root of your application
  // absolute file paths or urls work too
  const url = 'http://i.imgur.com/McAyGt5.gif';
  
  // crop image
  imager.resize('c', 500, 200, url, (contentType, imageBuffer) => {
    res.setHeader('Content-Type', contentType);
    res.send(imageBuffer);
  });
});

app.listen(1337, () => {
  console.log('listening on 1337');
});