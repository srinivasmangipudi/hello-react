import React from 'react';
import './AwareCanvas.css';
import $ from 'jquery';
//var Remarkable = require('remarkable');
var firebase = require('firebase');
var ReactFireMixin = require('reactfire');
//var Menu = require('react-burger-menu').slide;


var canvas = document.getElementById('awareCanvas');
var drag = false;
var ref;

var AwareCanvas = React.createClass({
  mixins: [ReactFireMixin],
  showSettings: function(event) {
    event.preventDefault();
    console.log("-- show settings");
  },
  getInitialState: function() {
    console.log("init");
    return {
            isSelected: "false",
            awareUsersNow: 0
        };
  },
  componentWillMount: function() {
    console.log("componentWillMount");

    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyC9hyquwKLSLks3UYBkVxkf6mya2eNAV5w",
      authDomain: "project-2569167554904200855.firebaseapp.com",
      databaseURL: "https://project-2569167554904200855.firebaseio.com",
      storageBucket: "project-2569167554904200855.appspot.com",
    };

    firebase.initializeApp(config);
    ref = firebase.database().ref("awareUsersNow");
    
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

    firebase.auth().signInAnonymously().catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode + " : " + errorMessage);
    });

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        console.log(isAnonymous + " : " + uid);
      } else {
        // User is signed out.
        console.log("User is signed out.");
      }
      // ...
    });

    this.getAwareCount();
  },
  getAwareCount: function() {
    
    this.bindAsObject(ref, "awareUsersNow");
    var count = 0;
    var parent = this;
    ref.on('value', function(snapshot) {
        console.log("ref change detected--");
        console.log(snapshot["A"]["B"]);
        count = snapshot["A"]["B"];
        //parent.setState({awareUsersNow: count});
        parent.updateCanvas();
        //return count;
      }).bind(this);
    console.log(this.state);
  },
  componentDidMount: function() {
      this.updateCanvas();
      window.addEventListener("beforeunload", (ev) => 
      {   
          ev.preventDefault();
          this.updateCountOnClose();
          return ev.returnValue = 'Are you sure you want to close?';

      });
  },
  updateCountOnClose: function() {
    console.log("updateCountOnClose");
    if(isSelected === "true")
    {
      this.setState({isSelected: "false"}, () => {
        this.firebaseRefs.awareUsersNow.transaction(function (currentData) {
          return currentData - 1;
        });
        // //this.firebaseRefs.awareUsersNow.set(count-1);
        console.log(this.state);
        this.updateCanvas();
      });  
    }

  },
  componentWillUnmount: function() {
    console.log("componentWillUnmount called");
    this.updateCountOnClose();
    window.removeEventListener('onbeforeunload', this.handleWindowClose);
  },
  handleTouch: function(e) {
    console.log("--handleTouch");
    e.preventDefault();

    var count = this.readServer();
    console.log("start:"+ ist);

    this.setState({isSelected: "true"}, () => {

      this.firebaseRefs.awareUsersNow.transaction(function (currentData) {
        return currentData + 1;
      });
      //this.firebaseRefs.awareUsersNow.set(count+1);
      console.log(this.state);
      this.updateCanvas();
    });      
      
  },
  handleUntouch: function(e) {
    console.log("--handleUntouch");
    e.preventDefault();

    var count = this.readServer();
    console.log("start:"+ ist);

    this.setState({isSelected: "false"}, () => {
      this.firebaseRefs.awareUsersNow.transaction(function (currentData) {
        return currentData - 1;
      });
      //this.firebaseRefs.awareUsersNow.set(count-1);
      console.log(this.state);
      this.updateCanvas();
    });      
      
  },
  handleClick: function(e) {
    console.log("--handleClick");
    console.log($(window).width());
    e.preventDefault();
    var ist = this.state.isSelected;
    var count = this.readServer();
    this.setState({isSelected: ist});
    console.log("start:"+ ist);
    // console.log(this.firebaseRefs.valueOf());

    if(ist === "true"){
      console.log("1");
      this.setState({isSelected: "false"}, () => {
        console.log(this.state);
        this.updateCanvas();
      });      
      this.firebaseRefs.awareUsersNow.set(count-1);
    }
    else
    {
      console.log("2");
      this.setState({isSelected: "true"}, () => {
        console.log(this.state);
        this.updateCanvas();
      });
      this.firebaseRefs.awareUsersNow.set(count+1);
    }

    console.log("check:" + this.state.isSelected);
    //this.readServer();
    //this.updateCanvas();

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
      var count = this.readServer();
      var txtxt =  count + " people are touching";

      if(count === 1)
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
      var txtxt = "Be Touch Aware";
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
                  style={style} width={300} height={300}/>          
        </div>
      );
  }
});
//end -- aware canvas react component

/*
          <div id="outer-container">
            <div className="bm-burger-button">openmenu</div>
            // <Menu pageWrapId={ "page-wrap" } 
            //       outerContainerId={ "outer-container" } 
            //       width={280}/>
            <main id="page-wrap">
              <div className="awareCanvas">
                <canvas id="awareCanvas" ref="canvas" onClick={this.handleClick} 
                  style={style} width={300} height={300}/>          
              </div>
           </main>
          </div>

*/

function init() {
  canvas.addEventListener("touchstart", touchHandler, false);
  canvas.addEventListener("touchmove", touchHandler, false);
  canvas.addEventListener("touchend", touchHandler, false);
}

function touchHandler(event) {
  if (event.targetTouches.length == 1) { //one finger touche
    var touch = event.targetTouches[0];

    if (event.type == "touchstart") {
      alert('touchstart');
      // rect.startX = touch.pageX;
      // rect.startY = touch.pageY;
      drag = true;
    } else if (event.type == "touchmove") {
      alert('touchmove');
      if (drag) {
        // rect.w = touch.pageX - rect.startX;
        // rect.h = touch.pageY - rect.startY ;
        draw();
      }
    } else if (event.type == "touchend" || event.type == "touchcancel") {
      drag = false;
    }
  }
}
export default AwareCanvas;



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