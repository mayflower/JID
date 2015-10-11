import punycode from 'punycode';

/**
 * JID implements
 * - Xmpp addresses according to RFC6122
 * - XEP-0106: JID Escaping
 *
 * @see http://tools.ietf.org/html/rfc6122#section-2
 * @see http://xmpp.org/extensions/xep-0106.html
 */
class JID {
    _local = '';
    _domain = '';
    resource = '';

    constructor(a, b, c) {
        if (a && !b && !c) {
            if (typeof a === 'string') {
                this.parseJID(a);
            } else if (a instanceof JID) {
                Object.assign(this, a);
            } else {
                throw new Error('Argument error');
            }
        } else if (b) {
            this.local = a;
            this.domain = b;
            this.resource = c;
        }
    }

    parseJID(s) {
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

    get unescapedFull() {
        let s = this.domain;

        if (this.local) {
            s = `${this.unescapedLocal}@${s}`;
        }
        if (this.resource) {
            s = `${s}/${this.resource}`;
        }

        return s;
    }

    get full() {
        let s = this.domain;

        if (this.local) {
            s = `${this.local}@${s}`;
        }
        if (this.resource) {
            s = `${s}/${this.resource}`;
        }

        return s;
    }

    toString = (unescape) => unescape ? this.unescapedFull : this.full;
    toJSON = () => this.full;

    /**
     * Convenience method to distinguish users
     **/
    get bare() {
        if (this.resource) {
            return new JID(this.local, this.domain).full;
        } else {
            return this.full;
        }
    }
    /**
     * Convenience method to distinguish users
     **/
    get unescapedBare() {
        if (this.resource) {
            return new JID(this.local, this.domain).unescapedFull;
        } else {
            return this.unescapedFull;
        }
    }

    equals(other) {
        return this.local === other.local &&
            this.domain === other.domain &&
            this.resource === other.resource;
    }

    get unescapedLocal() {
        return this.unescapeLocal(this._local);
    }
    get local() {
        return this._local;
    }
    set local(local) {
        const escape = this.detectEscape(local);

        if (escape) {
            local = this.escapeLocal(local);
        }

        this._local = local && local.toLowerCase();
        this.user = this._local;
    }

    get domain() {
        return this._domain;
    }
    set domain(domain) {
        this._domain = punycode.toUnicode(domain).toLowerCase();
    }

    detectEscape(local) {
        if (!local) {
            return false;
        }

        // remove all escaped sequences
        const tmp = local.replace(/\\20/g, '')
            .replace(/\\22/g, '')
            .replace(/\\26/g, '')
            .replace(/\\27/g, '')
            .replace(/\\2f/g, '')
            .replace(/\\3a/g, '')
            .replace(/\\3c/g, '')
            .replace(/\\3e/g, '')
            .replace(/\\40/g, '')
            .replace(/\\5c/g, '');

        // detect if we have unescaped sequences
        const search = tmp.search(/\\| |\"|\&|\'|\/|:|<|>|@/g);

        if (search === -1) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Escape the local part of a JID.
     *
     * @see http://xmpp.org/extensions/xep-0106.html
     * @param String local local part of a jid
     * @return An escaped local part
     */
    escapeLocal(local) {
        if (local === null) {
            return null;
        }

        return local.replace(/^\s+|\s+$/g, '')
          .replace(/\\5c/g, '\\5c5c')
          .replace(/\\20/g, '\\5c20')
          .replace(/\\22/g, '\\5c22')
          .replace(/\\26/g, '\\5c26')
          .replace(/\\27/g, '\\5c27')
          .replace(/\\2f/g, '\\5c2f')
          .replace(/\\3a/g, '\\5c3a')
          .replace(/\\3c/g, '\\5c3c')
          .replace(/\\3e/g, '\\5c3e')
          .replace(/\\40/g, '\\5c40')
          .replace(/ /g, '\\20')
          .replace(/\"/g, '\\22')
          .replace(/\&/g, '\\26')
          .replace(/\'/g, '\\27')
          .replace(/\//g, '\\2f')
          .replace(/:/g, '\\3a')
          .replace(/</g, '\\3c')
          .replace(/>/g, '\\3e')
          .replace(/@/g, '\\40');
    }

    /**
     * Unescape a local part of a JID.
     *
     * @see http://xmpp.org/extensions/xep-0106.html
     * @param String local local part of a jid
     * @return unescaped local part
     */
    unescapeLocal(local) {
        if (local === null) {
            return null;
        }

        return local.replace(/\\20/g, ' ')
            .replace(/\\22/g, '"')
            .replace(/\\26/g, '&')
            .replace(/\\27/g, '\'')
            .replace(/\\2f/g, '/')
            .replace(/\\3a/g, ':')
            .replace(/\\3c/g, '<')
            .replace(/\\3e/g, '>')
            .replace(/\\40/g, '@')
            .replace(/\\5c/g, '\\');
    }

    static equal(jid1, jid2, bare) {
        jid1 = new JID(jid1);
        jid2 = new JID(jid2);

        if (bare) {
            return jid1.local === jid2.local &&
                jid1.domain === jid2.domain;
        }

        return jid1.local === jid2.local &&
            jid1.domain === jid2.domain &&
            jid1.resource === jid2.resource;
    }

    static equalBare(jid1, jid2) {
        return JID.equal(jid1, jid2, true);
    }

    static create(local, domain, resource) {
        return new JID(local, domain, resource);
    }

    static isBare(jid) {
        jid = new JID(jid);

        const hasResource = !!jid.resource;

        return !hasResource;
    }

    static isFull(jid) {
        jid = new JID(jid);

        const hasResource = !!jid.resource;

        return hasResource;
    }
}

export default JID;
