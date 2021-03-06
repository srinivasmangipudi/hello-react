import React from 'react';
import './TodoList.css';

var TodoList = React.createClass ({
  render: function() {
    var createItem = function(item) {
      return <li key={item.id}> {item.text} </li>;
    };

    return <ul> {this.props.items.map(createItem)}</ul>;
  }
});

var TodoApp = React.createClass ({
  getInitialState: function() {
      return {
          items: [],
          text: ''  
      };
  },
  onChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e){
    e.preventDefault();
    var nextItems = this.state.items.concat([{text: this.state.text, id: Date.now()}]);
    var nextText = '';
    this.setState({items: nextItems, text: nextText});
  },
  render: function() {
    return(
      <div className="TodoList shadow">
        <h3>TODOs</h3>
        <TodoList items={this.state.items} />
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.onChange} value={this.state.text} />
          <button> {'Add #' + (this.state.items.length + 1)} </button>
        </form>
      </div>
    );
  }
});

export default TodoApp;