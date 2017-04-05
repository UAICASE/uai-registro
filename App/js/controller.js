var EmailSender = angular.module('EmailSender', ['firebase', 'ngCookies'])

.controller('MainCtrl', function($scope, $http, $firebaseObject, $firebaseArray,$cookies) {

    $scope.sendData = {};
	$scope.sendData.user = {};	    
	$scope.projects = [];
	$scope.selected = [];
    $scope.sendSuccess = false;
    $scope.sendingMail = false;

    var ref = new Firebase("https://uai-registro.firebaseio.com");

	$http.get('../assets/projects.json').then(function(result){
		$scope.items = result.data.projects;
	});

	$scope.uploadToDb = function (data, child) {
		$scope.registry = $firebaseArray(ref.child(child));
		$scope.registry.$add(data);
	}

	$scope.data = $firebaseArray(ref.child('registry'));

	
	$scope.validate = function() {
		$scope.userProjects = [];
		$scope.step2 = true;
		$scope.step1 = !$scope.step2;
		$scope.data.$loaded(function() {
			for (var i = 0; i < $scope.data.length; i++) {
				if ($scope.sendData.user.mail === $scope.data[i].user.mail) {
					for (var k = 0;k < $scope.data[i].items.length; k++) {
						$scope.userProjects.push($scope.data[i].items[k]);
					}
				}
			}
	    });
	}

	$scope.renderProjectLabel = function (id) {
		for (var i = 0;i < $scope.userProjects.length; i++) {
			if (id == $scope.userProjects[i]) {
				return true;
			}
		}
	}
	

	$scope.setLocalizacion = function(loc) {
		$scope.sendData.localization = loc;
		$scope.step1 = false;
		$scope.step1 = true;
		$scope.step2 = false;
		
		$http.get("/localization/"+loc).then(function(result){
			$scope.items = result.data;
		});
	
	}
	
	
	var mail = $cookies.get("uai-mail");
	// var name = 
	
	$cookies.get("uai-name");

	if (mail) {
		$scope.sendData.user.mail = mail;
		$scope.sendData.user.name = $cookies.get("uai-name");
		$scope.validate();
	}
	
	$scope.validProject = function(id){
		var found = false;
		
		if (!$scope.projects) $scope.projects = [];

		for(var i = 0; i < $scope.projects.length; i++) {
			if ($scope.projects[i].project == id) {
				return true;
				
			}
		}
	
	}


	$scope.valid=function(){
		var ok = false;
		for (var i=0; i<$scope.selected.length; i++){
			
			if ($scope.selected[i]) ok = true;

		}
		return ok;
	
	}
	
	
	$scope.send = function(){

		$scope.sendData.items = [];
		
		for (var i=0; i < $scope.selected.length; i++){
			if ($scope.selected[i]) $scope.sendData.items.push(i);
		}

		$scope.uploadToDb($scope.sendData, 'registry');

		$http.post('/send',$scope.sendData).then(function (respond) { 
			$cookies.put("uai-mail",$scope.sendData.user.mail);
			$cookies.put("uai-name",$scope.sendData.user.name);
			$scope.sendSuccess = true;	
			$scope.sendingMail = false;
		});
			
	}
	
	

})

.controller('AdminCtrl', function($scope, $http, $firebaseObject, $firebaseArray) {
	var ref = new Firebase("https://uai-registro.firebaseio.com");
	$scope.data = $firebaseArray(ref.child('registry'));
	$scope.centro = 0;
	$scope.oeste = 0;
	$scope.norte = 0;
	$scope.sur = 0;

	$http.get('../assets/projects.json').then(function(result){
		$scope.items = result.data.projects;
	});

	$scope.renameProject = function (id) {
		for (var i = 0; i < $scope.items.length; i++) {
			if ($scope.items[i].id == id ) {
				return $scope.items[i].name
			}
		}
	}


	$scope.data.$loaded(function() {
		$scope.results = $scope.data;
		$scope.mailSended = $scope.data.length;	
		for (var i = 0; i < $scope.results.length ; i++) {
			if ($scope.results[i].localization === 'Centro') {
				$scope.centro = $scope.centro + 1; 
			}
			if ($scope.results[i].localization === 'Oeste') {
				$scope.oeste = $scope.oeste + 1; 
			}
			if ($scope.results[i].localization === 'Norte') {
				$scope.norte = $scope.norte + 1; 
			}
			if ($scope.results[i].localization === 'Sur') {
				$scope.sur = $scope.sur + 1; 
			}
		}
	});

	


});
