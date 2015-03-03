angular.module('FrameIt', [
  'ozpIwcClient'
]);
angular.module('FrameIt').controller('MainController', ['ozpIwcClient']);

angular.module('FrameIt').controller('MainController', function($scope, $rootScope,
                                                                $http, $interval,
                                                                $sce, $location,
                                                                $window,
                                                                iwcClient) {

  var ozpIwcPeerUrl = '';
  var queryParams = $location.search();
  if (queryParams.hasOwnProperty('ozpIwc.peer')) {
    ozpIwcPeerUrl = queryParams['ozpIwc.peer'];
    console.log('found IWC bus in query param: ' + ozpIwcPeerUrl);
  } else {
    ozpIwcPeerUrl = $window.OzoneConfig.iwcUrl;
  }
  console.log('FrameIt query params: ' + JSON.stringify(queryParams));

  $scope.ozpBusInfo = {
    'url': ozpIwcPeerUrl,
    'connected': false
  };

  $scope.data = {
    'url': 'http://www.xkcd.com'
  };

  $scope.iframeUrl = $sce.trustAsResourceUrl($scope.data.url);

  // Resource looks like:
  // {'persist': true, 'recentUrls': ['www.amazon.com', 'www.google.com', ...]}
  var frameItDataResource = '/frameit-data';

  // Stored in and retrieved from IWC (data.api)
  $scope.recentUrls = [];

  $scope.connectToBus = function() {
    $scope.ozpBusInfo.connected = false;
    console.log('FrameIt using IWC bus: ' + $scope.ozpBusInfo.url);
    $scope.iwcClient = new iwcClient.Client({
      peerUrl: $scope.ozpBusInfo.url
    });

    $scope.iwcClient.on('connected', function() {
      console.log('client connected to ozp bus successfully');
      $scope.ozpBusInfo.connected = true;
      registerWatch();
      getData('data.api', frameItDataResource).then(function(entity) {
        if (entity.recentUrls) {
          $scope.recentUrls = entity.recentUrls;
        }
        if(!$scope.$$phase) { $scope.$apply(); }
      });
    });
  };

  $scope.disconnectFromBus = function() {
   console.log('disconnecting from ozp bus...');
   $scope.iwcClient.disconnect();
   $scope.ozpBusInfo.connected = false;
   };


  $scope.loadUrl = function(recentUrl) {
    if (recentUrl) {
      var url = recentUrl;
      $scope.data.url = url;
    } else {
      var url = $scope.data.url;
    }
    console.log('reload iframe with url: ' + url);
    $scope.iframeUrl = $sce.trustAsResourceUrl(url);
    saveUrlToRecentList(url);

  };

  $scope.handleKeyup = function($event) {
    if ($event.keyCode === 13) {
      $scope.loadUrl();
    }
  };

  function saveUrlToRecentList(url) {
    var dup = false;
    try {
      for (var i = 0; i < $scope.recentUrls.length; i++) {
        if (url === $scope.recentUrls[i]) {
          dup = true;
        }
      }
      if (!dup) {
        $scope.recentUrls.push(url);
      }
      // limit to most recent 5 urls
      $scope.recentUrls = $scope.recentUrls.slice(-5);
      var entity = {
        'persist': true,
        'recentUrls': $scope.recentUrls
      };
      setData('data.api', frameItDataResource, entity);
    }
    catch (err) {
      console.log('WARNING: error in saveUrlToRecentList: ' + err);
    }
  }

  // set data in IWC
  function setData(dst, resource, entity) {
    return $scope.iwcClient.api(dst)
      .set(resource, {"entity": entity})
      .then(function (response) {
        if (response) {
          console.log('updated OK');
          return true;
        } else {
          console.log('update failed');
          return false;
        }
      });
  }

  // get data from IWC
  function getData(dst, resource) {
    return $scope.iwcClient.api(dst)
      .get(resource)
      .then(function (response) {
        if (response) {
          console.log('got data OK');
          console.log(response.entity);
          return response.entity;
        } else {
          console.log('got data failed');
          return false;
        }
      });
  }

  // register watch on our data in IWC
  function registerWatch() {
    $scope.iwcClient.api('data.api').watch(frameItDataResource, function(reply) {
      if (reply.response === 'changed') {
        console.log('detected change in ' + frameItDataResource + ' data');
        console.log(reply.entity.newValue);
        $scope.recentUrls = reply.entity.newValue.recentUrls;
        console.log('recent urls: ' + $scope.recentUrls);
        if(!$scope.$$phase) { $scope.$apply(); }
      }
    });
  }

  // initialization
  $scope.connectToBus();

});

