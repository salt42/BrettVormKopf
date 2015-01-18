app.factory('woodGrabber', function($http) {
	var _woods = null;

	function getByID(id) {
		id = parseInt(id);
		for (var i in _woods) {
			if ('id' in _woods[i] && _woods[i].id === id) {
				return _woods[i];
			}
		}
		 return false;
	}

	function grabFromServer() {
		return $http.get(serverUrl + 'woodsData.json');
	}
	function prepareAndSaveData(data) {
		var x = 0,
			i,
			wood,
			imageName;

		for(x;x<data.length;x++) {
			//iterate over woods and create image urls
			wood = data[x];
			wood.URLacross = [];
			wood.URLprofile = [];
			wood.URLbark = [];
			// wood.preview = woodsUrl + wood.id + '/thumb.jpg';
			wood.preview = woodsUrl + wood.id + '/thumbs/bark.jpg';

			for (i=0;i<wood.longi;i++) {
				imageName = woodsUrl + wood.id + '/longi/' + i + '.jpg';
				wood.URLacross.push(imageName);
			}
			for (i=0;i<wood.profile;i++) {
				imageName = woodsUrl +wood.id + '/profile/' + i + '.jpg';
				wood.URLprofile.push(imageName);
			}
			for (i=0;i<wood.bark;i++) {
				imageName = woodsUrl + wood.id + '/bark/' + i + '.jpg';
				wood.URLbark.push(imageName);
			}
		}
		_woods = data;
	}
	function checkData(callBack) {
		if (_woods === null) {
			grabFromServer().success(function(e) {
				prepareAndSaveData(e);
				callBack();
			});
		} else {
			callBack();
		}
	}
	return {
//		getWoodsSync: function() {
//			if (_woods) {
//				return _woods;
//			}
//			return false;
//		},
		getWoods: function(callBack) {
			checkData(function() {
				callBack(_woods);
			});
		},
		getWoodByID: function(id, callBack) {
			checkData(function() {
				callBack(getByID(id));
			});
		},
	};
});