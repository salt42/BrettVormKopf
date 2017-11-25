angular.module("BvK.services")
    .factory('fileSystem', function ($http, $window) {

        function writeFile(fileEntry, dataObj, success, error) {
            // Create a FileWriter object for our FileEntry (log.txt).
            fileEntry.createWriter(function (fileWriter) {
        
                fileWriter.onwriteend = function() {
                    if(typeof success === "function") success();
                    console.log("Successful file write...");
                    // readFile(fileEntry);
                };
        
                fileWriter.onerror = function (e) {
                    if(typeof error === "function") error();
                    console.log("Failed file write: " + e.toString());
                };
        
                // If data object is not passed in,
                // create a new Blob instead.
                if (!dataObj) {
                    dataObj = new Blob(['some file data'], { type: 'text/plain' });
                }
        
                fileWriter.write(dataObj);
            });
        }

        return {
            createFile: function (path, data, success, error) {
                path = path.split(/[/\\]/g);
                var dir = path.slice(0, path.length-1).join('/') + '/';
                var fileName = path[path.length-1];

                $window.requestFileSystem(window.PERSISTENT, 0, function (fs) {
                    fs.root.getDirectory(dir, { create: true }, function(dirEntry) {
                        dirEntry.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {
                            writeFile(fileEntry, data, function() {
                                if(typeof success === "function") success();
                            }, function() {
                                if(typeof error === "function") error(arguments);
                            });

                        }, function(e) {
                            console.error('error writing to file %s', fileName, e)
                        });
                    }, function(e) {
                        console.error('error creating directory %s', dir, e)
                    });
                }, function(e) {
                    console.error('error getting file system', e);
                });
            },
            unzip: function (path, targetDir, success, progCallback) {
                zip.unzip(path, targetDir, success, progCallback);
            }
        }
    });
