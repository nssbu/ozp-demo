'use strict';
// Declare app module
angular.module('ozpIwcAngularReciever', [
    'ozpIwcAngular'
]);

angular.module('ozpIwcAngularReciever').controller('DemoController', function ($scope, ozpIwc) {

    // IWC Set-up
    var client = new ozpIwc.Client({
        peerUrl: 'http://' + window.location.hostname + ':9001'
    });

    $scope.message = 'No data yet', $scope.connected = false;

    var watchRequest={
        dst: 'data.api',
        action: 'watch',
        resource: '/ngdata'
    };

    client.on('connected', function () { 

        $scope.connected = true;
        $scope.$apply();

        client.send(watchRequest, function(response){

            console.log("RESPONSE RECIEVED ");
            console.dir(response);
            if(response.action === 'changed'){
                $scope.message = response.entity.newValue;
                $scope.$apply();
            }
            return true;
        });

        
    });
});