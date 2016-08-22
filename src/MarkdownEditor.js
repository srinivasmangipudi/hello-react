import React from 'react';
import './MarkdownEditor.css';
var Remarkable = require('remarkable');

var MarkdownEditor = React.createClass({
  getInitialState: function() {
      // console.log("getInitialState");
      return { value: 'Type some *markdown* here!'};
  },
  handleChange: function(){
    // console.log("handleChange:" + this.refs.textarea.value);
    this.setState({value: this.refs.textarea.value});
  },
  rawMarkup: function() {
    // console.log("rawMarkup:" + this.state.value);
    var md = new Remarkable();
    // console.log({__html: md.render(this.state.value)});
    return {__html: md.render(this.state.value)};
  },
  render: function() {
    // console.log("render");
    return(
      <div className="MarkdownEditor">
        <h3>Input</h3>
        <textarea
          onChange={this.handleChange}
          ref="textarea"
          defaultValue={this.state.value}
        />
        <h3>Output</h3>
        <div 
          className="content" 
          dangerouslySetInnerHTML={this.rawMarkup()}
        />
        </div>

    );
  }
});

export default MarkdownEditor;