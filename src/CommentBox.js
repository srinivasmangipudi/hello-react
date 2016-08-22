import React from 'react';
import './CommentBox.css';
var Remarkable = require('remarkable');
var firebase = require('firebase');
// var ReactFire = require('reactfire');
var ReactFireMixin = require('reactfire');



var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.comments.map(function(comment){
      return(
        <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>
      );
    });
    return(
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  render: function() {
    return(
      <div className="commentForm">
        Hello! I am a comment from
      </div>
    );
  }
});

var Comment = React.createClass({
  rawMarkup: function(){
    var md = new Remarkable();
    var markup = md.render(this.props.children.toString());
    return {__html: markup};
  },

  render: function() {  
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
          <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

var CommentBox = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
      return {comments: []};
  },
  componentWillMount: function() {
    console.log("componentWillMount");

    firebase.initializeApp({
                            serviceAccount: {
                              projectId: "reactcomments-96c9b",
                              clientEmail: "shrinimann@reactcomments-96c9b.iam.gserviceaccount.com",
                              privateKey: "AIzaSyChf6CTPdxFBajYUgAEOJ33pgAAcF4h_yc"
                            },
                            databaseURL: "https://reactcomments-96c9b.firebaseio.com/"
                          });
    var ref = firebase.database().ref("comments");
    this.bindAsArray(ref, "comments");
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList comments={this.state.comments} />
        <CommentForm />
      </div>
    );
  }
});
export default CommentBox;