import React, { Component } from 'react';
import CodeMirror from 'codemirror';
import io from 'socket.io-client';
import OtClient from './OtClient';

const ot = window.ot;
const socket = io.connect('http://0.0.0.0:8081');


class App extends Component {
  constructor () {
    super();
    this.state = {};
    this.cmDOM = document.createElement('div');
    this.cm = CodeMirror(this.cmDOM);

    const client = new OtClient(Math.random()+'', '', 0, this.cm, socket);
    this.client = client;
    socket.on('server', this.onReceiveOperation);
  }

  componentDidMount () {
    this.cmContainer.appendChild(this.cmDOM);
  }

  onReceiveOperation = (json) => {
    console.log('onReceiveOperation', json, typeof json);
    const operation = new ot.WrappedOperation(ot.TextOperation.fromJSON(json.wrapped), json.meta);
    if (operation.meta.creator === this.client.name) {
      this.client.serverAck();
      console.log('acknowledge')
    } else {
      this.client.applyServer(operation);
      console.log('applyServer')
    }
  }

  onUserChange = (change) => {
    const operation = this.client.createOperation(); // has the right revision number
    // initialize operation here with for example operation.fromCodeMirrorChange
    operation.fromCodeMirrorChange(change);
    this.client.applyClient(operation);
  }

  render () {
    return (
      <div ref={r => this.cmContainer = r} style={{ width: 1000, height: 500, border: '1px solid blue' }}></div>
    );
  }
}

export default App;
