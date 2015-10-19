const assert = require('assert');
const JID = require('../src/JID');

describe('JID', () => {
    describe('parsing', () => {
        it('should parse a "domain" JID', () => {
            const j = new JID('d');
            assert.equal(j.local, '');
            assert.equal(j.domain, 'd');
            assert.equal(j.resource, '');
        });
        it('should parse a "user@domain" JID', () => {
            const j = new JID('u@d');
            assert.equal(j.local, 'u');
            assert.equal(j.domain, 'd');
            assert.equal(j.resource, '');
        });
        it('should parse a "domain/resource" JID', () => {
            const j = new JID('d/r');
            assert.equal(j.local, '');
            assert.equal(j.domain, 'd');
            assert.equal(j.resource, 'r');
        });
        it('should parse a "user@domain/resource" JID', () => {
            const j = new JID('u@d/r');
            assert.equal(j.local, 'u');
            assert.equal(j.domain, 'd');
            assert.equal(j.resource, 'r');
        });
        it('should parse an internationalized domain name as unicode', () => {
            const j = new JID('öko.de');
            assert.equal(j.domain, 'öko.de');
        });
        it('should parse an empty domain JID (#109)', () => {
            const j = new JID('u@d', '');
            assert.equal(j.local, 'u');
            assert.equal(j.domain, 'd');
            assert.equal(j.resource, '');
        });
        it('should allow access to jid parts using keys', () => {
            const j = new JID('u@d/r', '');
            assert.equal(j.local, 'u');
            assert.equal(j.domain, 'd');
            assert.equal(j.resource, 'r');
        });
        it('shouldn\'t get U_STRINGPREP_PROHIBITED_ERROR (#93)', () => {
            assert.doesNotThrow(() => {
                const j = new JID('f u@d');
                j.toString();
            });
        });

        it('should parse an internationalized domain name as ascii/punycode', () => {
            const j = new JID('xn--ko-eka.de');
            assert.equal(j.domain, 'öko.de');
        });

        it('should parse a JID with punycode', () => {
            const j = new JID('Сергей@xn--lsa92diaqnge.xn--p1ai');
            assert.equal(j.local, 'сергей');
            assert.equal(j.domain, 'приме́р.рф');
        });
    });

    describe('Escaping', () => {
        it('Should not change string - issue 43', () => {
            const test = 'test\u001a@example.com';

            const jid = new JID(test);
            assert.equal(jid.escapeLocal('test\u001a'), 'test\u001a');
        });

        it('Should escape - issue 43', () => {
            const test = 'test\u001aa@example.com';

            const jid = new JID(test);
            assert.equal(jid.escapeLocal('test\u001aa'), 'testa');
        });
    });

    describe('serialization', () => {
        it('should serialize a "domain" JID', () => {
            const j = new JID(null, 'd');
            assert.equal(j.toString(), 'd');
        });

        it('should serialize a "user@domain" JID', () => {
            const j = new JID('u', 'd');
            assert.equal(j.toString(), 'u@d');
        });

        it('should serialize a "domain/resource" JID', () => {
            const j = new JID(null, 'd', 'r');
            assert.equal(j.toString(), 'd/r');
        });

        it('should serialize a "user@domain/resource" JID', () => {
            const j = new JID('u', 'd', 'r');
            assert.equal(j.toString(), 'u@d/r');
        });
    });

    describe('equality', () => {
        it('should parsed JIDs should be equal', () => {
            const j1 = new JID('foo@bar/baz');
            const j2 = new JID('foo@bar/baz');
            assert.equal(j1.equals(j2), true);
        });

        it('should parsed JIDs should be not equal', () => {
            const j1 = new JID('foo@bar/baz');
            const j2 = new JID('quux@bar/baz');
            assert.equal(j1.equals(j2), false);
        });

        it('should ignore case in user', () => {
            const j1 = new JID('foo@bar/baz');
            const j2 = new JID('FOO@bar/baz');
            assert.equal(j1.equals(j2), true);
        });

        it('should ignore case in domain', () => {
            const j1 = new JID('foo@bar/baz');
            const j2 = new JID('foo@BAR/baz');
            assert.equal(j1.equals(j2), true);
        });

        it('should not ignore case in resource', () => {
            const j1 = new JID('foo@bar/baz');
            const j2 = new JID('foo@bar/Baz');
            assert.equal(j1.equals(j2), false);
        });

        it('should ignore international caseness', () => {
            const j1 = new JID('föö@bär/baß');
            const j2 = new JID('fÖö@BÄR/baß');
            assert.equal(j1.equals(j2), true);
        });

        it('should work with bare JIDs', () => {
            const j1 = new JID('romeo@example.net/9519407536580081');
            const j2 = new JID('romeo@example.net');
            assert.equal(j1.bare === j2.bare, true);
        });
    });
});
