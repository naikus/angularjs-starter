(function(angular, window) {
   angular.module("session", [])
   
         .value("Storage", window.store)
 
         .factory("Session", ["Storage", function(Storage) {
            var currUserKey = "currentuser", currentUser = null;
               
            return {
               init: function(uData) {
                  var uname = uData.userEmail, 
                  userData = Storage.get(uname);
                  if(userData) {
                     userData = angular.extend(userData, uData);
                  }else {
                     userData = uData;
                  }
                  currentUser = userData;
                  Storage.set(uname, userData);
                  Storage.set(currUserKey, uname);
               },
               
               invalidate: function() {
                  var uname = Storage.get(currUserKey);
                  Storage.remove(currUserKey);
                  if(currentUser) {
                     currentUser.userToken = null;
                     Storage.set(uname, currentUser);
                     currentUser = null;
                  }
               },
               
               getCurrentUser: function() {
                  var user;
                  if(!currentUser) {
                     var uname = Storage.get(currUserKey);
                     if(uname) {
                        currentUser = user = Storage.get(uname);
                     }
                  }else {
                     user = currentUser;
                  }
                  // console.log(user);
                  return user;
               }
            };
         }]);
})(angular, window);