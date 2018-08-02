import React, {PureComponent} from 'react';
import {rtdb} from './database';

export class ComposeMessage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      comment: '',
    };
  }

  render() {
    return (
      <form className="compose-message">
        <div className="compose-message-container">
          <label className="compose-message-name" htmlFor="message-name">
            Name:
          </label>
          <input
            id="message-name"
            value={this.state.name}
            onChange={this.onNameChange}
            type="text"
          />
          <label
            className="compose-message-comment__label"
            htmlFor="message-comment"
          >
            Comment:
          </label>
          <input
            id="message-comment"
            value={this.state.comment}
            onChange={this.onCommentChange}
            type="text"
          />
          <input type="submit" onClick={this.onPost} value="Post" />
        </div>
      </form>
    );
  }

  onNameChange = (e) => {
    this.setState({name: e.target.value});
  };

  onCommentChange = (e) => {
    this.setState({comment: e.target.value});
  };

  componentDidMount() {
    this.doc = rtdb.get('/messages');
  }

  componentWillUnmount() {
    this.doc.close();
    this.doc = null;
  }

  onPost = (e) => {
    e.preventDefault();
    if (!this.state.name) {
      alert('Please enter a name');
      return false;
    }
    if (!this.state.comment) {
      alert('Please enter a comment');
      return false;
    }
    this.doc.push({name: this.state.name, comment: this.state.comment});
    this.setState({comment: ''});
    return false;
  };
}
