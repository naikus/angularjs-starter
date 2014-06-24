(function(angular, window, undefined) {
   var api = angular.module("api", ["session"]);
   
   // Define aour Api service that does all the backend communication
   api.factory("Api", ["$q", "$http", "$log", "Session", 
         function($q, $http, $log, Session) {
      
      var defaults = {
         baseUrl: "/api",
         method: "GET",
         headers: {
            "Content-Type": "application/json" 
         },
         cache: false
      }, 
      posErrors = [
         "Unknown",
         "Permission to obtain position was denied",
         "Position is not available at this time",
         "Timed out while getting position"
      ],
      
      authToken,
      lat = 0, lng = 0;
      
      
      if("geolocation" in window.navigator) {
         window.navigator.geolocation.watchPosition(
            function(pos) {
               var coords = pos.coords;
               lat = coords.latitude;
               lng = coords.longitude;
            },
            function(error) {
               $log.error(error.message || posErrors[error.code]);
            },
            {
               enableHighAccuracy: false,
               timeout: 20000,
               maximumAge: 90000
            }
         );
      }else {
         // TODO: generate application event
         $log.warn("Geolocation is not available");
      }


      function apiCall(opts) {
         var options = angular.extend({}, defaults, opts), 
               apiUrl = options.baseUrl + options.url;
       
         if(options.data) {
            options.data.coordinates = lat + "," + lng;
         }
         
         // don't use auth token if explicitly requested not to (for signup and login)
         if(options.useToken !== false) {
            options.headers["Auth"] = authToken;
            options.headers["Geo-Position"] = lat + ";" + lng;
         }

         var req = $http({
            method: options.method,
            url: apiUrl,
            headers: options.headers,
            params: options.params,
            data: options.data
         });
         return req;
      }

      
      function loginSuccess(uData, token) {
         // save the token for further use
         authToken = token;
         
         uData.userToken = token;
         Session.init(uData);
      } 

      var Api = {
         getToken: function() {
            return authToken;
         },
         
         /**
          * A generic api call. Takes various options and returns a promise that is the same returned by
          * $http service
          * Following options are taken:
          * {
          *    baseUrl: <optional>,
          *    method: <any of the http methods>,
          *    headers: <any headers as an object>,
          *    params: <any url parameters>,
          *    data: <any post/put data>,
          *    useToken: true|false
          * }
          * @param {type} opts
          * @returns {Promise}
          */
         call: apiCall
         
         // add your API specific functions here...
      };
      
      return Api;

   }]);

})(angular, window);
