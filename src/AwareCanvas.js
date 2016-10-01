import React from 'react';
import './AwareCanvas.css';
import $ from 'jquery';
import cookie from 'react-cookie';

//var Remarkable = require('remarkable');
var firebase = require('firebase/app');
require("firebase/auth");
require("firebase/database");
require("firebase/storage");

var ReactFireMixin = require('reactfire');
//var Menu = require('react-burger-menu').slide;


var canvas = document.getElementById('awareCanvas');
var drag = false;

var userIdSession = null;
var userRef = null;
var userObj = null;
var firebaseDbRef;
var awareUsersCountRef;
var awareUserListRef;

var AwareCanvas = React.createClass({
  mixins: [ReactFireMixin],
  showSettings: function(event) {
    event.preventDefault();
    console.log("-- show settings");
  },
  getInitialState: function() {
    //let userId = cookie.load('userId');
    console.log("userid:"+userIdSession);

    return {
            userId: userIdSession,
            isSelected: "false",
            awareUsersNow: 0,
            isLoggedIn: "false"
        };
  },
  componentWillMount: function() {
    console.log("componentWillMount");


  },
  loggedIn: function(user) {
    console.log("hey react!!");
    console.log(user);

    if (user) {
          userRef = this.firebaseRefs.awareUsersNow.child(user.uid);
          userObj = user;
          console.log("**userRef:" + userRef);

          // User is signed in.
          console.log("-- logged in");
          let isAnonymous = user.isAnonymous;
          let uid = user.uid;

          let date = Date.now().toString();

          console.log(isAnonymous + " -:- " + uid);
          console.log("date:" + date);
          // A post entry.
          let postData = {
            id: uid,
            // path: window.location.pathname,
             arrivedAt: date,
            // userAgent: navigator.userAgent
          };

          console.log("--herhe");
          // Get a key for a new Post.
          //var newUserKey = awareUserListRef.push().key;
          //console.log("--new userkey:" + newUserKey);
          // Write the new post's data simultaneously in the posts list and the user's post list.
          let updates = {};
          updates['/awareUsersList/' + uid] = postData;

          //save the user to the db
          firebase.database().ref().update(updates);

          //update state of this component
          this.setState({userId: user.uid, isLoggedIn: true});
          //userRef.onDisconnect().remove();
          this.firebaseRefs.awareUsersList.child(this.state.userId).onDisconnect().remove();
        } else {
          // User is signed out.
          console.log("User is signed out.");
          userObj = null;
          this.setState({isSelected: "false", isLoggedIn: false, userId: null}, () => {
            console.log(this.state);
            this.updateCanvas();
          }); 
        }
        // ...
  },
  componentDidMount: function() {
    console.log("componentDidMount");
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyC9hyquwKLSLks3UYBkVxkf6mya2eNAV5w",
      authDomain: "project-2569167554904200855.firebaseapp.com",
      databaseURL: "https://project-2569167554904200855.firebaseio.com",
      storageBucket: "project-2569167554904200855.appspot.com",
    };

    firebase.initializeApp(config);
    firebaseDbRef = firebase.database().ref();
    awareUsersCountRef = firebase.database().ref("awareUsersNow");
    this.bindAsObject(awareUsersCountRef, "awareUsersNow");

    awareUserListRef = firebaseDbRef.child("awareUsersList");
    this.bindAsArray(awareUserListRef, "awareUsersList");
    //console.log(awareUserListRef.toString());

    this.getAwareCount();
    this.updateCanvas();
    window.addEventListener("beforeunload", (ev) => 
    {   
      ev.preventDefault();
      this.updateCountOnClose();
      return ev.returnValue = 'Are you sure you want to close?';
    });

    //init();
  },
  getAwareCount: function() {
    var count = 0;
    var parent = this;
    
    awareUserListRef.on('value', snap => {
      var size=0;
      if(snap.val()) 
        {size = Object.keys(snap.val()).length;} 
      else {size=0};
      
      console.log("snap" + size);
      this.setState({awareUsersNow: size});
      this.updateCanvas();
      
    });
    console.log(this.state);
  },  
  // updateCountOnClose: function() {
  //   console.log("updateCountOnClose");
  //   if(isSelected === "true")
  //   {
  //     this.setState({isSelected: "false"}, () => {
  //       this.firebaseRefs.awareUsersNow.transaction(function (currentData) {
  //         return currentData - 1;
  //       });
  //       // //this.firebaseRefs.awareUsersNow.set(count-1);
  //       console.log(this.state);
  //       this.updateCanvas();
  //     });  
  //   }

  // },
  componentWillUnmount: function() {
    console.log("componentWillUnmount called");
    this.updateCountOnClose();
    window.removeEventListener('onbeforeunload', this.handleWindowClose);
  },
  handleClick: function(e) {
    console.log("--handleClick");
    console.log($(window).width());
    e.preventDefault();
    var ist = this.state.isSelected;
    //var count = this.readServer();
    //this.setState({isSelected: ist, isLoggedIn: false});
    console.log("start:"+ ist);
    // console.log(this.firebaseRefs.valueOf());

    //user already connected, wants to disconnect now
    if(ist === "true"){
      console.log("1");

      //this.firebaseRefs.awareUsersNow.set(this.state.awareUsersNow-1);
      // console.log("-- see if the user is logged in: " + this.state.userId);
       this.firebaseRefs.awareUsersList.child(this.state.userId).remove();
      // firebase.auth().signOut();
      

      this.setState({isSelected: "false"}, () => {
        console.log(this.state);
        this.updateCanvas();
      });      
    }
    //user is disconnected, wants to connect
    else
    {
      console.log("2");
      this.setState({isSelected: "true"}, () => {
        console.log(this.state);
        this.updateCanvas();
      });
      //this.firebaseRefs.awareUsersNow.set(this.state.awareUsersNow+1);

      //on click log anonymously and update states
      console.log(this.state.isLoggedIn);
      //let loggedIn = this.state.isLoggedIn;
      console.log(this.userObj);
      if(this.userObj === undefined)
      {
        console.log("start loggin in firebase anon");
        firebase.auth().signInAnonymously().catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log("--auth error");
          console.log(errorCode + " : " + errorMessage);
        });

        var self=this;
        firebase.auth().onAuthStateChanged(function(user) {
          console.log("--auth state changed");
          self.loggedIn(user);
        });              
      }
      else
      {
        this.loggedIn(this.userObj);
      }
    }

    console.log("check:" + this.state.isSelected);
    //this.readServer();
    //this.updateCanvas();

  },
  handleTouch: function(e) {
    //alert("--handleTouch");
    e.preventDefault();
    this.setState({isSelected: "true"}, () => {
        console.log(this.state);
        this.updateCanvas();
      });
      //this.firebaseRefs.awareUsersNow.set(this.state.awareUsersNow+1);

      //on click log anonymously and update states
      console.log(this.state.isLoggedIn);
      //let loggedIn = this.state.isLoggedIn;
      console.log(this.userObj);
      if(this.userObj === undefined)
      {
        console.log("start loggin in firebase anon");
        firebase.auth().signInAnonymously().catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log("--auth error");
          console.log(errorCode + " : " + errorMessage);
        });

        var self=this;
        firebase.auth().onAuthStateChanged(function(user) {
          console.log("--auth state changed");
          self.loggedIn(user);
        });              
      }
      else
      {
        this.loggedIn(this.userObj);
      }

    console.log("check:" + this.state.isSelected);  
  },
  handleUntouch: function(e) {
    //alert("--handleUnTouch");
    e.preventDefault();
    this.firebaseRefs.awareUsersList.child(this.state.userId).remove();

    this.setState({isSelected: "false"}, () => {
      console.log(this.state);
      this.updateCanvas();
    });     
  },
  readServer: function() {
    console.log("--readserver called - awareUsersNow:");
    var awareUsersNow = this.state.awareUsersNow;
    console.log(awareUsersNow);

    return awareUsersNow[".value"];
    
  },
  updateServer: function() {
    console.log("updateServer called");
  },
  updateCanvas: function() {
    console.log("--update canvas called");
    console.log("** total visitors count:" + "nothing");
    console.log(this.state);
    const ctx = this.refs.canvas.getContext('2d');
    ctx.textBaseline = 'middle';
    ctx.textAlign="middle";
    let isSelected = this.state.isSelected;
    var fillStyle = '#000000';

    console.log("isSelected:" + isSelected);
    if(isSelected === "true")
    {
      fillStyle = "#ff0000";
    }
 
    ctx.fillStyle = fillStyle;
    ctx.fillRect(0,0, 300, 300);

    if(isSelected === "true")
    {
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px Arial";
      //var count = this.readServer();
      var count = this.state.awareUsersNow;
      var txtxt =  count + " people are touching";

      if(count === 1 || count === 0)
      {
        txtxt = "You are the only one.";
      }else if(count === 2){
        txtxt = "Some else is touching.";
      }

      
      var textWidth = ctx.measureText(txtxt ).width;

      ctx.fillText(txtxt , (this.refs.canvas.width/2) - (textWidth / 2), 100);      
    }
    else{
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px Arial";
      var txtxt = "Touch Be Aware";
      var textWidth = ctx.measureText(txtxt ).width;

      ctx.fillText(txtxt , (this.refs.canvas.width/2) - (textWidth / 2), 100);
    }
  },
  render: function() {
    console.log("--render");
    var isSelected = this.state.isSelected;
    var style = {
            'backgroundColor': '#eee'
        };
        if (isSelected) {
            style = {
                'backgroundColor': '#ccc'
            };
        }
      return (
        <div className="awareCanvas">
                <canvas id="awareCanvas" ref="canvas" onClick={this.handleClick} 
                  onTouchStart={this.handleTouch} onTouchEnd={this.handleUntouch}
                  style={style} width={300} height={300}/>          
        </div>
      );
  }
});
//end -- aware canvas react component

