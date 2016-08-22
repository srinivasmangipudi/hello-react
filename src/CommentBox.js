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
  mixins: [ReactFireMixin],
  getInitialState: function() {
      return {author:'', text:''};
  },
  componentWillMount: function() {
    console.log("componentWillMount");

    var ref = firebase.database().ref("comments");
    this.bindAsArray(ref, "comments");
  },
  handleAuthorChange: function(e) {
    this.setState({author: e.target.value});
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if (!text || !author) {
      return;
    }

    this.firebaseRefs.comments.push({
      id: author, author:author, text:text
    })
    this.setState({id: "", author:"", text:""});
  },
  render: function() {
    return(
     <form className="commentForm" onSubmit={this.handleSubmit}>
        <input 
          type="text" 
          placeholder="Your name" 
          value={this.state.author}
          onChange={this.handleAuthorChange}
        />
        <input 
          type="text" 
          placeholder="Say something..." 
          value={this.state.text}
          onChange={this.handleTextChange}
        />
        <input type="submit" value="Post" />
      </form>
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