angular.module("BvK.services", [])
	.factory('woodGrabber', function($http, fileSystem) {
		var _woodsData,
            _woods = null,
            _rawData = null,
            debug = false,
            // serverUrl = 'http://bvk.salt.bplaced.net/data/',
            serverUrl = 'http://9tbass.de/bvk/data/',
            // serverUrl = 'http://localhost:8080/data/',
            woodsUrl = serverUrl + 'img/woods/';

		if (debug) {
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
		function grabJSONFromServer() {
            return $.getJSON(serverUrl + 'woodsData.json');
        }
        function grabDataFromServer(success, progress, error) {
            //@todo use server url from variable
            fileSystem.download("http://192.168.0.32:8080/data/data.zip", "/download/data.zip",
                function onSuccess() {
                    // unzipping
                    fileSystem.unzip('/download/data.zip', "/data", function onSuccessError(state, err) {
                        if (state < 0) {
                            error("Error while unzipping ", err);
                            return;
                        }
                        //@todo remove download folder
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
                    error("Error while downloading ", e);
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
            if (_woodsData.data.raw != "") {
                callBack(_woodsData.data.prepared);
            } else {
                //no offline data -> download page
                //$state.go($state.get('app.init'), {}, {reload: ''});
            }
		}
        function compare(a, b) {
            if (typeof a != "string" || typeof b != "string") {
                console.log("not a string")
                return false
            }
            if (a === b) {
                return true;
            }
        };

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
                if (true) { //browser
                    $.ajax({
                        dataType: "json",
                        url: "/data/woodsData.json",
                        // data: data,
                        success: function(data) {
                            console.log("loaded", data);
                            generateUrls(data, "/data/img/woods/");
                            saveData(data, data);
                            success();
                        }
                    });
                    return;
                }
                if (_woodsData.offline) {
                    //data already loaded
                    //@todo progress("prepare data")?
                    //@todo success();
                }
                progress(0, "Waiting for response from server...");
                grabDataFromServer(function onSuccess() {
                    // load json
                    fileSystem.readFile("/data/woodsData.json", function(data) {
                        // build image urls
                        var data = JSON.parse(data);
                        var rawData = data.slice();
                        generateUrls(data, "file:///data/data/de.salt.brettvormkopf/files/files/data/img/woods/");
                        saveData(data, rawData);

                        success();
                    });
                }, function onProgress(percent, job) {
                    progress(percent, job);
                }, error);
            },
            //@todo deprecated
            checkState: function(callBack) {
                console.log("deprecated");
                var state = {
                    online:false,
                    up2data:true,
                    dataSrc:1,//0=offline  1=online
                    offlineData:false,
                    error:false
                };
                grabJSONFromServer()
                .success(function(e) {
                    state.online = true;
                    if (!_rawData) {
                        console.log("no offline data")
                        state.up2data = false;
                    }
                    if (compare(JSON.stringify(e), _rawData) ) {
                        console.log("allready up 2 data")
                    } else {
                        console.log("not up 2 data")
                        state.up2data = false;
                    }
                    callBack(state);
                })
                .error(function(e) {
                    console.log("no internet connecting")
                    state.error = true;
                    callBack(state);
                });
            },
            //@todo deprecated
            isOffline: function() {
                console.log("deprecated");
                return _offline;
            },
			getWoods: function(callBack) {
				hasData(function(data) {
					callBack(data);
				});
			},
			getWoodByID: function(id, callBack) {
				hasData(function(data) {
					callBack(getByID(data, id));
				});
			},
		};

    });