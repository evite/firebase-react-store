import {state} from './state';
import {NOT_SET} from './constants';
import {Component, ComponentClass, FunctionComponent, PureComponent} from 'react';
import {dispose} from './view';

type VoidFunction = () => void;
type AnyFunction = () => any;

function reactiveRender(fireRender: VoidFunction, originalRender: AnyFunction) {
  state.addPendingView(fireRender);

  try {
    return originalRender();
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
    state.removePendingView(fireRender);
  }
}

/**
 * Decorate a whole class as an observer of one or more documents
 * @param Class
 */
export function observer(Class: FunctionComponent | ComponentClass): any {
  if (
  typeof Class === 'function' &&
    (!Class.prototype || !Class.prototype.render) &&
    // @ts-ignore
    !Class.isReactClass &&
    !Component.isPrototypeOf(Class)
  ) {
    const tmp = class extends PureComponent {
      static displayName = Class.displayName || Class.name;
      static contextTypes = Class.contextTypes;
      static propTypes = Class.propTypes;
      static defaultProps = Class.defaultProps;
      render() {
        return (Class as FunctionComponent).call(this, this.props, this.context);
      }
    };
    return observer(tmp);
  }

  const originalRender = Class.prototype.render;

  // on unmount we'll remove the listeners from all documents
  Object.defineProperty(Class, 'componentWillUnmount', {
    value: function() {
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
    return reactiveRender(this._fireRender, this._originalRender).bind(this);
  };
  return Class;
}
