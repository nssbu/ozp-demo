'use strict';

// Declare app module
angular.module('ozpIwcAngularSender', [
    'ozpIwcAngular'
]);

angular.module('ozpIwcAngularSender').controller('DemoController', function ($scope, ozpIwc) {

    $scope.myData = '', $scope.connected = false;

    // IWC Set-up
    var client = new ozpIwc.Client({
        peerUrl: 'http://' + window.location.hostname + ':9001'
    });

    var pushRequest={
        dst: "data.api",
        action: "set",
        resource: "/ngdata",
        entity: { myData: $scope.myData }
    };


    client.on('connected', function () { 

        client.send(pushRequest, function(packet){
            if(packet.action==="ok") {
                console.log("Request sucessful");
            } else {
                console.log("Failed to push the data " + JSON.stringify(packet,null,2));
            }
            return null;//de-register callback
        });

        $scope.connected = true;
        $scope.$apply();
    });

    $scope.send = function () {
        client.send({
            dst: "data.api",
            action: "set",
            resource: "/ngdata",
            entity: $scope.myData
        }, function(){ 
            return false; 
        });
    };
});