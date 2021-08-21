'use strict';



;define("sharedrop/app", ["exports", "ember-resolver", "ember-load-initializers", "sharedrop/config/environment", "@sentry/browser", "@sentry/integrations"], function (_exports, _emberResolver, _emberLoadInitializers, _environment, Sentry, _integrations) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  Sentry.init({
    dsn: 'https://ba1292a9c759401dbbda4272f183408d@o432021.ingest.sentry.io/5384091',
    integrations: [new _integrations.Ember()]
  });

  class App extends Ember.Application {
    constructor(...args) {
      super(...args);

      _defineProperty(this, "modulePrefix", _environment.default.modulePrefix);

      _defineProperty(this, "podModulePrefix", _environment.default.podModulePrefix);

      _defineProperty(this, "Resolver", _emberResolver.default);
    }

  }

  _exports.default = App;
  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);
});
;define("sharedrop/component-managers/glimmer", ["exports", "@glimmer/component/-private/ember-component-manager"], function (_exports, _emberComponentManager) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _emberComponentManager.default;
    }
  });
});
;define("sharedrop/components/circular-progress", ["exports", "@glimmer/component"], function (_exports, _component) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  const __COLOCATED_TEMPLATE__ = Ember.HTMLBars.template(
  /*
    <svg width="76" height="76" viewport="0 0 76 76" style={{this.style}}>
    <path class="break" transform="translate(38, 38)" d={{this.path}} />
  </svg>
  */
  {"id":"PyuhpFmm","block":"{\"symbols\":[],\"statements\":[[10,\"svg\"],[14,\"width\",\"76\"],[14,\"height\",\"76\"],[14,\"viewport\",\"0 0 76 76\"],[15,5,[32,0,[\"style\"]]],[12],[2,\"\\n  \"],[10,\"path\"],[14,0,\"break\"],[14,\"transform\",\"translate(38, 38)\"],[15,\"d\",[32,0,[\"path\"]]],[12],[13],[2,\"\\n\"],[13]],\"hasEval\":false,\"upvars\":[]}","meta":{"moduleName":"sharedrop/components/circular-progress.hbs"}});

  const COLORS = {
    blue: '0, 136, 204',
    orange: '197, 197, 51'
  };

  class CircularProgress extends _component.default {
    constructor(owner, args) {
      super(owner, args);
      const rgb = COLORS[args.color];
      this.style = Ember.String.htmlSafe(`fill: rgba(${rgb}, .5)`);
    }

    get path() {
      const π = Math.PI;
      const α = this.args.value * 360;
      const r = α * π / 180;
      const mid = α > 180 ? 1 : 0;
      const x = Math.sin(r) * 38;
      const y = Math.cos(r) * -38;
      return `M 0 0 v -38 A 38 38 1 ${mid} 1 ${x} ${y} z`;
    }

  }

  _exports.default = CircularProgress;

  Ember._setComponentTemplate(__COLOCATED_TEMPLATE__, CircularProgress);
});
;define("sharedrop/components/file-field", ["exports", "jquery"], function (_exports, _jquery) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.TextField.extend({
    type: 'file',
    classNames: ['invisible'],

    click(event) {
      event.stopPropagation();
    },

    change(event) {
      const input = event.target;
      const {
        files
      } = input;
      this.onChange({
        files
      });
      this.reset();
    },

    // Hackish way to reset file input when sender cancels file transfer,
    // so if sender wants later to send the same file again,
    // the 'change' event is triggered correctly.
    reset() {
      const field = (0, _jquery.default)(this.element);
      field.wrap('<form>').closest('form').get(0).reset();
      field.unwrap();
    }

  });

  _exports.default = _default;
});
;define("sharedrop/components/modal-dialog", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    actions: {
      close() {
        // This sends an action to application route.
        // eslint-disable-next-line ember/closure-actions
        return this.onClose();
      }

    }
  });

  _exports.default = _default;
});
;define("sharedrop/components/peer-avatar", ["exports", "jquery"], function (_exports, _jquery) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    tagName: 'img',
    classNames: ['gravatar'],
    attributeBindings: ['src', 'alt', 'title', 'data-sending-progress', 'data-receiving-progress'],
    src: Ember.computed.alias('peer.avatarUrl'),
    alt: Ember.computed.alias('peer.label'),
    title: Ember.computed.alias('peer.uuid'),
    'data-sending-progress': Ember.computed.alias('peer.transfer.sendingProgress'),
    'data-receiving-progress': Ember.computed.alias('peer.transfer.receivingProgress'),

    toggleTransferCompletedClass() {
      const className = 'transfer-completed';
      Ember.run.later(this, function toggleClass() {
        (0, _jquery.default)(this.element).parent('.avatar').addClass(className).delay(2000).queue(function removeClass() {
          (0, _jquery.default)(this).removeClass(className).dequeue();
        });
      }, 250);
    },

    init(...args) {
      this._super(args);

      this.toggleTransferCompletedClass = this.toggleTransferCompletedClass.bind(this);
    },

    didInsertElement(...args) {
      this._super(args);

      const {
        peer
      } = this;
      peer.on('didReceiveFile', this.toggleTransferCompletedClass);
      peer.on('didSendFile', this.toggleTransferCompletedClass);
    },

    willDestroyElement(...args) {
      this._super(args);

      const {
        peer
      } = this;
      peer.off('didReceiveFile', this.toggleTransferCompletedClass);
      peer.off('didSendFile', this.toggleTransferCompletedClass);
    },

    // Delegate click to hidden file field in peer template
    click() {
      if (this.canSendFile()) {
        (0, _jquery.default)(this.element).closest('.peer').find('input[type=file]').click();
      }
    },

    // Handle drop events
    dragEnter(event) {
      this.cancelEvent(event);
      (0, _jquery.default)(this.element).parent('.avatar').addClass('hover');
    },

    dragOver(event) {
      this.cancelEvent(event);
    },

    dragLeave() {
      (0, _jquery.default)(this.element).parent('.avatar').removeClass('hover');
    },

    drop(event) {
      this.cancelEvent(event);
      (0, _jquery.default)(this.element).parent('.avatar').removeClass('hover');
      const {
        peer
      } = this;
      const dt = event.originalEvent.dataTransfer;
      const {
        files
      } = dt;

      if (this.canSendFile()) {
        if (!this.isTransferableBundle(files)) {
          peer.setProperties({
            state: 'error',
            errorCode: 'multiple-files'
          });
        } else {
          this.onFileDrop({
            files
          });
        }
      }
    },

    cancelEvent(event) {
      event.stopPropagation();
      event.preventDefault();
    },

    canSendFile() {
      const {
        peer
      } = this; // Can't send files if another file transfer is already in progress

      return !(peer.get('state') === 'is_preparing_file_transfer' || peer.get('transfer.file') || peer.get('transfer.info'));
    },

    isTransferableBundle(files) {
      if (files.length === 1 && files[0] instanceof window.File) return true;
      const fileSizeLimit = 50 * 1024 * 1024;
      const bundleSizeLimit = 200 * 1024 * 1024;
      let aggregatedSize = 0; // eslint-disable-next-line no-restricted-syntax

      for (const file of files) {
        if (!(file instanceof window.File)) {
          return false;
        }

        if (file.size > fileSizeLimit) {
          return false;
        }

        aggregatedSize += file.size;

        if (aggregatedSize > bundleSizeLimit) {
          return false;
        }
      }

      return true;
    }

  });

  _exports.default = _default;
});
;define("sharedrop/components/peer-widget", ["exports", "jszip"], function (_exports, _jszip) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    classNames: ['peer'],
    classNameBindings: ['peer.peer.state'],
    peer: null,
    hasCustomRoomName: false,
    webrtc: null,
    // TODO inject webrtc as a service
    label: Ember.computed.alias('peer.label'),
    isIdle: Ember.computed.equal('peer.state', 'idle'),
    isPreparingFileTransfer: Ember.computed.equal('peer.state', 'is_preparing_file_transfer'),
    hasSelectedFile: Ember.computed.equal('peer.state', 'has_selected_file'),
    isSendingFileInfo: Ember.computed.equal('peer.state', 'sending_file_info'),
    isAwaitingFileInfo: Ember.computed.equal('peer.state', 'awaiting_file_info'),
    isAwaitingResponse: Ember.computed.equal('peer.state', 'awaiting_response'),
    hasReceivedFileInfo: Ember.computed.equal('peer.state', 'received_file_info'),
    hasDeclinedFileTransfer: Ember.computed.equal('peer.state', 'declined_file_transfer'),
    hasError: Ember.computed.equal('peer.state', 'error'),
    isReceivingFile: Ember.computed.gt('peer.transfer.receivingProgress', 0),
    isSendingFile: Ember.computed.gt('peer.transfer.sendingProgress', 0),
    filename: Ember.computed('peer.transfer.{file,info}', function () {
      const file = this.get('peer.transfer.file');
      const info = this.get('peer.transfer.info');

      if (file) {
        return file.name;
      }

      if (info) {
        return info.name;
      }

      return null;
    }),
    errorTemplateName: Ember.computed('peer.errorCode', function () {
      const errorCode = this.get('peer.errorCode');
      return errorCode ? `errors/popovers/${errorCode}` : null;
    }),
    actions: {
      // TODO: rename to something more meaningful (e.g. askIfWantToSendFile)
      uploadFile(data) {
        const {
          peer
        } = this;
        const {
          files
        } = data;
        peer.set('state', 'is_preparing_file_transfer');
        peer.set('bundlingProgress', 0); // Cache the file, so that it's available
        // when the response from the recipient comes in

        this._reduceFiles(files).then(file => {
          peer.set('transfer.file', file);
          peer.set('state', 'has_selected_file');
        });
      },

      sendFileTransferInquiry() {
        const {
          webrtc
        } = this;
        const {
          peer
        } = this;
        webrtc.connect(peer.get('peer.id'));
        peer.set('state', 'establishing_connection');
      },

      cancelFileTransfer() {
        this._cancelFileTransfer();
      },

      abortFileTransfer() {
        this._cancelFileTransfer();

        const {
          webrtc
        } = this;
        const connection = this.get('peer.peer.connection');
        webrtc.sendCancelRequest(connection);
      },

      acceptFileTransfer() {
        const {
          peer
        } = this;

        this._sendFileTransferResponse(true);

        peer.get('peer.connection').on('receiving_progress', progress => {
          peer.set('transfer.receivingProgress', progress);
        });
        peer.set('state', 'sending_file_data');
      },

      rejectFileTransfer() {
        const {
          peer
        } = this;

        this._sendFileTransferResponse(false);

        peer.set('transfer.info', null);
        peer.set('state', 'idle');
      }

    },

    _cancelFileTransfer() {
      const {
        peer
      } = this;
      peer.setProperties({
        'transfer.file': null,
        state: 'idle'
      });
    },

    _sendFileTransferResponse(response) {
      const {
        webrtc
      } = this;
      const {
        peer
      } = this;
      const connection = peer.get('peer.connection');
      webrtc.sendFileResponse(connection, response);
    },

    async _reduceFiles(files) {
      const {
        peer
      } = this;

      if (files.length === 1) {
        return Promise.resolve(files[0]);
      }

      const zip = new _jszip.default();
      Array.prototype.forEach.call(files, file => {
        zip.file(file.name, file);
      });
      const blob = await zip.generateAsync({
        type: 'blob',
        streamFiles: true
      }, metadata => {
        peer.set('bundlingProgress', metadata.percent / 100);
      });
      return new File([blob], `sharedrop-${new Date().toISOString().substring(0, 19).replace('T', '-')}.zip`, {
        type: 'application/zip'
      });
    }

  });

  _exports.default = _default;
});
;define("sharedrop/components/popover-confirm", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    classNames: ['popover-confirm'],
    iconClass: Ember.computed('filename', function () {
      const {
        filename
      } = this;

      if (filename) {
        const regex = /\.([0-9a-z]+)$/i;
        const match = filename.match(regex);
        const extension = match && match[1];

        if (extension) {
          return `glyphicon-${extension.toLowerCase()}`;
        }
      }

      return undefined;
    }),
    actions: {
      confirm() {
        this.onConfirm();
      },

      cancel() {
        this.onCancel();
      }

    }
  });

  _exports.default = _default;
});
;define("sharedrop/components/qr-code", ["exports", "ember-qrcode-shim/components/qr-code"], function (_exports, _qrCode) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _qrCode.default;
    }
  });
});
;define("sharedrop/components/room-url", ["exports", "jquery"], function (_exports, _jquery) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.TextField.extend({
    classNames: ['room-url'],

    didInsertElement() {
      (0, _jquery.default)(this.element).focus().select();
    },

    copyValueToClipboard() {
      if (window.ClipboardEvent) {
        const pasteEvent = new window.ClipboardEvent('paste', {
          dataType: 'text/plain',
          data: this.element.value
        });
        document.dispatchEvent(pasteEvent);
      }
    }

  });

  _exports.default = _default;
});
;define("sharedrop/components/user-widget", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    classNames: ['peer'],
    classNameBindings: ['peer.peer.state']
  });

  _exports.default = _default;
});
;define("sharedrop/controllers/application", ["exports", "uuid", "sharedrop/models/user"], function (_exports, _uuid, _user) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Controller.extend({
    avatarService: Ember.inject.service('avatar'),

    init(...args) {
      this._super(args);

      const id = window.Sharedrop.userId;
      const ip = window.Sharedrop.publicIp;
      const avatar = this.avatarService.get();

      const you = _user.default.create({
        uuid: id,
        public_ip: ip,
        avatarUrl: avatar.url,
        label: avatar.label
      });

      you.set('peer.id', id);
      this.set('you', you);
    },

    actions: {
      redirect() {
        const uuid = (0, _uuid.v4)();
        const key = `show-instructions-for-room-${uuid}`;
        sessionStorage.setItem(key, 'yup');
        this.transitionToRoute('room', uuid);
      }

    }
  });

  _exports.default = _default;
});
;define("sharedrop/controllers/index", ["exports", "jquery", "sharedrop/services/web-rtc", "sharedrop/models/peer"], function (_exports, _jquery, _webRtc, _peer) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Controller.extend({
    application: Ember.inject.controller('application'),
    you: Ember.computed.alias('application.you'),
    room: null,
    webrtc: null,

    _onRoomConnected(event, data) {
      const {
        you
      } = this;
      const {
        room
      } = this;
      you.get('peer').setProperties(data.peer); // eslint-disable-next-line no-param-reassign

      delete data.peer;
      you.setProperties(data); // Initialize WebRTC

      this.set('webrtc', new _webRtc.default(you.get('uuid'), {
        room: room.name,
        firebaseRef: window.Sharedrop.ref
      }));
    },

    _onRoomDisconnected() {
      this.model.clear();
      this.set('webrtc', null);
    },

    _onRoomUserAdded(event, data) {
      const {
        you
      } = this;

      if (you.get('uuid') !== data.uuid) {
        this._addPeer(data);
      }
    },

    _addPeer(attrs) {
      const peerAttrs = attrs.peer; // eslint-disable-next-line no-param-reassign

      delete attrs.peer;

      const peer = _peer.default.create(attrs);

      peer.get('peer').setProperties(peerAttrs);
      this.model.pushObject(peer);
    },

    _onRoomUserChanged(event, data) {
      const peers = this.model;
      const peer = peers.findBy('uuid', data.uuid);
      const peerAttrs = data.peer;
      const defaults = {
        uuid: null,
        public_ip: null
      };

      if (peer) {
        // eslint-disable-next-line no-param-reassign
        delete data.peer; // Firebase doesn't return keys with null values,
        // so we have to add them back.

        peer.setProperties(_jquery.default.extend({}, defaults, data));
        peer.get('peer').setProperties(peerAttrs);
      }
    },

    _onRoomUserRemoved(event, data) {
      const peers = this.model;
      const peer = peers.findBy('uuid', data.uuid);
      peers.removeObject(peer);
    },

    _onPeerP2PIncomingConnection(event, data) {
      const {
        connection
      } = data;
      const peers = this.model;
      const peer = peers.findBy('peer.id', connection.peer); // Don't switch to 'connecting' state on incoming connection,
      // as p2p connection may still fail.

      peer.set('peer.connection', connection);
    },

    _onPeerDCIncomingConnection(event, data) {
      const {
        connection
      } = data;
      const peers = this.model;
      const peer = peers.findBy('peer.id', connection.peer);
      peer.set('peer.state', 'connected');
    },

    _onPeerDCIncomingConnectionError(event, data) {
      const {
        connection,
        error
      } = data;
      const peers = this.model;
      const peer = peers.findBy('peer.id', connection.peer);

      switch (error.type) {
        case 'failed':
          peer.setProperties({
            'peer.connection': null,
            'peer.state': 'disconnected',
            state: 'error',
            errorCode: 'connection-failed'
          });
          break;

        case 'disconnected':
          // TODO: notify both sides
          break;

        default:
          break;
      }
    },

    _onPeerP2POutgoingConnection(event, data) {
      const {
        connection
      } = data;
      const peers = this.model;
      const peer = peers.findBy('peer.id', connection.peer);
      peer.setProperties({
        'peer.connection': connection,
        'peer.state': 'connecting'
      });
    },

    _onPeerDCOutgoingConnection(event, data) {
      const {
        connection
      } = data;
      const peers = this.model;
      const peer = peers.findBy('peer.id', connection.peer);
      const file = peer.get('transfer.file');
      const {
        webrtc
      } = this;
      const info = webrtc.getFileInfo(file);
      peer.set('peer.state', 'connected');
      peer.set('state', 'awaiting_response');
      webrtc.sendFileInfo(connection, info);
      console.log('Sending a file info...', info);
    },

    _onPeerDCOutgoingConnectionError(event, data) {
      const {
        connection,
        error
      } = data;
      const peers = this.model;
      const peer = peers.findBy('peer.id', connection.peer);

      switch (error.type) {
        case 'failed':
          peer.setProperties({
            'peer.connection': null,
            'peer.state': 'disconnected',
            state: 'error',
            errorCode: 'connection-failed'
          });
          break;

        default:
          break;
      }
    },

    _onPeerP2PDisconnected(event, data) {
      const {
        connection
      } = data;
      const peers = this.model;
      const peer = peers.findBy('peer.id', connection.peer);

      if (peer) {
        peer.set('peer.connection', null);
        peer.set('peer.state', 'disconnected');
      }
    },

    _onPeerP2PFileInfo(event, data) {
      console.log('Peer:\t Received file info', data);
      const {
        connection,
        info
      } = data;
      const peers = this.model;
      const peer = peers.findBy('peer.id', connection.peer);
      peer.set('transfer.info', info);
      peer.set('state', 'received_file_info');
    },

    _onPeerP2PFileResponse(event, data) {
      console.log('Peer:\t Received file response', data);
      const {
        connection,
        response
      } = data;
      const peers = this.model;
      const peer = peers.findBy('peer.id', connection.peer);
      const {
        webrtc
      } = this;

      if (response) {
        const file = peer.get('transfer.file');
        connection.on('sending_progress', progress => {
          peer.set('transfer.sendingProgress', progress);
        });
        webrtc.sendFile(connection, file);
        peer.set('state', 'receiving_file_data');
      } else {
        peer.set('state', 'declined_file_transfer');
      }
    },

    _onPeerP2PFileCanceled(event, data) {
      const {
        connection
      } = data;
      const peers = this.model;
      const peer = peers.findBy('peer.id', connection.peer);
      connection.close();
      peer.set('transfer.receivingProgress', 0);
      peer.set('transfer.info', null);
      peer.set('state', 'idle');
    },

    _onPeerP2PFileReceived(event, data) {
      console.log('Peer:\t Received file', data);
      const {
        connection
      } = data;
      const peers = this.model;
      const peer = peers.findBy('peer.id', connection.peer);
      connection.close();
      peer.set('transfer.receivingProgress', 0);
      peer.set('transfer.info', null);
      peer.set('state', 'idle');
      peer.trigger('didReceiveFile');
    },

    _onPeerP2PFileSent(event, data) {
      console.log('Peer:\t Sent file', data);
      const {
        connection
      } = data;
      const peers = this.model;
      const peer = peers.findBy('peer.id', connection.peer);
      peer.set('transfer.sendingProgress', 0);
      peer.set('transfer.file', null);
      peer.set('state', 'idle');
      peer.trigger('didSendFile');
    }

  });

  _exports.default = _default;
});
;define("sharedrop/helpers/app-version", ["exports", "sharedrop/config/environment", "ember-cli-app-version/utils/regexp"], function (_exports, _environment, _regexp) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.appVersion = appVersion;
  _exports.default = void 0;

  function appVersion(_, hash = {}) {
    const version = _environment.default.APP.version; // e.g. 1.0.0-alpha.1+4jds75hf
    // Allow use of 'hideSha' and 'hideVersion' For backwards compatibility

    let versionOnly = hash.versionOnly || hash.hideSha;
    let shaOnly = hash.shaOnly || hash.hideVersion;
    let match = null;

    if (versionOnly) {
      if (hash.showExtended) {
        match = version.match(_regexp.versionExtendedRegExp); // 1.0.0-alpha.1
      } // Fallback to just version


      if (!match) {
        match = version.match(_regexp.versionRegExp); // 1.0.0
      }
    }

    if (shaOnly) {
      match = version.match(_regexp.shaRegExp); // 4jds75hf
    }

    return match ? match[0] : version;
  }

  var _default = Ember.Helper.helper(appVersion);

  _exports.default = _default;
});
;define("sharedrop/helpers/is-equal", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Helper.helper(([leftSide, rightSide]) => leftSide === rightSide);

  _exports.default = _default;
});
;define("sharedrop/initializers/app-version", ["exports", "ember-cli-app-version/initializer-factory", "sharedrop/config/environment"], function (_exports, _initializerFactory, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  let name, version;

  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  var _default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
  _exports.default = _default;
});
;define("sharedrop/initializers/container-debug-adapter", ["exports", "ember-resolver/resolvers/classic/container-debug-adapter"], function (_exports, _containerDebugAdapter) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = {
    name: 'container-debug-adapter',

    initialize() {
      let app = arguments[1] || arguments[0];
      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }

  };
  _exports.default = _default;
});
;define("sharedrop/initializers/export-application-global", ["exports", "sharedrop/config/environment"], function (_exports, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.initialize = initialize;
  _exports.default = void 0;

  function initialize() {
    var application = arguments[1] || arguments[0];

    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;

      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;
        application.reopen({
          willDestroy: function () {
            this._super.apply(this, arguments);

            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  var _default = {
    name: 'export-application-global',
    initialize: initialize
  };
  _exports.default = _default;
});
;define("sharedrop/initializers/prerequisites", ["exports", "jquery", "sharedrop/config/environment", "sharedrop/services/file", "sharedrop/services/analytics"], function (_exports, _jquery, _environment, _file, _analytics) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.initialize = initialize;
  _exports.default = void 0;

  /* jshint -W030 */
  function initialize(application) {
    function checkWebRTCSupport() {
      return new Ember.RSVP.Promise((resolve, reject) => {
        // window.util is a part of PeerJS library
        if (window.util.supports.sctp) {
          resolve();
        } else {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('browser-unsupported');
        }
      });
    }

    function clearFileSystem() {
      return new Ember.RSVP.Promise((resolve, reject) => {
        // TODO: change File into a service and require it here
        _file.default.removeAll().then(() => {
          resolve();
        }).catch(() => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('filesystem-unavailable');
        });
      });
    }

    function authenticateToFirebase() {
      return new Ember.RSVP.Promise((resolve, reject) => {
        const xhr = _jquery.default.getJSON('/auth');

        xhr.then(data => {
          const ref = new window.Firebase(_environment.default.FIREBASE_URL); // eslint-disable-next-line no-param-reassign

          application.ref = ref; // eslint-disable-next-line no-param-reassign

          application.userId = data.id; // eslint-disable-next-line no-param-reassign

          application.publicIp = data.public_ip;
          ref.authWithCustomToken(data.token, error => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        });
      });
    } // TODO: move it to a separate initializer


    function trackSizeOfReceivedFiles() {
      _jquery.default.subscribe('file_received.p2p', (event, data) => {
        _analytics.default.trackEvent('received', {
          event_category: 'file',
          event_label: 'size',
          value: Math.round(data.info.size / 1000)
        });
      });
    }

    application.deferReadiness();
    checkWebRTCSupport().then(clearFileSystem).catch(error => {
      // eslint-disable-next-line no-param-reassign
      application.error = error;
    }).then(authenticateToFirebase).then(trackSizeOfReceivedFiles).then(() => {
      application.advanceReadiness();
    });
  }

  var _default = {
    name: 'prerequisites',
    initialize
  };
  _exports.default = _default;
});
;define("sharedrop/models/peer", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Object.extend(Ember.Evented, {
    uuid: null,
    label: null,
    avatarUrl: null,
    public_ip: null,
    peer: null,
    transfer: null,

    init(...args) {
      this._super(args);

      const initialPeerState = Ember.Object.create({
        id: null,
        connection: null,
        // State of data channel connection. Possible states:
        // - disconnected
        // - connecting
        // - connected
        state: 'disconnected'
      });
      const initialTransferState = Ember.Object.create({
        file: null,
        info: null,
        sendingProgress: 0,
        receivingProgress: 0
      });
      this.set('peer', initialPeerState);
      this.set('transfer', initialTransferState);
    },

    // Used to display popovers. Possible states:
    // - idle
    // - has_selected_file
    // - establishing_connection
    // - awaiting_response
    // - received_file_info
    // - declined_file_transfer
    // - receiving_file_data
    // - sending_file_data
    // - error
    state: 'idle',
    // Used to display error messages in popovers. Possible codes:
    // - multiple_files
    errorCode: null,
    stateChanged: Ember.on('init', Ember.observer('state', function () {
      console.log('Peer:\t State has changed: ', this.state); // Automatically clear error code if transitioning to a non-error state

      if (this.state !== 'error') {
        this.set('errorCode', null);
      }
    }))
  });

  _exports.default = _default;
});
;define("sharedrop/models/user", ["exports", "sharedrop/models/peer"], function (_exports, _peer) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  const User = _peer.default.extend({
    serialize() {
      const data = {
        uuid: this.uuid,
        public_ip: this.public_ip,
        label: this.label,
        avatarUrl: this.avatarUrl,
        peer: {
          id: this.get('peer.id')
        }
      };
      return data;
    }

  });

  var _default = User;
  _exports.default = _default;
});
;define("sharedrop/router", ["exports", "sharedrop/config/environment"], function (_exports, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  class Router extends Ember.Router {
    constructor(...args) {
      super(...args);

      _defineProperty(this, "location", _environment.default.locationType);

      _defineProperty(this, "rootURL", _environment.default.rootURL);
    }

  } // eslint-disable-next-line array-callback-return


  _exports.default = Router;
  Router.map(function () {
    this.route('room', {
      path: '/rooms/:room_id'
    });
  });
});
;define("sharedrop/routes/application", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend({
    setupController(controller) {
      controller.set('currentRoute', this);
    },

    actions: {
      openModal(modalName) {
        return this.render(modalName, {
          outlet: 'modal',
          into: 'application'
        });
      },

      closeModal() {
        return this.disconnectOutlet({
          outlet: 'modal',
          parentView: 'application'
        });
      }

    }
  });

  _exports.default = _default;
});
;define("sharedrop/routes/error", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend({
    renderTemplate(controller, error) {
      const errors = ['browser-unsupported', 'filesystem-unavailable'];
      const name = `errors/${error.message}`;

      if (errors.indexOf(error.message) !== -1) {
        this.render(name);
      }
    }

  });

  _exports.default = _default;
});
;define("sharedrop/routes/index", ["exports", "jquery", "sharedrop/services/room"], function (_exports, _jquery, _room) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend({
    beforeModel() {
      const {
        error
      } = window.Sharedrop;

      if (error) {
        throw new Error(error);
      }
    },

    model() {
      // Get room name from the server
      return _jquery.default.getJSON('/room').then(data => data.name);
    },

    setupController(ctrl, model) {
      ctrl.set('model', []);
      ctrl.set('hasCustomRoomName', false); // Handle room events

      _jquery.default.subscribe('connected.room', ctrl._onRoomConnected.bind(ctrl));

      _jquery.default.subscribe('disconnected.room', ctrl._onRoomDisconnected.bind(ctrl));

      _jquery.default.subscribe('user_added.room', ctrl._onRoomUserAdded.bind(ctrl));

      _jquery.default.subscribe('user_changed.room', ctrl._onRoomUserChanged.bind(ctrl));

      _jquery.default.subscribe('user_removed.room', ctrl._onRoomUserRemoved.bind(ctrl)); // Handle peer events


      _jquery.default.subscribe('incoming_peer_connection.p2p', ctrl._onPeerP2PIncomingConnection.bind(ctrl));

      _jquery.default.subscribe('incoming_dc_connection.p2p', ctrl._onPeerDCIncomingConnection.bind(ctrl));

      _jquery.default.subscribe('incoming_dc_connection_error.p2p', ctrl._onPeerDCIncomingConnectionError.bind(ctrl));

      _jquery.default.subscribe('outgoing_peer_connection.p2p', ctrl._onPeerP2POutgoingConnection.bind(ctrl));

      _jquery.default.subscribe('outgoing_dc_connection.p2p', ctrl._onPeerDCOutgoingConnection.bind(ctrl));

      _jquery.default.subscribe('outgoing_dc_connection_error.p2p', ctrl._onPeerDCOutgoingConnectionError.bind(ctrl));

      _jquery.default.subscribe('disconnected.p2p', ctrl._onPeerP2PDisconnected.bind(ctrl));

      _jquery.default.subscribe('info.p2p', ctrl._onPeerP2PFileInfo.bind(ctrl));

      _jquery.default.subscribe('response.p2p', ctrl._onPeerP2PFileResponse.bind(ctrl));

      _jquery.default.subscribe('file_canceled.p2p', ctrl._onPeerP2PFileCanceled.bind(ctrl));

      _jquery.default.subscribe('file_received.p2p', ctrl._onPeerP2PFileReceived.bind(ctrl));

      _jquery.default.subscribe('file_sent.p2p', ctrl._onPeerP2PFileSent.bind(ctrl)); // Join the room


      const room = new _room.default(model, window.Sharedrop.ref);
      room.join(ctrl.get('you').serialize());
      ctrl.set('room', room);
    },

    renderTemplate() {
      this.render();
      this.render('about_you', {
        into: 'application',
        outlet: 'about_you'
      });
      const key = 'show-instructions-for-app';

      if (!localStorage.getItem(key)) {
        this.send('openModal', 'about_app');
        localStorage.setItem(key, 'yup');
      }
    },

    actions: {
      willTransition() {
        _jquery.default.unsubscribe('.room');

        _jquery.default.unsubscribe('.p2p'); // eslint-disable-next-line ember/no-controller-access-in-routes


        const controller = this.controllerFor('index');
        controller.get('room').leave();
        return true;
      }

    }
  });

  _exports.default = _default;
});
;define("sharedrop/routes/room", ["exports", "sharedrop/routes/index"], function (_exports, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _index.default.extend({
    controllerName: 'index',

    model(params) {
      // Get room name from params
      return params.room_id;
    },

    afterModel(model, transition) {
      transition.then(route => {
        route.controllerFor('application').set('currentUrl', window.location.href);
      });
    },

    setupController(ctrl, model) {
      // Call this method on "index" controller
      this._super(ctrl, model);

      ctrl.set('hasCustomRoomName', true);
    },

    renderTemplate(ctrl) {
      this.render('index');
      this.render('about_you', {
        into: 'application',
        outlet: 'about_you'
      });
      const room = ctrl.get('room').name;
      const key = `show-instructions-for-room-${room}`;

      if (sessionStorage.getItem(key)) {
        this.send('openModal', 'about_room');
        sessionStorage.removeItem(key);
      }
    }

  });

  _exports.default = _default;
});
;define("sharedrop/services/analytics", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = {
    trackEvent(name, parameters) {
      if (window.gtag && typeof window.gtag === 'function') {
        window.gtag('event', name, parameters);
      }
    }

  };
  _exports.default = _default;
});
;define("sharedrop/services/avatar", ["exports", "lodash/sample", "lodash/startCase"], function (_exports, _sample, _startCase) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const AVATARS = [{
    name: 'Piglet',
    id: '23'
  }, {
    name: 'Cat',
    id: '36'
  }, {
    name: 'Fish',
    id: '37'
  }, {
    name: 'Fox',
    id: '38'
  }, {
    name: 'Chicken',
    id: '46'
  }, {
    name: 'Goat',
    id: '50'
  }, {
    name: 'Ram',
    id: '51'
  }, {
    name: 'Sheep',
    id: '52'
  }, {
    name: 'Bison',
    id: '59'
  }, {
    name: 'Dog',
    id: '61'
  }, {
    name: 'Walrus',
    id: '62'
  }, {
    name: 'Dog',
    id: '63'
  }, {
    name: 'Monkey',
    id: '64'
  }, {
    name: 'Bear',
    id: '65'
  }, {
    name: 'Lion',
    id: '66'
  }, {
    name: 'Zebra',
    id: '67'
  }, {
    name: 'Giraffe',
    id: '68'
  }, {
    name: 'Bear',
    id: '71'
  }, {
    name: 'Wolf',
    id: '74'
  }, {
    name: 'Rhino',
    id: '86'
  }, {
    name: 'Bat',
    id: '87'
  }, {
    name: 'Cat',
    id: '95'
  }, {
    name: 'Penguin',
    id: '102'
  }, {
    name: 'Rhino',
    id: '109'
  }, {
    name: 'Koala',
    id: '112'
  }];
  const PREFIXES = ['adventurous', 'affable', 'ambitious', 'amiable ', 'amusing', 'brave', 'bright', 'charming', 'compassionate', 'convivial', 'courageous', 'creative', 'diligent', 'easygoing', 'emotional', 'energetic', 'enthusiastic', 'exuberant', 'fearless', 'friendly', 'funny', 'generous', 'gentle', 'good', 'helpful', 'honest', 'humorous', 'imaginative', 'independent', 'intelligent', 'intuitive', 'inventive', 'kind', 'loving', 'loyal', 'modest', 'neat', 'nice', 'optimistic', 'passionate', 'patient', 'persistent', 'polite', 'practical', 'rational', 'reliable', 'reserved', 'resourceful', 'romantic', 'sensible', 'sensitive', 'sincere', 'sympathetic', 'thoughtful', 'tough', 'understanding', 'versatile', 'warmhearted'];
  const Avatar = Ember.Service.extend({
    get() {
      const avatar = (0, _sample.default)(AVATARS);
      const prefix = (0, _sample.default)(PREFIXES);
      return {
        url: `/assets/images/avatars/${avatar.id}.svg`,
        label: (0, _startCase.default)(`${prefix} ${avatar.name}`)
      };
    }

  });
  var _default = Avatar;
  _exports.default = _default;
});
;define("sharedrop/services/file", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  const File = function (options) {
    const self = this;
    this.name = options.name;
    this.localName = `${new Date().getTime()}-${this.name}`;
    this.size = options.size;
    this.type = options.type;

    this._reset();

    return new Ember.RSVP.Promise((resolve, reject) => {
      const requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
      requestFileSystem(window.TEMPORARY, options.size, filesystem => {
        self.filesystem = filesystem;
        resolve(self);
      }, error => {
        self.errorHandler(error);
        reject(error);
      });
    });
  };

  File.removeAll = function () {
    return new Ember.RSVP.Promise((resolve, reject) => {
      const filer = new window.Filer();
      filer.init({
        persistent: false
      }, () => {
        filer.ls('/', entries => {
          function rm(entry) {
            if (entry) {
              filer.rm(entry, () => {
                rm(entries.pop());
              });
            } else {
              resolve();
            }
          }

          rm(entries.pop());
        });
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  };

  File.prototype.append = function (data) {
    const self = this;
    const options = {
      create: this.create
    };
    return new Ember.RSVP.Promise((resolve, reject) => {
      self.filesystem.root.getFile(self.localName, options, fileEntry => {
        if (self.create) {
          self.create = false;
        }

        self.fileEntry = fileEntry;
        fileEntry.createWriter(writer => {
          const blob = new Blob(data, {
            type: self.type
          }); // console.log('File: Appending ' + blob.size + ' bytes at ' + self.seek);
          // eslint-disable-next-line no-param-reassign

          writer.onwriteend = function () {
            self.seek += blob.size;
            resolve(fileEntry);
          }; // eslint-disable-next-line no-param-reassign


          writer.onerror = function (error) {
            self.errorHandler(error);
            reject(error);
          };

          writer.seek(self.seek);
          writer.write(blob);
        }, error => {
          self.errorHandler(error);
          reject(error);
        });
      }, error => {
        self.errorHandler(error);
        reject(error);
      });
    });
  };

  File.prototype.save = function () {
    const self = this;
    console.log('File: Saving file: ', this.fileEntry);
    const a = document.createElement('a');
    a.download = this.name;

    function finish(link) {
      document.body.appendChild(a);
      link.addEventListener('click', () => {
        // Remove file entry from filesystem.
        setTimeout(() => {
          self.remove().then(self._reset.bind(self));
        }, 100); // Hack, but otherwise browser doesn't save the file at all.

        link.parentNode.removeChild(a);
      });
      link.click();
    }

    if (this._isWebKit()) {
      a.href = this.fileEntry.toURL();
      finish(a);
    } else {
      this.fileEntry.file(file => {
        const URL = window.URL || window.webkitURL;
        a.href = URL.createObjectURL(file);
        finish(a);
      });
    }
  };

  File.prototype.errorHandler = function (error) {
    console.error('File error: ', error);
  };

  File.prototype.remove = function () {
    const self = this;
    return new Ember.RSVP.Promise((resolve, reject) => {
      self.filesystem.root.getFile(self.localName, {
        create: false
      }, fileEntry => {
        fileEntry.remove(() => {
          console.debug(`File: Removed file: ${self.localName}`);
          resolve(fileEntry);
        }, error => {
          self.errorHandler(error);
          reject(error);
        });
      }, error => {
        self.errorHandler(error);
        reject(error);
      });
    });
  };

  File.prototype._reset = function () {
    this.create = true;
    this.filesystem = null;
    this.fileEntry = null;
    this.seek = 0;
  };

  File.prototype._isWebKit = function () {
    return !!window.webkitRequestFileSystem;
  };

  var _default = File;
  _exports.default = _default;
});
;define("sharedrop/services/room", ["exports", "jquery"], function (_exports, _jquery) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  // TODO: use Ember.Object.extend()
  const Room = function (name, firebaseRef) {
    this._ref = firebaseRef;
    this.name = name;
  };

  Room.prototype.join = function (user) {
    const self = this; // Setup Firebase refs

    self._connectionRef = self._ref.child('.info/connected');
    self._roomRef = self._ref.child(`rooms/${this.name}`);
    self._usersRef = self._roomRef.child('users');
    self._userRef = self._usersRef.child(user.uuid);
    console.log('Room:\t Connecting to: ', this.name);

    self._connectionRef.on('value', connectionSnapshot => {
      // Once connected (or reconnected) to Firebase
      if (connectionSnapshot.val() === true) {
        console.log('Firebase: (Re)Connected'); // Remove yourself from the room when disconnected

        self._userRef.onDisconnect().remove(); // Join the room


        self._userRef.set(user, error => {
          if (error) {
            console.warn('Firebase: Adding user to the room failed: ', error);
          } else {
            console.log('Firebase: User added to the room'); // Create a copy of user data,
            // so that deleting properties won't affect the original variable

            _jquery.default.publish('connected.room', _jquery.default.extend(true, {}, user));
          }
        });

        self._usersRef.on('child_added', userAddedSnapshot => {
          const addedUser = userAddedSnapshot.val();
          console.log('Room:\t user_added: ', addedUser);

          _jquery.default.publish('user_added.room', addedUser);
        });

        self._usersRef.on('child_removed', userRemovedSnapshot => {
          const removedUser = userRemovedSnapshot.val();
          console.log('Room:\t user_removed: ', removedUser);

          _jquery.default.publish('user_removed.room', removedUser);
        }, () => {
          // Handle case when the whole room is removed from Firebase
          _jquery.default.publish('disconnected.room');
        });

        self._usersRef.on('child_changed', userChangedSnapshot => {
          const changedUser = userChangedSnapshot.val();
          console.log('Room:\t user_changed: ', changedUser);

          _jquery.default.publish('user_changed.room', changedUser);
        });
      } else {
        console.log('Firebase: Disconnected');

        _jquery.default.publish('disconnected.room');

        self._usersRef.off();
      }
    });

    return this;
  };

  Room.prototype.update = function (attrs) {
    this._userRef.update(attrs);
  };

  Room.prototype.leave = function () {
    this._userRef.remove();

    this._usersRef.off();
  };

  var _default = Room;
  _exports.default = _default;
});
;define("sharedrop/services/web-rtc", ["exports", "jquery", "sharedrop/services/file"], function (_exports, _jquery, _file) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  // TODO:
  // - provide TURN server config once it's possible to create rooms with custom names
  // - use Ember.Object.extend()
  const WebRTC = function (id, options) {
    const defaults = {
      config: {
        iceServers: [{
          urls: 'stun:stun.l.google.com:19302'
        }]
      },
      debug: 3
    };
    this.conn = new window.Peer(id, _jquery.default.extend(defaults, options));
    this.files = {
      outgoing: {},
      incoming: {}
    }; // Listen for incoming connections

    this.conn.on('connection', connection => {
      _jquery.default.publish('incoming_peer_connection.p2p', {
        connection
      });

      connection.on('open', () => {
        console.log('Peer:\t Data channel connection opened: ', connection);

        _jquery.default.publish('incoming_dc_connection.p2p', {
          connection
        });
      });
      connection.on('error', error => {
        console.log('Peer:\t Data channel connection error', error);

        _jquery.default.publish('incoming_dc_connection_error.p2p', {
          connection,
          error
        });
      });

      this._onConnection(connection);
    });
    this.conn.on('close', () => {
      console.log('Peer:\t Connection to server closed.');
    });
    this.conn.on('error', error => {
      console.log('Peer:\t Error while connecting to server: ', error);
    });
  };

  WebRTC.CHUNK_MTU = 16000;
  WebRTC.CHUNKS_PER_ACK = 64;

  WebRTC.prototype.connect = function (id) {
    const connection = this.conn.connect(id, {
      label: 'file',
      reliable: true,
      serialization: 'none' // we handle serialization ourselves

    });
    connection.on('open', () => {
      console.log('Peer:\t Data channel connection opened: ', connection);

      _jquery.default.publish('outgoing_dc_connection.p2p', {
        connection
      });
    });
    connection.on('error', error => {
      console.log('Peer:\t Data channel connection error', error);

      _jquery.default.publish('outgoing_dc_connection_error.p2p', {
        connection,
        error
      });
    });

    _jquery.default.publish('outgoing_peer_connection.p2p', {
      connection
    });

    this._onConnection(connection);
  };

  WebRTC.prototype._onConnection = function (connection) {
    const self = this;
    console.log('Peer:\t Opening data channel connection...', connection);
    connection.on('data', data => {
      // Lame type check
      if (data.byteLength !== undefined) {
        // ArrayBuffer
        self._onBinaryData(data, connection);
      } else {
        // JSON string
        self._onJSONData(JSON.parse(data), connection);
      }
    });
    connection.on('close', () => {
      _jquery.default.publish('disconnected.p2p', {
        connection
      });

      console.log('Peer:\t P2P connection closed: ', connection);
    });
  };

  WebRTC.prototype._onBinaryData = function (data, connection) {
    const self = this;
    const incoming = this.files.incoming[connection.peer];
    const {
      info,
      file,
      block,
      receivedChunkNum
    } = incoming;
    const chunksPerAck = WebRTC.CHUNKS_PER_ACK; // TODO move it after requesting a new block to speed things up

    connection.emit('receiving_progress', (receivedChunkNum + 1) / info.chunksTotal); // console.log('Got chunk no ' + (receivedChunkNum + 1) + ' out of ' + info.chunksTotal);

    block.push(data);
    incoming.receivedChunkNum = receivedChunkNum + 1;
    const nextChunkNum = incoming.receivedChunkNum;
    const lastChunkInFile = receivedChunkNum === info.chunksTotal - 1;
    const lastChunkInBlock = receivedChunkNum > 0 && (receivedChunkNum + 1) % chunksPerAck === 0;

    if (lastChunkInFile || lastChunkInBlock) {
      file.append(block).then(() => {
        if (lastChunkInFile) {
          file.save();

          _jquery.default.publish('file_received.p2p', {
            blob: file,
            info,
            connection
          });
        } else {
          // console.log('Requesting block starting at: ' + (nextChunkNum));
          incoming.block = [];

          self._requestFileBlock(connection, nextChunkNum);
        }
      });
    }
  };

  WebRTC.prototype._onJSONData = function (data, connection) {
    switch (data.type) {
      case 'info':
        {
          const info = data.payload;

          _jquery.default.publish('info.p2p', {
            connection,
            info
          }); // Store incoming file info for later


          this.files.incoming[connection.peer] = {
            info,
            file: null,
            block: [],
            receivedChunkNum: 0
          };
          console.log('Peer:\t File info: ', data);
          break;
        }

      case 'cancel':
        {
          _jquery.default.publish('file_canceled.p2p', {
            connection
          });

          console.log('Peer:\t Sender canceled file transfer');
          break;
        }

      case 'response':
        {
          const response = data.payload; // If recipient rejected the file, delete stored file

          if (!response) {
            delete this.files.outgoing[connection.peer];
          }

          _jquery.default.publish('response.p2p', {
            connection,
            response
          });

          console.log('Peer:\t File response: ', data);
          break;
        }

      case 'block_request':
        {
          const {
            file
          } = this.files.outgoing[connection.peer]; // console.log('Peer:\t Block request: ', data.payload);

          this._sendBlock(connection, file, data.payload);

          break;
        }

      default:
        console.log('Peer:\t Unknown message: ', data);
    }
  };

  WebRTC.prototype.getFileInfo = function (file) {
    return {
      lastModifiedDate: file.lastModifiedDate,
      name: file.name,
      size: file.size,
      type: file.type,
      chunksTotal: Math.ceil(file.size / WebRTC.CHUNK_MTU)
    };
  };

  WebRTC.prototype.sendFileInfo = function (connection, info) {
    const message = {
      type: 'info',
      payload: info
    };
    connection.send(JSON.stringify(message));
  };

  WebRTC.prototype.sendCancelRequest = function (connection) {
    const message = {
      type: 'cancel'
    };
    connection.send(JSON.stringify(message));
  };

  WebRTC.prototype.sendFileResponse = function (connection, response) {
    const message = {
      type: 'response',
      payload: response
    };

    if (response) {
      // If recipient accepted the file, request required space to store the file on HTML5 filesystem
      const incoming = this.files.incoming[connection.peer];
      const {
        info
      } = incoming;
      new _file.default({
        name: info.name,
        size: info.size,
        type: info.type
      }).then(file => {
        incoming.file = file;
        connection.send(JSON.stringify(message));
      });
    } else {
      // Otherwise, delete stored file info
      delete this.files.incoming[connection.peer];
      connection.send(JSON.stringify(message));
    }
  };

  WebRTC.prototype.sendFile = function (connection, file) {
    // Save the file for later
    this.files.outgoing[connection.peer] = {
      file,
      info: this.getFileInfo(file)
    }; // Send the first block. Next ones will be requested by recipient.

    this._sendBlock(connection, file, 0);
  };

  WebRTC.prototype._requestFileBlock = function (connection, chunkNum) {
    const message = {
      type: 'block_request',
      payload: chunkNum
    };
    connection.send(JSON.stringify(message));
  };

  WebRTC.prototype._sendBlock = function (connection, file, beginChunkNum) {
    const {
      info
    } = this.files.outgoing[connection.peer];
    const chunkSize = WebRTC.CHUNK_MTU;
    const chunksPerAck = WebRTC.CHUNKS_PER_ACK;
    const remainingChunks = info.chunksTotal - beginChunkNum;
    const chunksToSend = Math.min(remainingChunks, chunksPerAck);
    const endChunkNum = beginChunkNum + chunksToSend - 1;
    const blockBegin = beginChunkNum * chunkSize;
    const blockEnd = endChunkNum * chunkSize + chunkSize;
    const reader = new FileReader();
    let chunkNum; // Read the whole block from file

    const blockBlob = file.slice(blockBegin, blockEnd); // console.log('Sending block: start chunk: ' + beginChunkNum + ' end chunk: ' + endChunkNum);
    // console.log('Sending block: start byte : ' + begin + ' end byte : ' + end);

    reader.onload = function (event) {
      if (reader.readyState === FileReader.DONE) {
        const blockBuffer = event.target.result;

        for (chunkNum = beginChunkNum; chunkNum < endChunkNum + 1; chunkNum += 1) {
          // Send each chunk (begin index is inclusive, end index is exclusive)
          const bufferBegin = chunkNum % chunksPerAck * chunkSize;
          const bufferEnd = Math.min(bufferBegin + chunkSize, blockBuffer.byteLength);
          const chunkBuffer = blockBuffer.slice(bufferBegin, bufferEnd);
          connection.send(chunkBuffer); // console.log('Sent chunk: start byte: ' + begin + ' end byte: ' + end + ' length: ' + chunkBuffer.byteLength);
          // console.log('Sent chunk no ' + (chunkNum + 1) + ' out of ' + info.chunksTotal);

          connection.emit('sending_progress', (chunkNum + 1) / info.chunksTotal);
        }

        if (endChunkNum === info.chunksTotal - 1) {
          _jquery.default.publish('file_sent.p2p', {
            connection
          });
        }
      }
    };

    reader.readAsArrayBuffer(blockBlob);
  };

  var _default = WebRTC;
  _exports.default = _default;
});
;define("sharedrop/templates/about-app", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "lKrtHzKO",
    "block": "{\"symbols\":[],\"statements\":[[6,[37,2],null,[[\"onClose\"],[[30,[36,0],[[32,0],\"closeModal\"],[[\"target\"],[[35,1]]]]]],[[\"default\"],[{\"statements\":[[2,\"  \"],[10,\"h2\"],[14,0,\"logo\"],[12],[10,\"span\"],[12],[2,\"ShareDrop\"],[13],[13],[2,\"\\n  \"],[10,\"h3\"],[12],[2,\"What is it?\"],[13],[2,\"\\n  \"],[10,\"p\"],[12],[2,\"\\n    ShareDrop is a free app that allows you to easily and securely share files directly between devices without having to upload them to any server first.\\n  \"],[13],[2,\"\\n\\n  \"],[10,\"h3\"],[12],[2,\"How to use it?\"],[13],[2,\"\\n  \"],[10,\"h4\"],[12],[2,\"Sharing files between devices in local network\"],[10,\"sup\"],[12],[2,\"*\"],[13],[13],[2,\"\\n  \"],[10,\"p\"],[12],[2,\"\\n    To send a file to another device in the same local network, open this page (i.e. \"],[10,\"a\"],[14,6,\"https://www.sharedrop.io\"],[12],[2,\"www.sharedrop.io\"],[13],[2,\") on both devices. Drag and drop a file directly on other person's avatar or click the avatar and select the file you want to send. The file transfer will start once the recipient accepts the file.\\n  \"],[13],[2,\"\\n\\n  \"],[10,\"h4\"],[12],[2,\"Sharing files between devices in different networks\"],[13],[2,\"\\n  \"],[10,\"p\"],[12],[2,\"\\n    To send a file to another device in a different network, click \"],[10,\"span\"],[14,0,\"plus-icon\"],[12],[2,\"+\"],[13],[2,\" button in the upper right corner of the page and follow futher instructions.\\n  \"],[13],[2,\"\\n\\n  \"],[10,\"h3\"],[12],[2,\"Feedback\"],[13],[2,\"\\n  \"],[10,\"p\"],[12],[2,\"\\n    Got a problem with using ShareDrop, suggestion how to improve it or just want to say hi? Send an email to \"],[10,\"a\"],[14,6,\"mailto:support@sharedrop.io\"],[12],[2,\"support@sharedrop.io\"],[13],[2,\" or report an issue on \"],[10,\"a\"],[14,6,\"https://github.com/szimek/sharedrop/issues\"],[12],[2,\"GitHub\"],[13],[2,\".\\n  \"],[13],[2,\"\\n\\n  \"],[10,\"div\"],[14,0,\"actions\"],[12],[2,\"\\n    \"],[11,\"button\"],[24,4,\"button\"],[4,[38,0],[[32,0],\"closeModal\"],null],[12],[2,\"Got it!\"],[13],[2,\"\\n    \"],[10,\"p\"],[14,0,\"note\"],[12],[10,\"sup\"],[12],[2,\"*\"],[13],[2,\"Devices need to have the same \"],[10,\"a\"],[14,6,\"https://www.google.com/search?q=what+is+my+ip\"],[14,\"target\",\"_blank\"],[14,\"rel\",\"noopener noreferrer\"],[12],[2,\"public IP\"],[13],[2,\" to see each other.\"],[13],[2,\"\\n  \"],[13],[2,\"\\n\"]],\"parameters\":[]}]]]],\"hasEval\":false,\"upvars\":[\"action\",\"currentRoute\",\"modal-dialog\"]}",
    "meta": {
      "moduleName": "sharedrop/templates/about-app.hbs"
    }
  });

  _exports.default = _default;
});
;define("sharedrop/templates/about-room", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "djFMSDWt",
    "block": "{\"symbols\":[],\"statements\":[[6,[37,5],null,[[\"onClose\"],[[30,[36,3],[[32,0],\"closeModal\"],[[\"target\"],[[35,4]]]]]],[[\"default\"],[{\"statements\":[[2,\"  \"],[10,\"h2\"],[14,0,\"logo\"],[12],[10,\"span\"],[12],[2,\"ShareDrop\"],[13],[13],[2,\"\\n  \"],[10,\"h3\"],[12],[2,\"Share files between devices in different networks\"],[13],[2,\"\\n\\n  \"],[10,\"p\"],[12],[2,\"\\n    Copy provided address and send it to the other person...\\n  \"],[13],[2,\"\\n\\n  \"],[10,\"p\"],[12],[2,\"\\n    \"],[1,[30,[36,1],null,[[\"value\",\"readonly\",\"style\"],[[35,0],\"readonly\",\"display: block; margin: auto;\"]]]],[2,\"\\n  \"],[13],[2,\"\\n\\n  \"],[10,\"p\"],[12],[2,\"\\n    Or you can scan it on the other device.\\n  \"],[13],[2,\"\\n\\n\\n  \"],[10,\"p\"],[14,0,\"qr-code\"],[12],[2,\"\\n    \"],[1,[30,[36,2],null,[[\"text\"],[[35,0]]]]],[2,\"\\n  \"],[13],[2,\"\\n\\n  \"],[10,\"p\"],[12],[2,\"\\n    Once the other person open this page in a browser, you'll see each other's avatars.\\n  \"],[13],[2,\"\\n\\n  \"],[10,\"p\"],[12],[2,\"\\n    Drag and drop a file directly on other person's avatar or click the avatar and select the file you want to send. The file transfer will start once the recipient accepts the file.\\n  \"],[13],[2,\"\\n\\n  \"],[10,\"div\"],[14,0,\"actions\"],[12],[2,\"\\n    \"],[11,\"button\"],[24,4,\"button\"],[4,[38,3],[[32,0],\"closeModal\"],null],[12],[2,\"Got it!\"],[13],[2,\"\\n  \"],[13],[2,\"\\n\"]],\"parameters\":[]}]]]],\"hasEval\":false,\"upvars\":[\"currentUrl\",\"room-url\",\"qr-code\",\"action\",\"currentRoute\",\"modal-dialog\"]}",
    "meta": {
      "moduleName": "sharedrop/templates/about-room.hbs"
    }
  });

  _exports.default = _default;
});
;define("sharedrop/templates/about-you", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "r59cfOCB",
    "block": "{\"symbols\":[],\"statements\":[[2,\"ShareDrop lets you share files with others.\\nOther people will see you as \"],[10,\"b\"],[12],[1,[35,0,[\"label\"]]],[13],[2,\".\"]],\"hasEval\":false,\"upvars\":[\"you\"]}",
    "meta": {
      "moduleName": "sharedrop/templates/about-you.hbs"
    }
  });

  _exports.default = _default;
});
;define("sharedrop/templates/application", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "hjDh/Kf3",
    "block": "{\"symbols\":[],\"statements\":[[10,\"header\"],[14,0,\"l-header\"],[12],[2,\"\\n  \"],[10,\"nav\"],[14,0,\"navbar\"],[12],[2,\"\\n    \"],[10,\"h1\"],[14,0,\"logo\"],[12],[2,\"\\n      \"],[10,\"span\"],[14,0,\"logo-title\"],[12],[2,\"ShareDrop\"],[13],[2,\"\\n      \"],[10,\"span\"],[14,0,\"logo-subtitle\"],[12],[2,\"P2P file transfer\"],[13],[2,\"\\n    \"],[13],[2,\"\\n\\n    \"],[10,\"ul\"],[14,0,\"nav\"],[12],[2,\"\\n      \"],[10,\"li\"],[12],[2,\"\\n        \"],[11,\"a\"],[24,6,\"javascript:void(0)\"],[24,0,\"icon-create-room\"],[24,\"title\",\"Create a room. You'll leave the room you're currently in.\"],[4,[38,0],[[32,0],\"redirect\"],null],[12],[2,\"+\"],[13],[2,\"\\n      \"],[13],[2,\"\\n      \"],[10,\"li\"],[12],[2,\"\\n        \"],[11,\"a\"],[24,6,\"javascript:void(0)\"],[24,0,\"icon-help\"],[24,\"title\",\"About\"],[4,[38,0],[[32,0],\"openModal\",\"about_app\"],null],[12],[2,\"?\"],[13],[2,\"\\n      \"],[13],[2,\"\\n    \"],[13],[2,\"\\n  \"],[13],[2,\"\\n\"],[13],[2,\"\\n\\n\"],[1,[30,[36,2],[[30,[36,1],null,null]],null]],[2,\"\\n\"],[1,[30,[36,2],[[30,[36,1],[\"modal\"],null]],null]],[2,\"\\n\\n\"],[10,\"footer\"],[14,0,\"l-footer\"],[12],[2,\"\\n  \"],[10,\"p\"],[14,0,\"about\"],[12],[1,[30,[36,2],[[30,[36,1],[\"about_you\"],null]],null]],[13],[2,\"\\n\\n  \"],[10,\"div\"],[14,0,\"logos\"],[12],[2,\"\\n    \"],[10,\"div\"],[14,0,\"left\"],[12],[2,\"\\n      \"],[10,\"a\"],[14,6,\"https://github.com/szimek/sharedrop\"],[14,0,\"github\"],[14,\"target\",\"_blank\"],[14,\"rel\",\"noopener noreferrer\"],[12],[10,\"span\"],[12],[2,\"Github\"],[13],[13],[2,\"\\n      \"],[10,\"iframe\"],[14,\"title\",\"twitter\"],[14,\"loading\",\"lazy\"],[14,0,\"twitter\"],[14,\"src\",\"https://platform.twitter.com/widgets/tweet_button.html?url=https%3A%2F%2Fwww.sharedrop.io&text=ShareDrop%20%E2%80%93%20easily%20and%20securely%20share%20files%20of%20any%20size%20directly%20between%20devices%20using%20your%20browser&count=none\"],[14,\"scrolling\",\"no\"],[14,\"frameborder\",\"0\"],[14,\"allowtransparency\",\"true\"],[12],[13],[2,\"\\n    \"],[13],[2,\"\\n    \"],[10,\"div\"],[14,0,\"right\"],[12],[2,\"\\n      \"],[10,\"a\"],[14,6,\"http://www.webrtc.org/\"],[14,0,\"webrtc\"],[14,\"target\",\"_blank\"],[14,\"rel\",\"noopener noreferrer\"],[12],[10,\"span\"],[12],[2,\"WebRTC\"],[13],[13],[2,\"\\n    \"],[13],[2,\"\\n  \"],[13],[2,\"\\n\"],[13],[2,\"\\n\"]],\"hasEval\":false,\"upvars\":[\"action\",\"-outlet\",\"component\"]}",
    "meta": {
      "moduleName": "sharedrop/templates/application.hbs"
    }
  });

  _exports.default = _default;
});
;define("sharedrop/templates/components/modal-dialog", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "rkjkC5ah",
    "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,\"div\"],[24,0,\"modal-overlay\"],[4,[38,0],[[32,0],\"close\"],null],[12],[13],[2,\"\\n\"],[10,\"div\"],[14,0,\"modal-body\"],[12],[2,\"\\n  \"],[18,1,null],[2,\"\\n\"],[13],[2,\"\\n\"]],\"hasEval\":false,\"upvars\":[\"action\"]}",
    "meta": {
      "moduleName": "sharedrop/templates/components/modal-dialog.hbs"
    }
  });

  _exports.default = _default;
});
;define("sharedrop/templates/components/peer-widget", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "GCruPtYQ",
    "block": "{\"symbols\":[],\"statements\":[[6,[37,1],[[35,9]],null,[[\"default\"],[{\"statements\":[[6,[37,7],null,[[\"onConfirm\",\"onCancel\",\"confirmButtonLabel\",\"cancelButtonLabel\",\"filename\"],[[30,[36,6],[[32,0],\"sendFileTransferInquiry\"],null],[30,[36,6],[[32,0],\"cancelFileTransfer\"],null],\"Send\",\"Cancel\",[35,5]]],[[\"default\"],[{\"statements\":[[2,\"    Do you want to send \"],[10,\"strong\"],[12],[2,\"\\\"\"],[1,[34,5]],[2,\"\\\"\"],[13],[2,\" to \"],[10,\"strong\"],[12],[2,\"\\\"\"],[1,[34,4]],[2,\"\\\"\"],[13],[2,\"?\\n\"]],\"parameters\":[]}]]]],\"parameters\":[]}]]],[2,\"\\n\"],[6,[37,1],[[35,10]],null,[[\"default\"],[{\"statements\":[[6,[37,7],null,[[\"onCancel\",\"cancelButtonLabel\",\"filename\"],[[30,[36,6],[[32,0],\"abortFileTransfer\"],null],\"Cancel\",[35,5]]],[[\"default\"],[{\"statements\":[[2,\"    Waiting for \"],[10,\"strong\"],[12],[2,\"\\\"\"],[1,[34,4]],[2,\"\\\"\"],[13],[2,\" to accept…\\n\"]],\"parameters\":[]}]]]],\"parameters\":[]}]]],[2,\"\\n\"],[6,[37,1],[[35,11]],null,[[\"default\"],[{\"statements\":[[6,[37,7],null,[[\"onConfirm\",\"confirmButtonLabel\",\"filename\"],[[30,[36,6],[[32,0],\"cancelFileTransfer\"],null],\"Ok\",[35,5]]],[[\"default\"],[{\"statements\":[[2,\"    \"],[10,\"strong\"],[12],[2,\"\\\"\"],[1,[34,4]],[2,\"\\\"\"],[13],[2,\" has declined your request.\\n\"]],\"parameters\":[]}]]]],\"parameters\":[]}]]],[2,\"\\n\"],[6,[37,1],[[35,12]],null,[[\"default\"],[{\"statements\":[[6,[37,7],null,[[\"onConfirm\",\"confirmButtonLabel\",\"filename\"],[[30,[36,6],[[32,0],\"cancelFileTransfer\"],null],\"Ok\",[35,5]]],[[\"default\"],[{\"statements\":[[2,\"    \"],[19,[35,8],[]],[2,\"\\n\"]],\"parameters\":[]}]]]],\"parameters\":[]}]]],[2,\"\\n\"],[6,[37,1],[[35,13]],null,[[\"default\"],[{\"statements\":[[6,[37,7],null,[[\"onConfirm\",\"onCancel\",\"confirmButtonLabel\",\"cancelButtonLabel\",\"filename\"],[[30,[36,6],[[32,0],\"acceptFileTransfer\"],null],[30,[36,6],[[32,0],\"rejectFileTransfer\"],null],\"Save\",\"Decline\",[35,5]]],[[\"default\"],[{\"statements\":[[2,\"    \"],[10,\"strong\"],[12],[2,\"\\\"\"],[1,[34,4]],[2,\"\\\"\"],[13],[2,\" wants to send you \"],[10,\"strong\"],[12],[2,\"\\\"\"],[1,[34,5]],[2,\"\\\"\"],[13],[2,\".\\n\"]],\"parameters\":[]}]]]],\"parameters\":[]}]]],[2,\"\\n\"],[10,\"div\"],[14,0,\"avatar\"],[12],[2,\"\\n\"],[6,[37,1],[[35,14]],null,[[\"default\",\"else\"],[{\"statements\":[[2,\"    \"],[8,\"circular-progress\",[],[[\"@value\",\"@color\"],[[34,3,[\"bundlingProgress\"]],\"orange\"]],null],[2,\"\\n\"]],\"parameters\":[]},{\"statements\":[[6,[37,1],[[35,3,[\"transfer\"]]],null,[[\"default\"],[{\"statements\":[[6,[37,1],[[35,3,[\"transfer\",\"receivingProgress\"]]],null,[[\"default\",\"else\"],[{\"statements\":[[2,\"      \"],[8,\"circular-progress\",[],[[\"@value\",\"@color\"],[[34,3,[\"transfer\",\"receivingProgress\"]],\"blue\"]],null],[2,\"\\n\"]],\"parameters\":[]},{\"statements\":[[6,[37,1],[[35,3,[\"transfer\",\"sendingProgress\"]]],null,[[\"default\"],[{\"statements\":[[2,\"      \"],[8,\"circular-progress\",[],[[\"@value\",\"@color\"],[[34,3,[\"transfer\",\"sendingProgress\"]],\"blue\"]],null],[2,\"\\n    \"]],\"parameters\":[]}]]]],\"parameters\":[]}]]],[2,\"  \"]],\"parameters\":[]}]]]],\"parameters\":[]}]]],[2,\"\\n  \"],[1,[30,[36,15],null,[[\"peer\",\"onFileDrop\"],[[35,3],[30,[36,6],[[32,0],\"uploadFile\"],null]]]]],[2,\"\\n\"],[13],[2,\"\\n\\n\"],[10,\"div\"],[14,0,\"user-info\"],[12],[2,\"\\n  \"],[10,\"div\"],[14,0,\"user-ip\"],[12],[2,\"\\n    \"],[10,\"div\"],[15,0,[31,[\"user-connection-status \",[34,3,[\"peer\",\"state\"]]]]],[12],[13],[2,\"\\n    \"],[10,\"span\"],[12],[1,[35,3,[\"label\"]]],[13],[2,\"\\n\\n\"],[6,[37,1],[[35,14]],null,[[\"default\",\"else\"],[{\"statements\":[[2,\"      \"],[10,\"div\"],[12],[2,\"\\n        Bundling files...\\n        \"],[10,\"br\"],[12],[13],[10,\"br\"],[12],[13],[2,\"\\n        TIP: You can archive files on your device beforehand to speed up the operation\\n      \"],[13],[2,\"\\n\"]],\"parameters\":[]},{\"statements\":[[6,[37,1],[[35,2]],null,[[\"default\",\"else\"],[{\"statements\":[[2,\"      \"],[10,\"div\"],[12],[2,\"Receiving file...\"],[13],[2,\"\\n\"]],\"parameters\":[]},{\"statements\":[[6,[37,1],[[35,0]],null,[[\"default\"],[{\"statements\":[[2,\"      \"],[10,\"div\"],[12],[2,\"Sending file...\"],[13],[2,\"\\n    \"]],\"parameters\":[]}]]]],\"parameters\":[]}]]]],\"parameters\":[]}]]],[2,\"  \"],[13],[2,\"\\n\"],[13],[2,\"\\n\\n\"],[1,[30,[36,16],null,[[\"multiple\",\"onChange\"],[true,[30,[36,6],[[32,0],\"uploadFile\"],null]]]]]],\"hasEval\":true,\"upvars\":[\"isSendingFile\",\"if\",\"isReceivingFile\",\"peer\",\"label\",\"filename\",\"action\",\"popover-confirm\",\"errorTemplateName\",\"hasSelectedFile\",\"isAwaitingResponse\",\"hasDeclinedFileTransfer\",\"hasError\",\"hasReceivedFileInfo\",\"isPreparingFileTransfer\",\"peer-avatar\",\"file-field\"]}",
    "meta": {
      "moduleName": "sharedrop/templates/components/peer-widget.hbs"
    }
  });

  _exports.default = _default;
});
;define("sharedrop/templates/components/popover-confirm", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "+sbXHwlo",
    "block": "{\"symbols\":[\"&default\"],\"statements\":[[10,\"div\"],[14,0,\"popover\"],[12],[2,\"\\n  \"],[10,\"div\"],[14,0,\"popover-body\"],[12],[2,\"\\n    \"],[10,\"div\"],[14,0,\"popover-icon\"],[12],[2,\"\\n      \"],[10,\"i\"],[15,0,[34,3]],[12],[13],[2,\"\\n    \"],[13],[2,\"\\n\\n    \"],[10,\"p\"],[12],[18,1,null],[13],[2,\"\\n  \"],[13],[2,\"\\n\\n  \"],[10,\"div\"],[14,0,\"popover-buttons\"],[12],[2,\"\\n\"],[6,[37,4],[[35,2]],null,[[\"default\"],[{\"statements\":[[2,\"      \"],[11,\"button\"],[24,4,\"button\"],[4,[38,0],[[32,0],\"cancel\"],null],[12],[1,[34,2]],[13],[2,\"\\n\"]],\"parameters\":[]}]]],[2,\"\\n\"],[6,[37,4],[[35,1]],null,[[\"default\"],[{\"statements\":[[2,\"      \"],[11,\"button\"],[24,4,\"button\"],[4,[38,0],[[32,0],\"confirm\"],null],[12],[1,[34,1]],[13],[2,\"\\n\"]],\"parameters\":[]}]]],[2,\"  \"],[13],[2,\"\\n\"],[13],[2,\"\\n\\n\"]],\"hasEval\":false,\"upvars\":[\"action\",\"confirmButtonLabel\",\"cancelButtonLabel\",\"iconClass\",\"if\"]}",
    "meta": {
      "moduleName": "sharedrop/templates/components/popover-confirm.hbs"
    }
  });

  _exports.default = _default;
});
;define("sharedrop/templates/components/user-widget", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "7/SMpfeH",
    "block": "{\"symbols\":[],\"statements\":[[10,\"div\"],[14,0,\"avatar\"],[12],[2,\"\\n  \"],[10,\"img\"],[14,0,\"gravatar\"],[15,\"src\",[34,0,[\"avatarUrl\"]]],[15,\"alt\",[34,1,[\"label\"]]],[15,\"title\",[31,[\"peer id: \",[34,0,[\"uuid\"]]]]],[12],[13],[2,\"\\n\"],[13],[2,\"\\n\"],[10,\"div\"],[14,0,\"user-info\"],[12],[2,\"\\n  \"],[10,\"div\"],[14,0,\"user-label\"],[12],[2,\"You\"],[13],[2,\"\\n  \"],[10,\"div\"],[14,0,\"user-ip\"],[12],[2,\"\\n    \"],[10,\"span\"],[12],[1,[35,0,[\"label\"]]],[13],[2,\"\\n  \"],[13],[2,\"\\n\"],[13],[2,\"\\n\"]],\"hasEval\":false,\"upvars\":[\"user\",\"users\"]}",
    "meta": {
      "moduleName": "sharedrop/templates/components/user-widget.hbs"
    }
  });

  _exports.default = _default;
});
;define("sharedrop/templates/errors/browser-unsupported", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "Za00Hs1z",
    "block": "{\"symbols\":[],\"statements\":[[10,\"div\"],[14,0,\"error\"],[12],[2,\"\\n  \"],[10,\"p\"],[12],[2,\"We're really sorry, but your browser is not supported.\"],[10,\"br\"],[12],[13],[2,\"Please use the latest desktop or Android version of\"],[10,\"br\"],[12],[13],[10,\"b\"],[12],[2,\"Chrome\"],[13],[2,\", \"],[10,\"b\"],[12],[2,\"Opera\"],[13],[2,\" or \"],[10,\"b\"],[12],[2,\"Firefox\"],[13],[2,\".\"],[13],[2,\"\\n\"],[13],[2,\"\\n\"]],\"hasEval\":false,\"upvars\":[]}",
    "meta": {
      "moduleName": "sharedrop/templates/errors/browser-unsupported.hbs"
    }
  });

  _exports.default = _default;
});
;define("sharedrop/templates/errors/filesystem-unavailable", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "t01tsazA",
    "block": "{\"symbols\":[],\"statements\":[[10,\"div\"],[14,0,\"error\"],[12],[2,\"\\n  \"],[10,\"p\"],[12],[2,\"Uh oh. Looks like there's some issue and we won't be able\"],[10,\"br\"],[12],[13],[2,\"to save your files.\"],[13],[2,\"\\n  \"],[10,\"p\"],[12],[2,\"If you've opened this app in incognito/private window,\"],[10,\"br\"],[12],[13],[2,\"try again in a normal one.\"],[13],[2,\"\\n\"],[13],[2,\"\\n\"]],\"hasEval\":false,\"upvars\":[]}",
    "meta": {
      "moduleName": "sharedrop/templates/errors/filesystem-unavailable.hbs"
    }
  });

  _exports.default = _default;
});
;define("sharedrop/templates/errors/popovers/connection-failed", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "G3G10YD7",
    "block": "{\"symbols\":[],\"statements\":[[2,\"It was not possible to establish direct connection with the other peer.\\n\"]],\"hasEval\":false,\"upvars\":[]}",
    "meta": {
      "moduleName": "sharedrop/templates/errors/popovers/connection-failed.hbs"
    }
  });

  _exports.default = _default;
});
;define("sharedrop/templates/errors/popovers/multiple-files", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "ycMD5lMo",
    "block": "{\"symbols\":[],\"statements\":[[2,\"The files you have selected exceed the maximum allowed size of 200MB\\n\"],[10,\"br\"],[12],[13],[10,\"br\"],[12],[13],[2,\"\\nTIP: You can send single files without size restriction\\n\"]],\"hasEval\":false,\"upvars\":[]}",
    "meta": {
      "moduleName": "sharedrop/templates/errors/popovers/multiple-files.hbs"
    }
  });

  _exports.default = _default;
});
;define("sharedrop/templates/index", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "NIu73Iwu",
    "block": "{\"symbols\":[\"peer\"],\"statements\":[[10,\"main\"],[14,0,\"l-content\"],[12],[2,\"\\n  \"],[10,\"div\"],[14,0,\"user others\"],[12],[2,\"\\n\"],[6,[37,7],[[30,[36,6],[[30,[36,6],[[35,5]],null]],null]],null,[[\"default\"],[{\"statements\":[[2,\"      \"],[1,[30,[36,4],null,[[\"peer\",\"hasCustomRoomName\",\"webrtc\"],[[32,1],[35,3],[35,2]]]]],[2,\"\\n\"]],\"parameters\":[1]}]]],[2,\"  \"],[13],[2,\"\\n\\n\"],[6,[37,8],[[35,0,[\"uuid\"]]],null,[[\"default\"],[{\"statements\":[[2,\"    \"],[10,\"div\"],[14,0,\"user you\"],[12],[2,\"\\n      \"],[1,[30,[36,1],null,[[\"user\"],[[35,0]]]]],[2,\"\\n    \"],[13],[2,\"\\n\"]],\"parameters\":[]}]]],[2,\"\\n  \"],[10,\"svg\"],[14,0,\"circles\"],[14,\"viewBox\",\"-0.5 -0.5 1140 700\"],[12],[2,\"\\n    \"],[10,\"circle\"],[14,0,\"circle\"],[14,\"cx\",\"570\"],[14,\"cy\",\"570\"],[14,\"r\",\"30\"],[14,\"stroke\",\"rgba(160,160,160, 1)\"],[12],[13],[2,\"\\n    \"],[10,\"circle\"],[14,0,\"circle\"],[14,\"cx\",\"570\"],[14,\"cy\",\"570\"],[14,\"r\",\"100\"],[14,\"stroke\",\"rgba(160,160,160,.9)\"],[12],[13],[2,\"\\n    \"],[10,\"circle\"],[14,0,\"circle\"],[14,\"cx\",\"570\"],[14,\"cy\",\"570\"],[14,\"r\",\"200\"],[14,\"stroke\",\"rgba(160,160,160,.8)\"],[12],[13],[2,\"\\n    \"],[10,\"circle\"],[14,0,\"circle\"],[14,\"cx\",\"570\"],[14,\"cy\",\"570\"],[14,\"r\",\"300\"],[14,\"stroke\",\"rgba(160,160,160,.7)\"],[12],[13],[2,\"\\n    \"],[10,\"circle\"],[14,0,\"circle\"],[14,\"cx\",\"570\"],[14,\"cy\",\"570\"],[14,\"r\",\"400\"],[14,\"stroke\",\"rgba(160,160,160,.6)\"],[12],[13],[2,\"\\n    \"],[10,\"circle\"],[14,0,\"circle\"],[14,\"cx\",\"570\"],[14,\"cy\",\"570\"],[14,\"r\",\"500\"],[14,\"stroke\",\"rgba(160,160,160,.5)\"],[12],[13],[2,\"\\n  \"],[13],[2,\"\\n\"],[13],[2,\"\\n\"]],\"hasEval\":false,\"upvars\":[\"you\",\"user-widget\",\"webrtc\",\"hasCustomRoomName\",\"peer-widget\",\"model\",\"-track-array\",\"each\",\"if\"]}",
    "meta": {
      "moduleName": "sharedrop/templates/index.hbs"
    }
  });

  _exports.default = _default;
});
;

;define('sharedrop/config/environment', [], function() {
  var prefix = 'sharedrop';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(decodeURIComponent(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

;
          if (!runningTests) {
            require("sharedrop/app")["default"].create({"name":"sharedrop","version":"1.0.0"});
          }
        
//# sourceMappingURL=sharedrop.map
