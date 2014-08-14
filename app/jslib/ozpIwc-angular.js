
angular.module('ozpIwc', [])
    .constant("ozpIwcConfig",{peerUrl:"/peer"})
    .factory("iwcClient",["ozpIwcConfig",function(config) {
        return client=new ozpIwc.Client(config);
    }])
//    .run(["iwcClient",function(client) {
//       $rootScope.bindToIwc=function(field,api,resource,otherFields) {
//           var basePacket=otherFields || {};
//           basePacket.dst=api;
//           basePacket.resource=resource;
//           basePacket.action="set";
//           
//           // keeps an IWC change event from causing a 
//           var scopeVersion=0;
//           var iwcVersion=0;
//           
//           // watch for Angular changes and propogate
//           this.$watch(field,function(newValue,oldValue) {
//             if(scopeVersion !== iwcVersion) {
//                var packet=ozpIwc.util.clone(basePacket);
//                packet.entity=newValue;
//                client.send(packet);
//                scopeVersion=iwcVersion;
//            }
//           },true);
//           
//           // watch the IWC value and propogate
//           client.send({
//               'dst': api,
//               'resource': resource,
//               'action': 'watch'
//           },function(response) {
//               if(response.action === "changed" && !locked) {
//                   iwcVersion++;
//                   
//                   self.$apply(function() {
//                       self[field]=response.entity.newValue;
//                   });
//               }
//           });           
//       };  
//    }]);

;
  