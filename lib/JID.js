'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _punycode = require('punycode');

var _punycode2 = _interopRequireDefault(_punycode);

var JID = (function () {
    function JID(a, b, c) {
        var _this = this;

        _classCallCheck(this, JID);

        this._local = '';
        this._domain = '';
        this.resource = '';

        this.toString = function (unescape) {
            return unescape ? _this.unescapedFull : _this.full;
        };

        this.toJSON = function () {
            return _this.full;
        };

        if (a && !b && !c) {
            if (typeof a === 'string') {
                this.parseJID(a);
            } else if (a instanceof JID) {
                _Object$assign(this, a);
            } else {
                throw new Error('Argument error');
            }
        } else if (b) {
            this.local = a;
            this.domain = b;
            this.resource = c;
        }
    }

    _createClass(JID, [{
        key: 'parseJID',
        value: function parseJID(s) {
            if (s.includes('/')) {
                this.resource = s.substr(s.indexOf('/') + 1);
                s = s.substr(0, s.indexOf('/'));
            }

            if (s.includes('@')) {
                this.local = s.substr(0, s.lastIndexOf('@'));
                s = s.substr(s.lastIndexOf('@') + 1);
            }

            this.domain = s;
        }
    }, {
        key: 'equals',
        value: function equals(other) {
            return this.local === other.local && this.domain === other.domain && this.resource === other.resource;
        }
    }, {
        key: 'detectEscape',
        value: function detectEscape(local) {
            if (!local) {
                return false;
            }

            var tmp = local.replace(/\\20/g, '').replace(/\\22/g, '').replace(/\\26/g, '').replace(/\\27/g, '').replace(/\\2f/g, '').replace(/\\3a/g, '').replace(/\\3c/g, '').replace(/\\3e/g, '').replace(/\\40/g, '').replace(/\\5c/g, '');

            var search = tmp.search(/\\| |\"|\&|\'|\/|:|<|>|@/g);

            if (search === -1) {
                return false;
            } else {
                return true;
            }
        }
    }, {
        key: 'escapeLocal',
        value: function escapeLocal(local) {
            if (local === null) {
                return null;
            }

            return local.replace(/^\s+|\s+$/g, '').replace(/\\5c/g, '\\5c5c').replace(/\\20/g, '\\5c20').replace(/\\22/g, '\\5c22').replace(/\\26/g, '\\5c26').replace(/\\27/g, '\\5c27').replace(/\\2f/g, '\\5c2f').replace(/\\3a/g, '\\5c3a').replace(/\\3c/g, '\\5c3c').replace(/\\3e/g, '\\5c3e').replace(/\\40/g, '\\5c40').replace(/ /g, '\\20').replace(/\"/g, '\\22').replace(/\&/g, '\\26').replace(/\'/g, '\\27').replace(/\//g, '\\2f').replace(/:/g, '\\3a').replace(/</g, '\\3c').replace(/>/g, '\\3e').replace(/@/g, '\\40');
        }
    }, {
        key: 'unescapeLocal',
        value: function unescapeLocal(local) {
            if (local === null) {
                return null;
            }

            return local.replace(/\\20/g, ' ').replace(/\\22/g, '"').replace(/\\26/g, '&').replace(/\\27/g, '\'').replace(/\\2f/g, '/').replace(/\\3a/g, ':').replace(/\\3c/g, '<').replace(/\\3e/g, '>').replace(/\\40/g, '@').replace(/\\5c/g, '\\');
        }
    }, {
        key: 'unescapedFull',
        get: function get() {
            var s = this.domain;

            if (this.local) {
                s = this.unescapedLocal + '@' + s;
            }
            if (this.resource) {
                s = s + '/' + this.resource;
            }

            return s;
        }
    }, {
        key: 'full',
        get: function get() {
            var s = this.domain;

            if (this.local) {
                s = this.local + '@' + s;
            }
            if (this.resource) {
                s = s + '/' + this.resource;
            }

            return s;
        }
    }, {
        key: 'bare',
        get: function get() {
            if (this.resource) {
                return new JID(this.local, this.domain).full;
            } else {
                return this.full;
            }
        }
    }, {
        key: 'unescapedBare',
        get: function get() {
            if (this.resource) {
                return new JID(this.local, this.domain).unescapedFull;
            } else {
                return this.unescapedFull;
            }
        }
    }, {
        key: 'unescapedLocal',
        get: function get() {
            return this.unescapeLocal(this._local);
        }
    }, {
        key: 'local',
        get: function get() {
            return this._local;
        },
        set: function set(local) {
            var escape = this.detectEscape(local);

            if (escape) {
                local = this.escapeLocal(local);
            }

            this._local = local && local.toLowerCase();
            this.user = this._local;
        }
    }, {
        key: 'domain',
        get: function get() {
            return this._domain;
        },
        set: function set(domain) {
            this._domain = _punycode2['default'].toUnicode(domain).toLowerCase();
        }
    }], [{
        key: 'equal',
        value: function equal(jid1, jid2, bare) {
            jid1 = new JID(jid1);
            jid2 = new JID(jid2);

            if (bare) {
                return jid1.local === jid2.local && jid1.domain === jid2.domain;
            }

            return jid1.local === jid2.local && jid1.domain === jid2.domain && jid1.resource === jid2.resource;
        }
    }, {
        key: 'equalBare',
        value: function equalBare(jid1, jid2) {
            return JID.equal(jid1, jid2, true);
        }
    }, {
        key: 'create',
        value: function create(local, domain, resource) {
            return new JID(local, domain, resource);
        }
    }, {
        key: 'isBare',
        value: function isBare(jid) {
            jid = new JID(jid);

            var hasResource = !!jid.resource;

            return !hasResource;
        }
    }, {
        key: 'isFull',
        value: function isFull(jid) {
            jid = new JID(jid);

            var hasResource = !!jid.resource;

            return hasResource;
        }
    }]);

    return JID;
})();

exports['default'] = JID;
module.exports = exports['default'];
//# sourceMappingURL=JID.js.map