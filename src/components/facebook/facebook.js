// Requires inclusion of script in html
// <script src="//connect.facebook.net/en_US/all.js"></script>
(function(angular, window, undefined) {
   var fb = angular.module("facebook", []);
   
   fb.provider("FB", [function() {
      var defaults = {
         appId: null,
         status: false,
         cookie: false,
         xfbml: true
      },
      self = this,
      settings = {};
      
      function loadScript(src, id, callback) {
         var body = document.body, s = doc.createElement("script");
         if(id) {
            s.id = "" + id;
         }
         if(callback)  {
            if("onreadystatechange" in s) {
               s.onreadystatechange = readyStateHandler(callback);
            }else {
               s.onload = readyStateHandler(callback);
            }
         }
         s.src = src;
         s.async = 1;
         body.appendChild(s);
      }
      
      function readyStateHandler(callback) {
         return function() {
            if(this.readyState === "loaded" || this.readyState === "complete") {
               callback();
            }
         };
      }
      
      
      this.settings = function(s) {
         settings = angular.extend({}, defaults, s);
      };
      
      
      /*
      this.$get = ["$q", "$window", "$log", function($q, $window, $log) {
         var defered = $q.defer(), proto = $window.location.protocol, FBService = {};
         
         if(proto === "file:") {
            proto = "https:";
         }
         
         loadScript(proto + "//connect.facebook.net/en_US/all.js", "facebook-jssdk");
         
         $window.fbAsyncInit = function() {
            FB.init(settings);
            defered.resolve(FB);
         };
      }];
      */


      this.$get = ["$window", function($window) {
         $window.FB.init(settings);
         return $window.FB;
      }];
   
   }]);

})(angular, window);