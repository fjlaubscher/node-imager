# node-imager
a super simple nodejs image resizer.
resize files on disk or over http / https

Prerequisites

-  [ImageMagick](http://www.imagemagick.org/script/binary-releases.php)

##installation
```
$ npm install node-imager --save
```

##usage
basic usage example:

```javascript
const express = require('express');
const imager = require('../index');
const app = express();

app.get('/imager/', (req, res) => {  
  // node-imager will try to find this image relative the root of your application
  // absolute file paths or urls work too
  const url = 'http://i.imgur.com/1KDwL1M.png';

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
app.listen(3000);
```

##api
```
 option (String): 'c' - crops the image from the center outwards. 
         '' - for normal resizing
         
 width (Number): desired width
 
 height (Number): desired height
 
 url (String): can be relative path or remote file on the web
               'images/test.png'
               'http://i.imgur.com/1KDwL1M.png' --important to prefix with 'http://'
               
 next: callback function
       (contentType, imageBuffer) => { }
```
```
resize(option, width, height, url, callback);
```
or
```
const options = {
  width: 500,
  height: 500,
  format: 'c',
  url
};
resizeWith(options, callback);
```
