(function(angular, window, undefined) {
   var ui = angular.module("appui", []);
   
   ui.directive("appuiDatepicker", ["$filter", function($filter) {
      var dateFormats = {
         "mediumDate": "MMM D, YYYY",
         "shortDate": "M/D/YY",
         "longDate": "MMMM D, YYYY",
         "fullDate": "dddd, MMMM D, YYYY"
      };
      return {
         require: "ngModel",
         restrict: "AC",
         link: function($scope, elem, attrs, ngModel) {
            var input = elem[0];
            
            if(!dateFormats[attrs.format]) {
               console.log("Warning! Invalid date format " + attrs.format + ". Using 'mediumDate'");
               attrs.format = "mediumDate";
            }
            
            var cal = new Kalendae.Input(input, {
               months: attrs.months || 1,
               mode: attrs.mode || "single",
               format: dateFormats[attrs.format],
               direction: "today-future"
            });
            
            elem.on("blur", function() {
               cal.hide();
            });
            
            elem.on("click", function() {
               cal.show();
            });
            
            cal.subscribe("change", function() {
               var dt = cal.getSelectedAsDates()[0];
               ngModel.$setViewValue(dt.getTime());
               cal.hide();
               $scope.$apply();
            });
            
            ngModel.$formatters.unshift(function(date) {
               if(!date) {
                  return;
               }
               return $filter('date')(date, attrs.format);
            });
            
         }
      };
   }]);


   ui.directive("appuiFileupload", ["$http", function($http) {
      function createIFrame(name) {
         var frame = document.createElement("iframe");
         frame.src="";
         frame.name = name;
         frame.width = frame.height = 0;
         frame.border = frame.frameBorder = 0;
         return frame;
      }
      
      function submitFormXhr(form, $scope) {
         var formData = new FormData(form);
         
         $http({
            url: form.action,
            method: "post",
            headers: {
               "Content-Type": undefined //"multipart/form-data"
            },
            transformRequest: angular.identity, // this is important as we don't need 
                                                // any transformation of our request
            data: formData
         })
         .success(function(res) {
            $scope.onresponse({response: res});
         });
      }
      
      function submitFormHttp(form, elem, $scope) {
         var frame = createIFrame($scope.name || "iframe");
         elem.append(frame);
         form.target = frame.name;
         frame.onload = function() {
            var doc = frame.contentDocument || frame.contentWindow.document,
                  res = doc.documentElement.textContent || doc.documentElement.innerText;
            $scope.onresponse({response: res});
            $scope.$apply();
         };
         form.submit();
      }
         
      return {
         restrict: "AC",
         template: [
            '<form method="post" enctype="multipart/form-data">',
               '<span class="input-file">',
                  '<input accept="{{accept}}" name="file" class="file" type="file" />',
                  '<button class="primary">',
                     '<i class="fa fa-upload"></i> Browse..',
                  '</button>',
               '</span>',
           '</form>'
         ].join(""),
         scope: {
            onresponse: "&"
         },
         link: function($scope, elem, attrs) {
            var form = elem.find("form"), input = elem.find("input")[0];
            
            form = form[0];
            form.action = attrs.action;
            form.name = attrs.formName;
            
            input.onchange = function() {
               if(window.FormData) {
                  submitFormXhr(form, $scope);
               }else {
                  submitFormHttp(form, elem, $scope);
               }
            };
         }
      };
   }]);


   ui.directive("appuiNotifications", ["$rootScope", "$timeout", function($rootScope, $timeout) {
      return {
         restrict: "AC",
         template: [
            '<ul class="list messages">',
               '<li ng-click="dismiss($index)" class="message {{m.type}}" ng-repeat="m in messages">',
                  '<i class="fa {{m.icon}}"></i> <span ng-bind-html="m.content"></span>',
               '</li>',
            '</ul>'
         ].join(""),
         link: function($scope, elem, attrs) {
            var messageIcons = {
               info: "fa-info",
               success: "fa-check",
               warn: "fa-warning",
               error: "fa-exclamation"
            };
            var messages = $scope.messages = [];
            
            $scope.dismiss = function(i) {
               messages.splice(i, 1);
            };
            
            $rootScope.$on("appmessage", function(evt, msg) {
               msg.icon = messageIcons[msg.type];
               messages.push(msg);
               if(!msg.sticky) {
                  $timeout(function() {
                     for(var i = 0, len = messages.length; i < len; i++) {
                        if(messages[i] === msg) {
                           messages.splice(i, 1);
                        }
                     }
                  }, 4000);
               }
            });
         }
      };
   }]);
   ui.factory("Notification", ["$rootScope", "$timeout", function($rootScope, $timeout) {
      var Notification = {
         message: function(type, content, bSticky) {
            var msg = {
               type: type,
               content: content,
               sticky: bSticky
            };
            $rootScope.$emit("appmessage", msg);
         }
      };
      
      angular.forEach(["info", "success", "warn", "error"], function(type) {
         Notification[type] = function(msg, bSticky) {
            this.message(type, msg, bSticky);
         };
      });
      
      return Notification;
   }]);


   ui.directive("appuiVideo", ["$sce", function($sce) {
      function parseUrl(url) {
         // https://www.youtube.com/watch?v=tjR969Vp0Cw
         // https://youtube.com/watch?v=tjR969Vp0Cw
         // http://vimeo.com/90149475
         // http://youtu.be/tjR969Vp0Cw
         var match = /^(https?:\/\/)?w{0,3}\.?([^\/]+)\/(watch\?v=)?(.*)$/.exec(url);

         if(match) {
            // console.log(match[0] + ", " + match[1]);
            return {
               type: match[2],
               id: match[4]
            };
         }
         return null;
      }
      
      return {
         ristrict: "AC",
         template: [
            '<div class="video-wrapper">',
               '<iframe class="video" frameborder="0" ', 
                     'allowfullscreen src="{{src}}" width="{{width}}" height="{{height}}">',
               '</iframe>',
            '</div>'
         ].join(""),
         scope: {
            url: "@",
            width: "@",
            height: "@"
         },
         link: function($scope, elem, attrs) {
            var url = $scope.url;
            var urlInfo = parseUrl(url);
            if(!urlInfo) {
               elem.html("Video URL is not supported");
               return;
            }
            
            var iframe = elem.find("iframe")[0];
            if(!$scope.width) {
               iframe.style.width = "100%";
            }
            if(!$scope.height) {
               iframe.style.height = "100%";
            }
            
            switch(urlInfo.type) {
               case "youtube.com":
               case "youtu.be":
                  $scope.src = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + urlInfo.id);
                  break;
               case "vimeo.com":
                  $scope.src = $sce.trustAsResourceUrl("http://player.vimeo.com/video/" + urlInfo.id);
                  break;
               default:
                  break;
            }
         }
      };
      
   }]);


   ui.directive("appuiVmsg", ["$compile", function($compile) {
      function getOffsets(elem) {
         var top = elem.offsetTop , left = elem.offsetLeft, parent = elem.parentNode;
         while(parent) {
            top += (parent.offsetTop || 0);
            left += (parent.offsetLeft || 0);
            parent = parent.offsetParent;
         }
         return {
            top: top,
            left: left,
            width: elem.offsetWidth,
            height: elem.offsetHeight
         };
      }
      
      return {
         require: "^form",
         restrict: "AC",
         replace: true,
         template: [
            '<ul class="v-messages">',
               '<li class="msg" ng-repeat="msg in messages">{{msg}}</li>',
            '</ul>'
         ].join(""),
         scope: {},
         link: function($scope, elem, attrs, FormCtrl) {
            $scope.form = FormCtrl; // this is the key to do watches!
            $scope.messages = [];
            
            var fieldName = attrs.field;
            var watchKey = ["form", fieldName, "$error"].join(".");
            // console.log("watching " + watchKey);
            
            $scope.$watchCollection(watchKey, function($error) {
               var msgs = [];
               angular.forEach($error, function(val, key) {
                  // console.log(key + ".invalid : " + val);
                  // console.log(key + ".dirty: " + FormCtrl[fieldName].$dirty);
                  if(val && FormCtrl[fieldName].$dirty) {
                     msgs.push(attrs[key]);
                  }
               });
               $scope.messages = msgs;
            });
         }
      };
   }]);
   
})(angular, window);