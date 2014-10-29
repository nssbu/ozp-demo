'use strict';
// Declare app module
angular.module('ozpIwcAngularReciever', [
    'ozpIwcClient'
]);

angular.module('ozpIwcAngularReciever').controller('DemoController', function ($scope, iwcClient) {

    // IWC Set-up
    var client = new iwcClient.Client({
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
            if(response.response === 'changed'){
                $scope.message = response.entity.newValue;
                $scope.$apply();
            }
            return true;
        });

        
    });
});