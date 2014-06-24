(function(angular, global, undefined) {
   var appShell = angular.module("appShell", [
      "ngRoute",
      "ngSanitize",
      "ngTouch",
      // "ngResource",
      // "ngAnimate",
      
      // app specific modules
      "appui",
      "api",
      "signup"
   ]);
   
   
   appShell.config(["$routeProvider", function($routeProvider) {
      $routeProvider.when("/", {
         redirectTo: "/signup"
      });
   }]);

   /*
   appShell.config("$httpProvider", function($httpProvider) {
      $httpProvider.interceptors.push(["$rootScope", "$q", "$location", 
         function($rootScope, $q, $location) {
            var count = 0;

            function ajaxStart(config) {
               count += 1;
               $rootScope.$emit("app.ajaxstart", config.url);
            }

            function ajaxEnd(config) {
               count -= 1;
               $rootScope.$emit("app.ajaxend", config.url);
               if(count <= 0) {
                  count = 0;
                  $rootScope.$emit("app.ajaxcomplete");
               }
            }
            
            return {};
         }
      ]);
   });
   */


   appShell.controller("AppShell", 
         ["$scope", "$rootScope", "$window", "$location", "Session", "Api", "Notification",
         function($scope, $rootScope, $window, $location, Session, Api, Notification) {
            $rootScope.$on("app.ajaxstart", function() {

            });

            $rootScope.$on("app.ajaxend", function() {

            });
            
            $scope.signOut = function() {
               Session.invalidate();
               $location.path("/");
               Notification.success("You have successfully signed out");
            };

            $scope.$on("$routeChangeStart", function() {
               var user = $scope.user = Session.getCurrentUser(),
                     path = $location.path();
                     
               if(!user || !user.userToken) {
                  // we are on signin page, just ignore
                  if(!path || path === "/" || path === "/signup") {
                     return;
                  }else {
                     $location.path("/signup");
                     Notification.warn("You need to sign in to do that");
                     return;
                  }
               }else {
                  if(user.userToken) {
                     if(!path || path === "/" || path === "/signup") {
                        $location.path("/dashboard");
                     }
                  }
               }
               
            });

            $scope.$on("$routeChangeSuccess", function(e, curr, prev) {
               $window.scrollTo(0, 0);
            });

         }
   ]);
   
})(angular, window);
