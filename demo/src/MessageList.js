import React, {PureComponent} from 'react';
import {collectionObserver} from 'firebase-react-store';
import {rtdb} from './database';
import {Message} from './Message';

class MessageList extends PureComponent {
  render() {
    const messages = this.props.collection.map((v) => (
      <Message key={v.key} message={v} />
    ));

    return <div className="message-list-container">{messages}</div>;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const container = document.querySelector('.message-list-container');
    if (container) container.scrollTo(0, container.clientHeight);
  }
}

// create-app doesn't support decorators and that makes me sad
MessageList = collectionObserver({
  database: rtdb,
  path: '/messages',
})(MessageList);
export {MessageList};
