const _ = require('lodash');

const ot = window.ot;
const { CodeMirrorAdapter, WrappedOperation, Client: BaseClient } = ot;

export default class OtClient extends BaseClient {
  constructor (name, str, revision, cm, socket) {
    super(revision);
    // this.state is attached by BaseClient
    console.log(this.state)
    this.name = name;
    this.cm = cm;
    this.socket = socket;

    this.fromServer = false;

    this.cm.on('changes', (cm, changes) => {
      if (this.fromServer) return
      let operation = CodeMirrorAdapter.operationFromCodeMirrorChanges(changes, this.cm)[0];
      console.log('check raw operation', operation);
      operation = new WrappedOperation(operation, {
        creator: this.name,
        id: _.uniqueId('operation')
      });
      console.log(changes, operation);
      this.applyClient(operation);
    });
  }

  sendOperation (revision, operation) {
    operation.revision = revision;
    this.socket.emit('client', operation);
  }

  applyOperation (operation) {
    this.fromServer = true;
    CodeMirrorAdapter.applyOperationToCodeMirror(operation.wrapped, this.cm);
    this.fromServer = false;
  }

  applyClient (operation) {
    super.applyClient(operation);
  }
}
