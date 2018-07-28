import {state} from './state';
import {NOT_SET} from './constants';
import {Component, PureComponent} from 'react';
import {dispose} from './view';

function reactiveRender() {
  // begin tracking accesses to state
  state.addPendingView(this._fireRender);

  try {
    const result = this._originalRender();
    return result;
  } catch (e) {
    if (e !== NOT_SET) {
      // values are not set yet, but the access should
      // have been added to the document's listener list already,
      // so it'll just react later.
      return null;
    } else {
      throw e;
    }
  } finally {
    state.removePendingView(this._fireRender);
  }
}

/**
 * Decorate a whole class as an observer of one or more documents
 * @param Class
 */
export function observer(Class) {
  // switch borrowed from mobx-react - wrap a functional component in a class
  // for lifecycle methods
  if (
    typeof Class === 'function' &&
    (!Class.prototype || !Class.prototype.render) &&
    !Class.isReactClass &&
    !Component.isPrototypeOf(Class)
  ) {
    const tmp = class extends PureComponent {
      static displayName = Class.displayName || Class.name;
      static contextTypes = Class.contextTypes;
      static propTypes = Class.propTypes;
      static defaultProps = Class.defaultProps;
      render() {
        return Class.call(this, this.props, this.context);
      }
    };
    return observer(tmp);
  }

  const originalRender = Class.prototype.render;

  // on unmount we'll remove the listeners from all documents
  Object.defineProperty(Class, 'componentWillUnmount', {
    value: function() {
      console.log('dispose');
      dispose(this._fireRender);
    },
    enumerable: false,
  });

  Class.prototype.render = function() {
    // The render function is called with the `this` value which
    // we can now use to bind to the class.
    // This is a bit easier than trying to replace the constructor.
    this._fireRender = () => {
      this.forceUpdate();
    };
    this._originalRender = originalRender;
    this.render = reactiveRender.bind(this);
    return this.render();
  };
  return Class;
}
