"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=require("firebase/compat/app");require("firebase/compat/auth"),require("firebase/compat/database");var e=require("react");function i(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var s=i(t),r=i(e);function o(t,e,i,s){return new(i||(i=Promise))((function(r,o){function n(t){try{h(s.next(t))}catch(t){o(t)}}function l(t){try{h(s.throw(t))}catch(t){o(t)}}function h(t){var e;t.done?r(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(n,l)}h((s=s.apply(t,e||[])).next())}))}const n={__error:"NOT_SET"};const l=new class{constructor(){this.pendingViews=new Set,this.addPendingView=t=>{this.pendingViews.add(t)},this.removePendingView=t=>{this.pendingViews.delete(t)}}};class h{constructor(t,e){this._onValueHandler=t=>{this._value=t.val(),this._resolveValues();for(let t of this._listeners)try{t()}catch(t){console.error(t)}},this._onErrorHandler=t=>{this._rejectValues(t)},this.onValues=()=>o(this,void 0,void 0,(function*(){return yield this._valuePromise,Object.assign({},this._value)})),this.set=t=>this._ref.set(t),this.push=t=>o(this,void 0,void 0,(function*(){const e=yield this._ref.push(t);return new h(e)})),this.update=t=>this._ref.update(t),this.remove=()=>this._ref.remove(),this.onDisconnect=()=>this._ref.onDisconnect(),this.close=()=>{this._ref&&this._ref.off("value")},this._ref=e?t.fdb.ref(e):t,this._value=n,this._listeners=new Set,this._valuePromise=new Promise(((t,e)=>{this._resolveValues=t,this._rejectValues=e})),this._ref.on("value",this._onValueHandler,this._onErrorHandler)}get key(){return this._ref.key}get value(){if(l.pendingViews.forEach((t=>{this._listeners.add(t);let e=t._documents;void 0===e&&(e=t._documents=new Set),e.add(this)})),this._value===n)throw n;return this._value}get path(){return this._ref.toString().substring(this._ref.root.toString().length-1)}}function a(t){const e=t._documents;if(e)for(let i of e)i._listeners.delete(t),0===i._listeners.size&&i.close()}function u(){l.addPendingView(this._fireRender);try{return this._originalRender()}catch(t){if(t!==n)return null;throw t}finally{l.removePendingView(this._fireRender)}}exports.RTDatabase=class{constructor(t){var{persistence:e}=t,i=function(t,e){var i={};for(var s in t)Object.prototype.hasOwnProperty.call(t,s)&&e.indexOf(s)<0&&(i[s]=t[s]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(s=Object.getOwnPropertySymbols(t);r<s.length;r++)e.indexOf(s[r])<0&&Object.prototype.propertyIsEnumerable.call(t,s[r])&&(i[s[r]]=t[s[r]])}return i}(t,["persistence"]);this.TIMESTAMP=s.default.database.ServerValue.TIMESTAMP,this.get=t=>new h(this,t),this.signInWithCustomToken=t=>o(this,void 0,void 0,(function*(){return yield s.default.auth().setPersistence(this.authPersistence),s.default.auth().signInWithCustomToken(t)})),this.goOffline=()=>this.fdb.goOffline(),this.goOnline=()=>this.fdb.goOnline(),this.authPersistence=e||s.default.auth.Auth.Persistence.NONE,s.default.initializeApp(i),this.fdb=s.default.database()}static signOut(){return s.default.auth().signOut()}},exports.collectionObserver=(t={})=>i=>{class s extends e.PureComponent{constructor(e){super(e),this.collection=[],this.runQuery=()=>{this.query&&this.query.off(),this.collection=[];const e=Object.assign(Object.assign({},this.props),t),i=e.database,o=e.path;if(!o)throw new Error("Collection requires a 'path' option.");if(!i)throw new Error("Collection requires a 'database' option.");let n=i.get(o)._ref;s.displayName=`collection-observer-${n.toString()}`,e.orderByKey&&(n=n.orderByKey()),e.orderByValue&&(n=n.orderByValue()),e.orderByChild&&(n=n.orderByChild(e.orderByChild)),e.limitToLast&&(n=n.limitToLast(e.limitToLast)),e.limitToFirst&&(n=n.limitToFirst(r)),this.query=n,this.mounted&&this.listenToQuery()},this.listenToQuery=()=>{this.query.on("child_added",this.onChildAdded,this.onQueryError),this.query.on("child_changed",this.onChildChanged,this.onQueryError),this.query.on("child_removed",this.onChildRemoved,this.onQueryError),this.query.on("child_moved",this.onChildMoved,this.onQueryError)},this.onQueryError=t=>{this.setState({error:t})},this.onChildAdded=(t,e)=>{const i={key:t.key,value:t.val()};let s=!1;if(e)for(let t=0;t<this.collection.length-1;t++){this.collection[t].key===e&&(s=!0,this.collection.splice(t+1,0,i))}s||this.collection.push(i),this.mounted&&this.forceUpdate()},this.onChildChanged=t=>{for(let e=0;e<this.collection.length;e++){const i=this.collection[e];if(i&&t.key===i.key)return i.value=t.val(),void(this.mounted&&this.forceUpdate())}},this.onChildRemoved=t=>{for(let e=0;e<this.collection.length;e++){const i=this.collection[e];if(i&&t.key===i.key)return this.collection.splice(e,1),void(this.mounted&&this.forceUpdate())}},this.onChildMoved=(t,e)=>{const i=[];let s={key:t.key,value:t.val()};for(let r of this.collection)r.key!==t.key&&(i.push(r),r.key===e&&(i.push(s),s=null));s&&i.push(s),this.collection=i},this.onScroll=()=>{const e=t.limitToLast||this.props.limitToLast,i=t.limitToFirst||this.props.limitToFirst;e?t.limitToLast=e+this.limit:i&&(t.limitToFirst=i+this.limit),this.runQuery()},this.setLimitToLast=e=>{t.limitToLast=e,this.runQuery()},this.setLimitToFirst=e=>{t.limitToFirst=e,this.runQuery()},this.state={error:null},this.runQuery();const i=t.limitToLast||this.props.limitToLast,r=t.limitToFirst||this.props.limitToFirst;this.limit=i||r||50}componentDidMount(){this.mounted=!0,this.listenToQuery()}componentWillUnmount(){this.mounted=!1,this.query.off()}render(){const t=Object.assign({},this.props,{collection:this.collection.slice(),scrollCollection:this.onScroll,setLimitToLast:this.setLimitToLast,setLimitToFirst:this.setLimitToFirst,collectionError:this.state.error});return r.default.createElement(i,t)}}return s.displayName="collection-observer-",s},exports.observer=function t(i){var s;if(!("function"!=typeof i||i.prototype&&i.prototype.render||i.isReactClass||e.Component.isPrototypeOf(i))){return t(((s=class extends e.PureComponent{render(){return i.call(this,this.props,this.context)}}).displayName=i.displayName||i.name,s.contextTypes=i.contextTypes,s.propTypes=i.propTypes,s.defaultProps=i.defaultProps,s))}const r=i.prototype.render;return Object.defineProperty(i,"componentWillUnmount",{value:function(){a(this._fireRender)},enumerable:!1}),i.prototype.render=function(){return this._fireRender=()=>{this.forceUpdate()},this._originalRender=r,this.render=u.bind(this),this.render()},i},exports.view=function(t){l.addPendingView(t);try{t()}catch(t){if(t!==n)throw t}finally{l.removePendingView(t)}return function(t){return()=>{a(t)}}(t)};
//# sourceMappingURL=firebase-react-store.cjs.js.map