// function init() {
//   canvas = document.getElementById('awareCanvas');
//   console.log(canvas);
//   canvas.addEventListener("touchstart", touchHandler, false);
//   canvas.addEventListener("touchmove", touchHandler, false);
//   canvas.addEventListener("touchend", touchHandler, false);
// }

// function touchHandler(event) {
//   if (event.targetTouches.length == 1) { //one finger touche
//     var touch = event.targetTouches[0];

//     if (event.type == "touchstart") {
//       AwareCanvas.handleTouch();
//       //alert('touchstart');
//       // rect.startX = touch.pageX;
//       // rect.startY = touch.pageY;
//       drag = true;
//     } else if (event.type == "touchmove") {
//       alert('touchmove');
//       if (drag) {
//         // rect.w = touch.pageX - rect.startX;
//         // rect.h = touch.pageY - rect.startY ;
//         draw();
//       }
//     } else if (event.type == "touchend" || event.type == "touchcancel") {
//       drag = false;
//     }
//   }
// }
export default AwareCanvas;


// handleTouch: function(e) {
//     console.log("--handleTouch");
//     e.preventDefault();

//     var count = this.readServer();
//     console.log("start:"+ ist);

//     this.setState({isSelected: "true"}, () => {

//       this.firebaseRefs.awareUsersNow.transaction(function (currentData) {
//         return currentData + 1;
//       });
//       //this.firebaseRefs.awareUsersNow.set(count+1);
//       console.log(this.state);
//       this.updateCanvas();
//     });      
      
