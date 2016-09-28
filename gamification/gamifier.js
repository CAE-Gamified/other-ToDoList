  var memberId,
  gameId = 'test',
  epURL = 'http://gaudi.informatik.rwth-aachen.de:8081/',
  iwcGamification;

  var useAuthentication = function(rurl){
    if(rurl.indexOf("\?") > 0){
      rurl += "&access_token=" + window.localStorage["access_token"];
    } else {
      rurl += "?access_token=" + window.localStorage["access_token"];
    }
    return rurl;
  }

  var Gamifier = {
    triggerAction : function(actionId){
      console.log("Action triggered : " + actionId);
      $.post(
       useAuthentication(epURL + 'visualization/actions/' + gameId + '/' + actionId + '/' + memberId),
       ''
       ).done(function(data) {
         console.log('Trigger success : ' + actionId);
         console.log(data);
         if (data.length > 0){
             sendOpenNotificationIntent(JSON.stringify(data));
         }
         sendRefreshTabIntent();
       })
       .fail(function() {
         alert( "Trigger failed " + actionId );
       });
    }
  };

  var advice = function(actionId) {
    Gamifier.triggerAction(actionId);
  };


  var initGamification = function() {
          $.aop.after({
        target: window,
        method: 'SentMessage'
      }, function() {
        advice('action1');
      });
      $.aop.after({
        target: window,
        method: 'ShowData'
      }, function() {
        advice('action2');
      });
      $.aop.after({
        target: window,
        method: 'DeleteMessage'
      }, function() {
        advice('action3');
      });

    iwcGamification = new iwc.Client();
    iwcGamification.connect(
      function(intent) {
        // define your reactions on incoming iwc events here

        if(intent.action == "FETCH_APPID") {
          sendRefreshGameIdIntent();
        }

    });
    sendRefreshGameIdIntent();
  };

  function sendRefreshTabIntent(){
    var intent = {
      "component": "",
      "data": "",
      "dataType": "text/xml",
      "action": "REFRESH_TAB",
      "categories": ["", ""],
      "flags": [void 0],
      "extras": {}
    };
    iwcGamification.publish(intent);
  }

  function sendRefreshGameIdIntent(){
    var data = gameId;
    var intent = {
      "component": "",
      "data": data,
      "dataType": "text/xml",
      "action": "REFRESH_APPID",
      "categories": ["", ""],
      "flags": [void 0],
      "extras": {}
    };
    iwcGamification.publish(intent);
  }

  function sendOpenNotificationIntent(data){
	    var intent = {
	      "component": "",
	      "data": data,
	      "dataType": "text/xml",
	      "action": "OPEN_NOTIFICATION",
	      "categories": ["", ""],
	      "flags": [void 0],
	      "extras": {}
	    };
	    iwcGamification.publish(intent);
  }
  function signInCallback(result) {
    if (result === 'success') {
      memberId = oidc_userinfo.preferred_username;
      console.log(oidc_userinfo);
      console.log('Logged in!');
      initGamification();
    } else {
      console.log(result);
      console.log(window.localStorage['access_token']);
      alert("Failed to log in using Open ID connect. Cannot use gamification feature.");
    }
  }

  $(document).ready(function() {
  });
