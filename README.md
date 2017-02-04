# node-imager
a super simple nodejs image resizer.
resize files on disk or over http / https

[npm](https://www.npmjs.com/package/node-imager)

Prerequisites

-  [ImageMagick](http://www.imagemagick.org/script/binary-releases.php)

##installation
```
$ npm install node-imager --save
```

##usage
basic usage example:

```
var express = require('express');
var imager = require('node-imager');
var app = express();

app.get('/imager/', function(req, res) {
  var height = 150;
  var width = 150;
  
  // node-imager will try to find this image in the root of your application
  // this can be a url of an image somewhere on the web as well like (http://francoislaubscher.com/img/me-square_250.png)
  var url = "test.png";
  
  // crop image
  imager.resize('c', width, height, url, (contentType, imageBuffer) => {
    res.setHeader('Content-Type', contentType);
    res.send(imageBuffer);
  });
});
app.listen(8080);

```

##api
```
 option (String): 'c' - crops the image from the center outwards. 
         '' - for normal resizing
         
 width (Number): desired width
 
 height (Number): desired height
 
 url (String): can be relative path or remote file on the web
               'images/test.png'
               'http://francoislaubscher.com/img/me-square_250.png' --important to prefix with 'http://'
               
 next: callback function
       (contentType, imageBuffer) => { }
```
```
resize(option, width, height, url, callback);
```
