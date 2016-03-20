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
    resize: function(format, width, height, url, next) {
        try {
            var path = `${__dirname}\\${url}`;
            fs.accessSync(path);
            var stream = fs.readFileSync(path);
            resizeImage(option, width, height, stream, (image) => {
                var type = mime.lookup(path);
                next(type, image);
            });            
        } catch (ex) {
            // file doesn't exist, try to download file
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
        }
    }
};
