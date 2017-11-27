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
                    console.log("No data to write");
                    return;
                    // dataObj = new Blob(['some file data'], { type: 'text/plain' });
                }
        
                fileWriter.write(dataObj);
            });
        }

        function errorHandler(e) {
            var msg = '';

            switch (e.code) {
                case FileError.QUOTA_EXCEEDED_ERR:
                    msg = 'QUOTA_EXCEEDED_ERR';
                    break;
                case FileError.NOT_FOUND_ERR:
                    msg = 'NOT_FOUND_ERR';
                    break;
                case FileError.SECURITY_ERR:
                    msg = 'SECURITY_ERR';
                    break;
                case FileError.INVALID_MODIFICATION_ERR:
                    msg = 'INVALID_MODIFICATION_ERR';
                    break;
                case FileError.INVALID_STATE_ERR:
                    msg = 'INVALID_STATE_ERR';
                    break;
                default:
                    msg = 'Unknown Error';
                    break;
            };

            console.log(e);
            console.log('Error: ' + msg);
        }

        /**
         * not in use
         * @param path
         * @param callback
         */
        function ls(path, callback) {
            //@todo implement callback
            $window.requestFileSystem(window.PERSISTENT, 0, function (fs) {
                fs.root.getDirectory(path, { create: false }, function(dirEntry) {

                    var directoryReader = dirEntry.createReader();
                    directoryReader.readEntries(function(a) {
                        console.log(a);
                    }, function(e) {
                        console.log(e);
                    });
                }, function(e) {
                    console.error('directory not exists %s', path, e)
                });
            }, errorHandler);
        }
        function download(source, target, success, progress, error) {
            var fileTransfer = new FileTransfer();
            var uri = encodeURI(source);

            fileTransfer.download(
                uri,
                "file:///data/data/de.salt.brettvormkopf/files/files" + target,
                function(entry) {
                    console.log("download complete: " + entry.toURL());
                    if (typeof success === "function") success();
                },
                function(e) {
                    if (typeof error === "function") error(e);
                },
                false,
                {
                    // headers: {
                    //     "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                    // }
                }
            );
            fileTransfer.onprogress = function(progressEvent) {
                if (typeof progress === "function") progress(progressEvent);
            };
        }
        function remove(path) {
            //@todo
        }
        return {
            download: download,
            ls: ls,
            remove: remove,
            readFile: function(path, success) {
                window.requestFileSystem(window.PERSISTENT, 0, function (fs) {
                    fs.root.getFile(path, {}, function(fileEntry) {

                        // Get a File object representing the file,
                        // then use FileReader to read its contents.
                        fileEntry.file(function(file) {
                            var reader = new FileReader();

                            reader.onloadend = function(e) {
                                success(this.result);
                            };

                            reader.readAsText(file);
                        }, errorHandler);

                    }, errorHandler);
                }, errorHandler);
            },
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
                }, errorHandler);
            },
            fileExists: function(path, fn) {
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
                    fileSystem.root.getFile(path, { create: false }, function fileExists() {
                        fn(true);
                    }, function fileDoesNotExist() {
                        fn(false);
                    });
                }, errorHandler); //of requestFileSystem
            },
            unzip: function (path, targetDir, success, progCallback) {
                //"file:///data/data/de.salt.brettvormkopf/files/files/data/zip.zip", "file:///data/data/de.salt.brettvormkopf/files/files/data"
                // zip.unzip(path, targetDir, function(state, err) {
                var source = "file:///data/data/de.salt.brettvormkopf/files/files" + path;
                var target = "file:///data/data/de.salt.brettvormkopf/files/files" + targetDir;
                zip.unzip(source, target, function(state, err) {
                    success(state, err);
                    ls(targetDir);
                }, progCallback);
            }
        }
    });
