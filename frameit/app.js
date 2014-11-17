angular.module('FrameIt', [
  'ozpIwcClient'
]);
angular.module('FrameIt').controller('MainController', ['ozpIwcClient']);

angular.module('FrameIt').controller('MainController', function($scope, $rootScope, $http, $interval, $sce, iwcClient) {

  $scope.ozpBusInfo = {
    'url': 'http://ozone-development.github.io/iwc',
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
      }
    });
  }

  // initialization
  $scope.connectToBus();


//
//  $scope.refresh = function() {
//    if ($scope.ozpBusInfo.connected) {
//      $scope.disconnectFromBus();
//    }
//    $scope.connectToBus();
//    $scope.appListings = [];
//    $scope.dashboardData = [];
//    getApplications().then(function() {
//      getDashboards().then(function() {
//        if(!$scope.$$phase) { $scope.$apply(); }
//      });
//    });
//  };
//
//  function getApplicationResources() {
//    return $scope.iwcClient.api('system.api')
//      .get('/application')
//      .then(function (reply) {
//        return reply.entity;
//      });
//  };
//
//  function saveAppData(appResource, appListings) {
//    return $scope.iwcClient.api('system.api').get(appResource).then(function(appData) {
//      appListings.push(appData.entity);
//    });
//  }
//
//  function getDashboardData() {
//    return $scope.iwcClient.api('data.api')
//      .get(dashboardDataResource)
//      .then(function (reply) {
//        return reply.entity;
//      });
//  }
//
//  function getDashboards() {
//    $scope.loadingDashboards = true;
//    return getDashboardData().then(function(dashboardData) {
//      try {
//        var num = dashboardData.dashboards.length;
//      } catch (err) {
//        $scope.invalidDashboards = true;
//        $scope.loadingDashboards = false;
//        if(!$scope.$$phase) { $scope.$apply(); }
//        return;
//      }
//      $scope.invalidDashboards = false;
//      $scope.dashboardData = dashboardData;
//      var dashboards = $scope.dashboardData.dashboards;
//      // match up app names with those from mp
//      for (var a=0; a < dashboards.length; a++) {
//        dashboards[a].validApps = [];
//        dashboards[a].invalidApps = [];
//        for (var b=0; b < dashboards[a].frames.length; b++) {
//          for (var c=0; c < $scope.appListings.length; c++) {
//            if (dashboards[a].frames[b].appId === $scope.appListings[c].id) {
//              dashboards[a].validApps.push($scope.appListings[c].name);
//            } else if (dashboards[a].frames[b].appName === $scope.appListings[c].name) {
//              console.log('warning: got invalidated app: ' + $scope.appListings[c].name);
//              dashboards[a].invalidApps.push($scope.appListings[c].name);
//              $scope.dashboardData.dashboards[a].frames[b].appId = $scope.appListings[c].id;
//            }
//          }
//        }
//      }
//      $scope.loadingDashboards = false;
//      if(!$scope.$$phase) { $scope.$apply(); }
//    });
//  };
//
//  function getApplications() {
//    $scope.loadingMarketplace = true;
//    return getApplicationResources().then(function(apps) {
//    console.log('got ' + apps.length + ' apps from MP');
//    $scope.appListings = [];
//    return apps.reduce(function (previous, current) {
//            return previous.then(function () {
//              var promise = saveAppData(current, $scope.appListings);
//              return promise;
//            }).catch(function (error) {
//              console.log('should not have happened: ' + error);
//            });
//          }, Promise.resolve()).then(function () {
//            // all application data obtained
//            console.log('finished getting app data for ' + $scope.appListings.length + ' apps');
//            $scope.loadingMarketplace = false;
//            if(!$scope.$$phase) { $scope.$apply(); }
//          });
//
//    });
//  };
//
//  function setData(dst, resource, entity) {
//    return $scope.iwcClient.api(dst)
//      .set(resource, {"entity": entity})
//      .then(function (response) {
//        if (response) {
//          console.log('updated OK');
//          return true;
//        } else {
//          console.log('update failed');
//          return false;
//        }
//      });
//  }
//
//  // assumes $scope.dashboardData has already been modified (happens during
//  // initial load and refresh)
//  $scope.syncDashboardData = function() {
//    return setData('data.api', dashboardDataResource, $scope.dashboardData).then(function() {
//      $scope.refresh();
//    });
//  };
//
//  $scope.reloadDashboardData = function() {
//    $http.get('dashboard-data.json').success(function(data) {
//      console.log(data);
//      setData('data.api', dashboardDataResource, data).then(function() {
//        $scope.refresh();
//      });
//    });
//  };
//
//  // initialization
//  $scope.refresh();

});

