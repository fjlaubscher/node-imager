var im = require('imagemagick');
var fs = require('fs');
var http = require('http');
var mime = require('mime');

var resizeImage = function(option, width, height, stream, next) {
    if (option) {
        im.crop({
            srcData: stream,
            width: width,
            height: height,
            gravity: "center"
        }, function(err, stdout, stderr) {
            var image = new Buffer(stdout, "binary");
            next(image);
        });
    } else {
        im.resize({
            srcData: stream,
            width: width,
            height: height
        }, function(err, stdout, stderr) {
            var image = new Buffer(stdout, "binary");
            next(image);
        });
    }
};

module.exports = {
    resize: function(option, width, height, url, next) {
        var filename = `${__dirname}/${url}`;
        filename = filename.replace('/node_modules/node-imager', '');
        var download = false;

        // check if file exists locally        
        try {
            fs.accessSync(filename);
        } catch (ex) {
            download = true;
        }

        try {

            if (!download) {
                // file is on server
                var stream = fs.readFileSync(filename);
                resizeImage(option, width, height, stream, (image) => {
                    var type = mime.lookup(filename);
                    next(type, image);
                });

            } else {
                // file doesn't exist, try to download file
                if (url.indexOf('http://') >= 0) {
                    http.get(url).on('response', function(response) {
                        var total = response.headers['content-length']; //total byte length
                        var buffer = [];
                        response.on('data', function(data) {
                            buffer.push(data);
                        });
                        response.on('end', function() {
                            var stream = Buffer.concat(buffer);
                            resizeImage(option, width, height, stream, (image) => {
                                var type = response.headers['content-type'];
                                next(type, image);
                            });
                        });
                    });
                } else {
                    next("text/plain", "Not a valid url");
                }
            }
        } catch (ex) {
            next("text/plain", "Image not found");
        }

    }
};