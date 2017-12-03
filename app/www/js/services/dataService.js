angular.module("BvK.services", [])
	.factory('woodGrabber', function($http, fileSystem) {
		var _woodsData,
            forceDataReload = false,
            onlineSourceUrl = 'http://9tbass.de/bvk/data.zip';
            // onlineSourceUrl = "http://192.168.0.32:8080/data/data.zip";


		if (forceDataReload) {
            localStorage.setItem("woodsData", null);
        }
        _woodsData = JSON.parse(localStorage.getItem("woodsData") );
        //first time init data structure
        if (_woodsData === null) {
            var dataTemplate = {
                offline: false,
                data: {
                    raw: "",
                    prepared: []
                }
            };
            localStorage.setItem("woodsData", JSON.stringify(dataTemplate));
            _woodsData = dataTemplate;
        }

        function saveData(prepared, raw) {
            _woodsData.data.prepared = prepared;
            _woodsData.data.raw = raw;
            _woodsData.offline = true;
            localStorage.setItem("woodsData", JSON.stringify(_woodsData));
        }
		function getByID(data, id) {
			id = parseInt(id);
			for (var i in data) {
				if ('id' in data[i] && data[i].id === id) {
					return data[i];
				}
			}
			return false;
		}
        function grabDataFromServer(success, progress, error) {
            fileSystem.download(onlineSourceUrl, "/download/data.zip",
                function onSuccess() {
                    // unzipping
                    fileSystem.unzip('/download/data.zip', "/data", function onSuccessError(state, err) {
                        if (state < 0) {
                            error("Error while unzipping ", err);
                            return;
                        }
                        fileSystem.remove("/download");
                        success();
                    }, function onProgress(e) {
                        //progress for unzipping
                        //add the download progress, +0.5
                        progress(e.loaded / (e.total * 2) + 0.5, "unzipping");
                    });
                },
                function onProgress(e) {
                    //progress for downloading
                    progress(e.loaded / (e.total * 2), "downloading");
                },
                function onError(e) {
                    error("Error while downloading! ", e.exception);
                }
            );
        }
        function woodTypeName(type) {
            switch(type) {
                case 0:
                    return "Nadelholz";
                case 1:
                    return "Laubholz ringporig";
                case 2:
                    return "Laubholz zerstreutporig";
            }
        }
        function heartwoodTypeName(type) {
            switch(type) {
                case 0:
                    return "Keins";
                case 1:
                    return "Obligatorisch";
                case 2:
                    return "Fakultative";
            }
        }
		function hasData(callBack) {
            if (_woodsData.data.raw !== "") {
                callBack(_woodsData.data.prepared);
            } else {
                //no offline data -> download page
                //$state.go($state.get('app.init'), {}, {reload: ''});
            }
		}
        function generateUrls(data, baseUrl) {
            //iterate and generate image urls
            var woods = [],
                wood = null,
                i = 0;

            for(var x = 0; x < data.length; x++) {
                //iterate over woods and create image urls
                wood = data[x];
                wood.URLacross = [];
                wood.URLprofile = [];
                wood.URLbark = [];
                wood.preview = baseUrl + wood.id + '/thumbs/bark.jpg';

                wood.properties = [];

                wood.properties.push({
                    name: "Deutsch",
                    value: wood.name_de
                });
                wood.properties.push({
                    name: "Botanisch",
                    value: wood.name_bo
                });
                wood.properties.push({
                    name: "Holzart",
                    value: woodTypeName(wood.woodtype)
                });
                wood.properties.push({
                    name: "Kernholz",
                    value: heartwoodTypeName(wood.heartwood)
                });
                wood.properties.push({
                    name: "Holz",
                    value: wood.m_holz
                });
                if (wood.m_frisch !== "") {
                    wood.properties.push({
                        name: "Frischholz",
                        value: wood.m_frisch
                    });
                }
                wood.properties.push({
                    name: "Rinde",
                    value: wood.m_rinde
                });

                for (i = 0; i < wood.longi; i++) {
                    wood.URLacross.push(baseUrl + wood.id + '/longi/' + i + '.jpg');
                }
                for (i = 0; i < wood.profile; i++) {
                    wood.URLprofile.push(baseUrl + wood.id + '/profile/' + i + '.jpg');
                }
                for (i = 0; i < wood.bark; i++) {
                    wood.URLbark.push(baseUrl + wood.id + '/bark/' + i + '.jpg');
                }
            }
        }

		return {
            init: function(success, progress, error) {
                if (_woodsData.offline) {
                    //data already loaded
                    progress(0, "Prepare woody data");
                    var value = 0;
                    var interval = setInterval(function() {
                        if (value >= 1) {
                            clearInterval(interval);
                            success();
                        } else {
                            value += 0.05;
                            progress(value, "Prepare woody data");
                        }
                    }, 100);
                    return;
                }
                /* region needed for browser support*/
                var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
                if (!app) {
                    // Web page
                    console.log("dev browser mode");
                    $.ajax({
                        dataType: "json",
                        url: "/data/woodsData.json",
                        // data: data,
                        success: function(data) {
                            generateUrls(data, "/data/img/woods/");
                            saveData(data, data);
                            success();
                        }
                    });
                    return;
                }
                /* endregion */
                progress(0, "Chopping data in the woods");
                grabDataFromServer(function onSuccess() {
                    // load json
                    fileSystem.readFile("/data/woodsData.json", function(data) {
                        // build image urls
                        data = JSON.parse(data);
                        var rawData = data.slice();
                        generateUrls(data, "file:///data/data/de.salt.brettvormkopf/files/files/data/img/woods/");
                        saveData(data, rawData);
                        success();
                    });
                }, function onProgress(percent, job) {
                    progress(percent, job);
                }, error);
            },
			getWoods: function(callBack) {
				hasData(function(data) {
					callBack(data);
				});
			},
            getWoodsSync: function() {
                return _woodsData.data.prepared;
            },
			getWoodByID: function(id, callBack) {
				hasData(function(data) {
					callBack(getByID(data, id));
				});
			},
            hasData: function() {
                //needed for browser support
                var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
                if (!app) {
                    return true;
                }
                return _woodsData.offline;
            }
		};

    });