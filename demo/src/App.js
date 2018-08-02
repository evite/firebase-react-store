import React, {Component} from 'react';
import {MessageList} from './MessageList';
import './App.css';
import {ComposeMessage} from './ComposeMessage';

export class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Chat Demo</h1>
        </header>
        <div className="app-area">
          <MessageList />
          <ComposeMessage />
        </div>
      </div>
    );
  }
}