//   },
//   handleUntouch: function(e) {
//     console.log("--handleUntouch");
//     e.preventDefault();

//     var count = this.readServer();
//     console.log("start:"+ ist);

//     this.setState({isSelected: "false"}, () => {
//       this.firebaseRefs.awareUsersNow.transaction(function (currentData) {
//         return currentData - 1;
//       });
//       //this.firebaseRefs.awareUsersNow.set(count-1);
//       console.log(this.state);
//       this.updateCanvas();
//     });      
      
//   },
    // firebase.initializeApp({
    //                         serviceAccount: {
    //                           projectId: "project-2569167554904200855",
    //                           authDomain: "project-2569167554904200855.firebaseapp.com",
    //                           clientEmail: "shrinimann@rproject-2569167554904200855.iam.gserviceaccount.com",
    //                           privateKey: "AIzaSyC9hyquwKLSLks3UYBkVxkf6mya2eNAV5w",
    //                           apiKey: "AIzaSyC9hyquwKLSLks3UYBkVxkf6mya2eNAV5w",
    //                           storageBucket: "project-2569167554904200855.appspot.com"
                        
    //                         databaseURL: "https://project-2569167554904200855.firebaseio.com"
    //                       });
  // getAwareCount: function() {
  //   var count = 0;
  //   var parent = this;
  //   awareUsersCountRef.on('value', function(snapshot) {
  //       console.log("awareUsersCountRef change detected--");
  //       console.log(snapshot["A"]["B"]);
  //       count = snapshot["A"]["B"];

  //       //parent.setState({awareUsersNow: count});
  //       parent.updateCanvas();
  //       //return count;
  //     }).bind(this);
  //   console.log(this.state);
  // },


    // try{
    //   firebase.auth().signInAnonymously();
    // }
    // catch(error) {
    //   // Handle Errors here.
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   console.log("Error logging anonymously:" + errorMessage);
    // };

    // firebase.auth.Auth.signInAnonymously().catch(function(error) {
    //   // Handle Errors here.
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   console.log("Error logging anonymously:" + errorMessage);
    // });

    // firebase.auth().onAuthStateChanged(function(user) {
    //   if (user) {
    //     // User is signed in.
    //     var isAnonymous = user.isAnonymous;
    //     var uid = user.uid;
    //     // ...
    //     console.log("Your anonymousid is:" + uid);
    //   } else {
    //     // User is signed out.
    //     // ...
    //     console.log("you are logged out");
    //   }
    //   // ...
    // });
    // var amOnline = firebase.database().ref('.info/connected');
    // amOnline.on('value', function(snapshot) {
    //   if (snapshot.val()) {
    //     userRef.onDisconnect().remove();
    //     userRef.set(true);
    //     console.log("connected firebase");
    //   }
    // });