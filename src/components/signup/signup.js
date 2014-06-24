(function(angular, window, undefined) {
   var signup = angular.module("signup", ["api", "facebook"]);
   
   signup.config(["$routeProvider", function($routeProvider) {
      $routeProvider.when("/signup", {
         templateUrl: "components/signup/signup.html"
      });
   }]);

   // configure facebook provider (name sould be provide service + "Provider"
   signup.config(["FBProvider", function(FBProvider) {
      FBProvider.settings({
         appId: "<Your App ID>"
      });
   }]);


   signup.controller("SignIn", ["$scope", "$location", "Api", function($scope, $location, Api) {
      $scope.user = {};
      
      $scope.signIn = function() {
         var user = $scope.user, uname = user.userEmail, pass = user.password;
         var req = Api.signIn(uname, pass);
         
         req.success(function(res) {
            $location.path("/dashboard");
         });
      };
   }]);


   signup.controller("SignUp", ["$scope", "$location", "Api", function($scope, $location, Api) {
      $scope.user = {};
      $scope.data = {};
      
      $scope.signUp = function() {
         var user = $scope.user;
         
         delete user.tmp;
         var req = Api.signUp(user);
         
         req.success(function(res) {
            $location.path("/dashboard");
         });
      };
      
   }]);


   signup.controller("FBSignUp", ["$scope", "$location", "Api", "FB", function($scope, $location, Api, FB) {
         
      function handleLogin(res) {
         // console.log(res);
         if(res.authResponse) {
            doAppLogin(res);
         }else {
            // TODO: Use app level messages!
            alert("User did not authorize");
         }
      }
      
      function doAppLogin(auth) {
         // console.log(auth);
         FB.api("/me", function(res) {
            // console.log(res);
            var userData = {
               facebookID: auth.authResponse.userID,
               facebookToken: auth.authResponse.accessToken,
               
               userFirstName: res.first_name,
               userLastName: res.last_name,
               userEmail: res.email
            };
            
            // check user's image
            FB.api("/me/picture?type=normal", function(picRes) {
               // console.log(picRes);
               userData.userImageUrl = picRes.url;
               
               Api.facebookSignIn(userData).success(function(appRes) {
                  $location.path("/dashboard");
               });
            });
         });
      }
         
      $scope.fbSignIn = function() {
         FB.getLoginStatus(function(res) {
            // console.log(res);
            if(res.status === "connected") {
               doAppLogin(res);
            }else {
               FB.login(handleLogin, {scope: "email,user_location"});
            }
         });
      };
      
   }]);

})(angular, window);
