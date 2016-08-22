import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Timer from './Timer';
import TodoList from './TodoList';
import MarkdownEditor from './MarkdownEditor';
import CommentBox from './CommentBox';

import './index.css';

// var data=[
//   {id: 1, author:"sriniman", text:"lovely lovely lovely "},
//   {id: 2, author:"niniwoman", text:"lonely *lonely* lonely"}
// ];

ReactDOM.render(
  <App />, document.getElementById('root')
);

ReactDOM.render(
  <Timer />, document.getElementById('timer')
);

ReactDOM.render(
  <TodoList />, document.getElementById('todolist')
);

ReactDOM.render(
  <MarkdownEditor />, document.getElementById('markdowneditor')
);

ReactDOM.render(
  <CommentBox url="/api/comments"/>, document.getElementById('commentbox')
);