import t from"firebase/compat/app";import"firebase/compat/auth";import"firebase/compat/database";import e,{Component as i,PureComponent as s}from"react";function o(t,e,i,s){return new(i||(i=Promise))((function(o,r){function n(t){try{h(s.next(t))}catch(t){r(t)}}function l(t){try{h(s.throw(t))}catch(t){r(t)}}function h(t){var e;t.done?o(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(n,l)}h((s=s.apply(t,e||[])).next())}))}const r={__error:"NOT_SET"};const n=new class{constructor(){this.pendingViews=new Set,this.addPendingView=t=>{this.pendingViews.add(t)},this.removePendingView=t=>{this.pendingViews.delete(t)}}};class l{constructor(t,e){this._onValueHandler=t=>{this._value=t.val(),this._resolveValues();for(let t of this._listeners)try{t()}catch(t){console.error(t)}},this._onErrorHandler=t=>{this._rejectValues(t)},this.onValues=()=>o(this,void 0,void 0,(function*(){return yield this._valuePromise,Object.assign({},this._value)})),this.set=t=>this._ref.set(t),this.push=t=>o(this,void 0,void 0,(function*(){const e=yield this._ref.push(t);return new l(e)})),this.update=t=>this._ref.update(t),this.remove=()=>this._ref.remove(),this.onDisconnect=()=>this._ref.onDisconnect(),this.close=()=>{this._ref&&this._ref.off("value")},this._ref=e?t.fdb.ref(e):t,this._value=r,this._listeners=new Set,this._valuePromise=new Promise(((t,e)=>{this._resolveValues=t,this._rejectValues=e})),this._ref.on("value",this._onValueHandler,this._onErrorHandler)}get key(){return this._ref.key}get value(){if(n.pendingViews.forEach((t=>{this._listeners.add(t);let e=t._documents;void 0===e&&(e=t._documents=new Set),e.add(this)})),this._value===r)throw r;return this._value}get path(){return this._ref.toString().substring(this._ref.root.toString().length-1)}}class h{constructor(e){var{persistence:i}=e,s=function(t,e){var i={};for(var s in t)Object.prototype.hasOwnProperty.call(t,s)&&e.indexOf(s)<0&&(i[s]=t[s]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(s=Object.getOwnPropertySymbols(t);o<s.length;o++)e.indexOf(s[o])<0&&Object.prototype.propertyIsEnumerable.call(t,s[o])&&(i[s[o]]=t[s[o]])}return i}(e,["persistence"]);this.TIMESTAMP=t.database.ServerValue.TIMESTAMP,this.get=t=>new l(this,t),this.signInWithCustomToken=e=>o(this,void 0,void 0,(function*(){return yield t.auth().setPersistence(this.authPersistence),t.auth().signInWithCustomToken(e)})),this.goOffline=()=>this.fdb.goOffline(),this.goOnline=()=>this.fdb.goOnline(),this.authPersistence=i||t.auth.Auth.Persistence.NONE,t.initializeApp(s),this.fdb=t.database()}static signOut(){return t.auth().signOut()}}function c(t){const e=t._documents;if(e)for(let i of e)i._listeners.delete(t),0===i._listeners.size&&i.close()}function a(t){n.addPendingView(t);try{t()}catch(t){if(t!==r)throw t}finally{n.removePendingView(t)}return function(t){return()=>{c(t)}}(t)}function u(){n.addPendingView(this._fireRender);try{return this._originalRender()}catch(t){if(t!==r)return null;throw t}finally{n.removePendingView(this._fireRender)}}function d(t){var e;if(!("function"!=typeof t||t.prototype&&t.prototype.render||t.isReactClass||i.isPrototypeOf(t))){return d(((e=class extends s{render(){return t.call(this,this.props,this.context)}}).displayName=t.displayName||t.name,e.contextTypes=t.contextTypes,e.propTypes=t.propTypes,e.defaultProps=t.defaultProps,e))}const o=t.prototype.render;return Object.defineProperty(t,"componentWillUnmount",{value:function(){c(this._fireRender)},enumerable:!1}),t.prototype.render=function(){return this._fireRender=()=>{this.forceUpdate()},this._originalRender=o,this.render=u.bind(this),this.render()},t}const f=(t={})=>i=>{class o extends s{constructor(e){super(e),this.collection=[],this.runQuery=()=>{this.query&&this.query.off(),this.collection=[];const e=Object.assign(Object.assign({},this.props),t),i=e.database,r=e.path;if(!r)throw new Error("Collection requires a 'path' option.");if(!i)throw new Error("Collection requires a 'database' option.");let n=i.get(r)._ref;o.displayName=`collection-observer-${n.toString()}`,e.orderByKey&&(n=n.orderByKey()),e.orderByValue&&(n=n.orderByValue()),e.orderByChild&&(n=n.orderByChild(e.orderByChild)),e.limitToLast&&(n=n.limitToLast(e.limitToLast)),e.limitToFirst&&(n=n.limitToFirst(s)),this.query=n,this.mounted&&this.listenToQuery()},this.listenToQuery=()=>{this.query.on("child_added",this.onChildAdded,this.onQueryError),this.query.on("child_changed",this.onChildChanged,this.onQueryError),this.query.on("child_removed",this.onChildRemoved,this.onQueryError),this.query.on("child_moved",this.onChildMoved,this.onQueryError)},this.onQueryError=t=>{this.setState({error:t})},this.onChildAdded=(t,e)=>{const i={key:t.key,value:t.val()};let s=!1;if(e)for(let t=0;t<this.collection.length-1;t++){this.collection[t].key===e&&(s=!0,this.collection.splice(t+1,0,i))}s||this.collection.push(i),this.mounted&&this.forceUpdate()},this.onChildChanged=t=>{for(let e=0;e<this.collection.length;e++){const i=this.collection[e];if(i&&t.key===i.key)return i.value=t.val(),void(this.mounted&&this.forceUpdate())}},this.onChildRemoved=t=>{for(let e=0;e<this.collection.length;e++){const i=this.collection[e];if(i&&t.key===i.key)return this.collection.splice(e,1),void(this.mounted&&this.forceUpdate())}},this.onChildMoved=(t,e)=>{const i=[];let s={key:t.key,value:t.val()};for(let o of this.collection)o.key!==t.key&&(i.push(o),o.key===e&&(i.push(s),s=null));s&&i.push(s),this.collection=i},this.onScroll=()=>{const e=t.limitToLast||this.props.limitToLast,i=t.limitToFirst||this.props.limitToFirst;e?t.limitToLast=e+this.limit:i&&(t.limitToFirst=i+this.limit),this.runQuery()},this.setLimitToLast=e=>{t.limitToLast=e,this.runQuery()},this.setLimitToFirst=e=>{t.limitToFirst=e,this.runQuery()},this.state={error:null},this.runQuery();const i=t.limitToLast||this.props.limitToLast,s=t.limitToFirst||this.props.limitToFirst;this.limit=i||s||50}componentDidMount(){this.mounted=!0,this.listenToQuery()}componentWillUnmount(){this.mounted=!1,this.query.off()}render(){const t=Object.assign({},this.props,{collection:this.collection.slice(),scrollCollection:this.onScroll,setLimitToLast:this.setLimitToLast,setLimitToFirst:this.setLimitToFirst,collectionError:this.state.error});return e.createElement(i,t)}}return o.displayName="collection-observer-",o};export{h as RTDatabase,f as collectionObserver,d as observer,a as view};
//# sourceMappingURL=firebase-react-store.js.map