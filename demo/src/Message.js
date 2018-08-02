import React, {PureComponent} from 'react';

export class Message extends PureComponent {
  render() {
    const message = this.props.message.value;

    return (
      <div className="message">
        <div className="message-name">
          <div className="message-name-letter">
            {message.name.trim()[0].toUpperCase()}
          </div>
        </div>
        <p className="message-comment">{message.comment}</p>
      </div>
    );
  }
}
