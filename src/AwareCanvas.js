import React from 'react';
import './AwareCanvas.css';
var Remarkable = require('remarkable');
var firebase = require('firebase');
var ReactFireMixin = require('reactfire');

var AwareCanvas = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    console.log("init");
    return {
            isSelected: "false",
            awareUsersNow: 0
        };
  },
  componentWillMount: function() {
    console.log("componentWillMount");
    firebase.initializeApp({
                            serviceAccount: {
                              projectId: "project-2569167554904200855",
                              clientEmail: "shrinimann@rproject-2569167554904200855.iam.gserviceaccount.com",
                              privateKey: "AIzaSyC9hyquwKLSLks3UYBkVxkf6mya2eNAV5w"
                            },
                            databaseURL: "https://project-2569167554904200855.firebaseio.com"
                          });
    this.getAwareCount();
  },
  getAwareCount: function() {
    var ref = firebase.database().ref("awareUsersNow");
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
  },
  handleClick: function(e) {
    console.log("--handleClick");
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
      var txtxt = this.readServer() + " people are touching";
      var textWidth = ctx.measureText(txtxt ).width;

      ctx.fillText(txtxt , (this.refs.canvas.width/2) - (textWidth / 2), 100);      
    }
    else{
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px Arial";
      var txtxt = "Touch to be Aware";
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
          <canvas ref="canvas" onClick={this.handleClick} style={style} width={300} height={300}/>
        </div>
      );
  }
});

export default AwareCanvas;