'use strict';

/* Controllers */

angular.module('ozpDemo.DataAugmentationWebtop').controller('TileController', [
    '$scope',"iwcClient",function(scope,client) {
        
        scope.widgets=[
            {
                name: "Sample Widget",
                content: "Nothing, yet",
                position:[0,0],
                size: {
                    x: 3,
                    y: 3
                }
            }          
        ];
        client.on("connected",function() {
        client.send({
               'dst': "data.api",
               'resource': "/workContext",
               'action': 'watch'
           },function(response) {
                       console.log("Widget changed to ",response);
               if(response.action === "changed") {
                   scope.$apply(function() {
                       scope.widgets[0].content=JSON.stringify(response.entity.newValue,null,2);
                   });
               }
               return true;
           });  
       });
  }]);
