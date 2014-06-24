(function(angular, window, undefined) {
   var googlemaps = angular.module("googlemaps", []);
   
   if(typeof google !== "undefined") {
      google.maps.visualRefresh = true;
   }
   
   googlemaps.directive("googleMap", [function() {
      var defaults = {
         center: new google.maps.LatLng(37.769357797482144,-122.48531055869535),
         zoom: 15,
         mapTypeId: google.maps.MapTypeId.ROADMAP,
         panControl: false,
         rotateControl: false,
         tilt: 45
      };
         
      return {
         restrict: "A",
         scope: {
            options: "=",
            events: "=",
            onmapready: "&"
         },
         controller: ["$scope", "$element", function($scope, $element) {
            this.getMap = function() {
               return $scope.map;
            };
         }],
         link: function(scope, elem, attrs) {
            var map, options = angular.extend({}, defaults, scope.options), events = scope.events || {};
            
            map = new google.maps.Map(elem[0], options);
            
            for(var evName in events) {
               google.maps.event.addListener(map, evName, function(evt) {
                  evt.map = map;
                  events[evName](evt);
               });
            }
            
            scope.map = map;
            if(typeof scope.onmapready === "function") {
               scope.onmapready({map: map});
            }
         }
      };
   }]);

   googlemaps.directive("googleAutocomplete", [function() {
      var defaults = {
         componentRestrictions: {
            country: "us"
         }
      };
      
      return {
         restrict: "A",
         require: "?ngModel",
         scope: {
            options: "=",
            onplace: "&"
         },
         link: function($scope, elem, attrs, ngModel) {
            var input = elem[0], 
                  acOptions = angular.extend({}, defaults, $scope.options),
                  ac = new google.maps.places.Autocomplete(input, acOptions);
          
            google.maps.event.addListener(ac, "place_changed", function() {
               var placeRes = ac.getPlace();
               if(ngModel) {
                  // console.log("Setting address" + placeRes.formatted_address);
                  ngModel.$setViewValue(placeRes.formatted_address);
               }
               $scope.onplace({place: placeRes});
               $scope.$apply();
            });
         }
      };
   }]);
   
   
})(angular, window);