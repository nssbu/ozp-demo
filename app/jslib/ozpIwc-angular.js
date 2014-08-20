(function() {
var iwcModule=angular.module('ozpIwc', []);

iwcModule.constant("ozpIwcConfig",{peerUrl:"/peer"});

iwcModule.factory("iwcClient",["ozpIwcConfig",function(config) {
    return client=new ozpIwc.Client(config);
}]);

iwcModule.directive("iwcModel",function() {
    return {
      restrict: 'A',
      scope: true,
      link: function(scope,element,attrs) {
          // form is "field@bar.api/resource"
          var matches=attrs.iwcModel.match(/([^@]+)@([^/]*)(.*)/);
          var field=matches[1];
          var api=matches[2] || "data.api";
          var resource=matches[3];
          scope.bindToIwc(field,api,resource);

      }
    };
});


    iwcModule.run(["iwcClient","$rootScope",function(client,$rootScope) {
       $rootScope.bindToIwc=function(field,api,resource,packetFragment) {
           var basePacket=packetFragment || {};
           basePacket.dst=api;
           basePacket.resource=resource;
           basePacket.action="set";
           
//           // keeps an IWC change event from causing a 
//           var scopeVersion=0;
//           var iwcVersion=0;
//           // watch for Angular changes and propogate
//           this.$watch(field,function(newValue,oldValue) {
//             if(scopeVersion !== iwcVersion) {
//                var packet=ozpIwc.util.clone(basePacket);
//                packet.entity=newValue;
//                client.send(packet);
//                scopeVersion=iwcVersion;
//            }
//           },true);
           
           // watch the IWC value and propogate
           var self=this;
           client.send({
               'dst': api,
               'resource': resource,
               'action': 'get'
           },function(response) {
               if(response.response === "ok") {
//                   iwcVersion++;
                   
                   self.$apply(function() {
                       self[field]=response.entity;
                   });
               }
           });           
           client.send({
               'dst': api,
               'resource': resource,
               'action': 'watch'
           },function(response) {
               if(response.response === "changed") {
//                   iwcVersion++;
                   
                   self.$apply(function() {
                       self[field]=response.entity.newValue;
                   });
               }
               return true;
           });           
       };  
    }]);
})();  