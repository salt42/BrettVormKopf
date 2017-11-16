angular.module("BvK.services", [])
	.factory('woodGrabber', function($http) {
		var _woodsData,
            _woods = null,
            _rawData = null,
            // serverUrl = 'http://9tbass.de/bvk/data/',
            serverUrl = 'http://localhost:8080/data/',
            woodsUrl = serverUrl + 'img/woods/';
    
    //localStorage.setItem("woodsData", null);
        _woodsData = JSON.parse(localStorage.getItem("woodsData") );
        //first time init data structure
        if (_woodsData == null || !("offline" in _woodsData)) {
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
    
        function setOffline() {
            _woodsData.offline = true;
            localStorage.setItem("woodsData", JSON.stringify(_woodsData));
        }
        function saveData(prepared, raw) {
            _woodsData.data.prepared = prepared;
            _woodsData.data.raw = raw;
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
		function grabFromServer() {
            return $.getJSON(serverUrl + 'woodsData.json');
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
		function prepareData(data, callBack) {
			var x = 0,
				i,
				wood,
				imageName,
                count = 0,
                max = 0;

            var called = false;
                        
            function setCachedUrl(onlineUrl, targetArray) {
                if (_woodsData.offline) {
                    ImgCache.getCachedFileURL(onlineUrl, function(url, localUrl) {
                        count++;
                        if (localUrl) {
                            targetArray.push(localUrl);
                        } else {
                        }
                        checkReady();
                    });
                } else {
                    targetArray.push(onlineUrl);
                    count++;
                }
            }
            function checkReady() {
                console.log(count, max);
                if (!called && count >= 39) {
                    callBack(data);
                    called = true;
                }
            }
            function cachedPrev(woodId) {
                if (_woodsData.offline) {
                    ImgCache.getCachedFileURL(data[woodId].preview, function(url, localUrl) {
                        count++;
                        data[woodId].preview = localUrl;
                        checkReady();
                    });
                } else {
                    count++;
                }
            }
            for(x = 0; x < data.length; x++) {
                max += data[x].longi + data[x].profile + data[x].bark + 1;
            }
			for(x = 0; x < data.length; x++) {
				//iterate over woods and create image urls
				wood = data[x];
				wood.URLacross = [];
				wood.URLprofile = [];
				wood.URLbark = [];
                wood.preview = woodsUrl + wood.id + '/thumbs/bark.jpg';
                cachedPrev(wood.id);
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
                if (wood.m_frisch != "") {
                    wood.properties.push({    
                                name: "Frischholz",
                                value: wood.m_frisch
                        });
                }
                wood.properties.push({
                            name: "Rinde",
                            value: wood.m_rinde
                        });
        
				for (i=0;i<wood.longi;i++) {
					imageName = woodsUrl + wood.id + '/longi/' + i + '.jpg';
                    setCachedUrl(imageName, wood.URLacross);
				}
				for (i=0;i<wood.profile;i++) {
					imageName = woodsUrl + wood.id + '/profile/' + i + '.jpg';
                    setCachedUrl(imageName, wood.URLprofile);
				}
				for (i=0;i<wood.bark;i++) {
					imageName = woodsUrl + wood.id + '/bark/' + i + '.jpg';
                    setCachedUrl(imageName, wood.URLbark);
                }
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
        function useOfflineData() {
            var data = JSON.parse(localStorage.getItem("woods"));
            if (Array.isArray(data) && data.length > 0) {
                _woods = data;
                return true;
            }
            return false;
        }
    
        function cacheImages(rawData, success, progress, error) {
            var urls = [],
                progressValue = 0,
                wood,
                i = 0,
                a = 0;
            
            //@todo check if chached allready
            for(i = 0; i < rawData.length; i++) {
                wood = rawData[i];
                for (a=0;a<wood.longi;a++) {
					urls.push(woodsUrl + wood.id + '/longi/' + a + '.jpg');
				}
				for (a=0;a<wood.profile;a++) {
					urls.push(woodsUrl + wood.id + '/profile/' + a + '.jpg');
				}
				for (a=0;a<wood.bark;a++) {
					urls.push(woodsUrl + wood.id + '/bark/' + a + '.jpg');
				}
                urls.push(woodsUrl + wood.id + '/thumbs/bark.jpg');
            }
            function cacheFile(url) {
                ImgCache.cacheFile(url, function() {
                    progressValue++
                    progress(progressValue / urls.length, url);
                    if ( progressValue / urls.length >= 1) {
                        success();
                    }
                }, function error(e,b) {
                    progressValue++;
                    progress(progressValue / (urls.length), e);
                },function(pe) {
                    //@todo eventual load bar per image
                    if(pe.lengthComputable) {
                        //console.log("dsa", pe.total, pe.loaded)
                    }
                });
            }
            for(i = 0; i < urls.length; i++) {
                //download file to local storage
                cacheFile(urls[i]);
            }
        }
    
    
		return {
            init: function(success, progress, error) {
                //if online update data if needed -> prepareData
                //if offline and no offlineData -> error
                var progValue = 0.02;
                //pseudo load for nice load screen
                function pseudoLoad(succses, progress) {
                    var count = 2,
                        max = 20;

                    function tick() {
                        count++;
                        if (count < max) {
                            progress(count/max);
                            setTimeout(tick, 20);
                        } else {
                            progress(1);
                            succses();
                        }
                    }
                    tick();
                }
                progress(progValue, "Waiting for response from server...");
                grabFromServer()
                .success(function(data,name,e) {
                    progValue += 0.04;
                    progress(progValue, "Talking to server...");
                    //compareData -> update
                    console.log("comparing offline data to online data: ", data);
                    if (e.responseText, _woodsData.data.raw) {
                        //gleich -> use offline (tun nichts)
                        pseudoLoad(
                            function() {
                                success();
                            },
                            function(prog) {
                                progValue += prog;
                                progress(prog, "Preparing woody data...");
                            }
                        );
                    } else {
                        progValue += 0.04;
                        progress(progValue, "Fetching data from server (only the first time).");
                        //cache data
                        cacheImages(data,
                            function succ() {
                                setOffline(true);
                                prepareData(data, function(prepared){
                                    saveData(prepared, data);
                                    success(prepared);
                                });
                            },
                            function prog(value, url) {
                                progress(value*0.9 + progValue, (url ? "caching image: " + url : url));
                            },
                            function error(err) {
                                console.log(err);
                                error(err);
                            }
                        );
                    }
                })
                .error(function(e) {
                    if(_woodsData.data.raw != "") {
                        pseudoLoad(
                            function() {
                                success();
                            },
                            function() {
                                progValue += 0.02;
                                progress(progValue, "load data from cache.");
                            }
                        );
                    } else {
                        //@todo error handling
                        error("msg");
                    }
                });
            },
            checkState: function(callBack) {
                var state = {
                    online:false,
                    up2data:true,
                    dataSrc:1,//0=offline  1=online
                    offlineData:false,
                    error:false
                };
                grabFromServer()
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
            isOffline: function() {
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