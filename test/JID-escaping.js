const assert = require('assert');
const JID = require('../src/JID');

describe('JID escaping', () => {
    describe('escaping', () => {
        it('escape `space cadet@example.com`', () => {
            const esc = new JID('space cadet@example.com');
            assert.equal(esc.toString(), 'space\\20cadet@example.com');
            assert.equal(esc.toString(true), 'space cadet@example.com');
        });

        it('escape `call me \"ishmael\"@example.com`', () => {
            const esc = new JID('call me \"ishmael\"@example.com');
            assert.equal(esc.toString(), 'call\\20me\\20\\22ishmael\\22@example.com');
            assert.equal(esc.toString(true), 'call me \"ishmael\"@example.com');
        });

        it('escape `at&t guy@example.com`', () => {
            const esc = new JID('at&t guy@example.com');
            assert.equal(esc.toString(), 'at\\26t\\20guy@example.com');
            assert.equal(esc.toString(true), 'at&t guy@example.com');
        });

        it('escape `d\'artagnan@example.com`', () => {
            const esc = new JID('d\'artagnan@example.com');
            assert.equal(esc.toString(), 'd\\27artagnan@example.com');
            assert.equal(esc.toString(true), 'd\'artagnan@example.com');
        });

        xit('escape `/.fanboy@example.com`', () => {
            const esc = new JID('/.fanboy@example.com');
            assert.equal(esc.toString(), '\\2f.fanboy@example.com');
            assert.equal(esc.toString(true), '/.fanboy@example.com');
        });

        it('escape `::foo::@example.com`', () => {
            const esc = new JID('::foo::@example.com');
            assert.equal(esc.toString(), '\\3a\\3afoo\\3a\\3a@example.com');
            assert.equal(esc.toString(true), '::foo::@example.com');
        });

        it('escape `<foo>@example.com`', () => {
            const esc = new JID('<foo>@example.com');
            assert.equal(esc.toString(), '\\3cfoo\\3e@example.com');
            assert.equal(esc.toString(true), '<foo>@example.com');
        });

        it('escape `user@host@example.com`', () => {
            const esc = new JID('user@host@example.com');
            assert.equal(esc.toString(), 'user\\40host@example.com');
            assert.equal(esc.toString(true), 'user@host@example.com');
        });

        xit('escape `c:\\net@example.com`', () => {
            const esc = new JID('c:\\net@example.com');
            assert.equal(esc.toString(), 'c\\3a\\5cnet@example.com');
            assert.equal(esc.toString(true), 'c:\\net@example.com');
        });

        xit('escape `c:\\\\net@example.com`', () => {
            const esc = new JID('c:\\\\net@example.com');
            assert.equal(esc.toString(), 'c\\3a\\5c\\5cnet@example.com');
            assert.equal(esc.toString(true), 'c:\\\\net@example.com');
        });

        xit('escape `c:\\cool stuff@example.com`', () => {
            const esc = new JID('c:\\cool stuff@example.com');
            assert.equal(esc.toString(), 'c\\3a\\5ccool\\20stuff@example.com');
            assert.equal(esc.toString(true), 'c:\\cool stuff@example.com');
        });

        it('escape `c:\\5commas@example.com`', () => {
            const esc = new JID('c:\\5commas@example.com');
            assert.equal(esc.toString(), 'c\\3a\\5c5commas@example.com');
            assert.equal(esc.toString(true), 'c:\\5commas@example.com');
        });
    });

    describe('detect escaped jids', () => {
        it('escape `space\\20cadet@example.com`', () => {
            const esc = new JID('space\\20cadet@example.com');
            assert.equal(esc.toString(), 'space\\20cadet@example.com');
            assert.equal(esc.toString(true), 'space cadet@example.com');
        });

        it('escape `call me \"ishmael\"@example.com`', () => {
            const esc = new JID('call me \"ishmael\"@example.com');
            assert.equal(esc.toString(), 'call\\20me\\20\\22ishmael\\22@example.com');
            assert.equal(esc.toString(true), 'call me \"ishmael\"@example.com');
        });

        it('escape `at\\26t\\20guy@example.com`', () => {
            const esc = new JID('at\\26t\\20guy@example.com');
            assert.equal(esc.toString(), 'at\\26t\\20guy@example.com');
            assert.equal(esc.toString(true), 'at&t guy@example.com');
        });

        it('escape `d\\27artagnan@example.com`', () => {
            const esc = new JID('d\\27artagnan@example.com');
            assert.equal(esc.toString(), 'd\\27artagnan@example.com');
            assert.equal(esc.toString(true), 'd\'artagnan@example.com');
        });

        it('escape `\\2f.fanboy@example.com`', () => {
            const esc = new JID('\\2f.fanboy@example.com');
            assert.equal(esc.toString(), '\\2f.fanboy@example.com');
            assert.equal(esc.toString(true), '/.fanboy@example.com');
        });

        it('escape `\\3a\\3afoo\\3a\\3a@example.com`', () => {
            const esc = new JID('\\3a\\3afoo\\3a\\3a@example.com');
            assert.equal(esc.toString(), '\\3a\\3afoo\\3a\\3a@example.com');
            assert.equal(esc.toString(true), '::foo::@example.com');
        });

        it('escape `\\3cfoo\\3e@example.com`', () => {
            const esc = new JID('\\3cfoo\\3e@example.com');
            assert.equal(esc.toString(), '\\3cfoo\\3e@example.com');
            assert.equal(esc.toString(true), '<foo>@example.com');
        });

        it('escape `user\\40host@example.com`', () => {
            const esc = new JID('user\\40host@example.com');
            assert.equal(esc.toString(), 'user\\40host@example.com');
            assert.equal(esc.toString(true), 'user@host@example.com');
        });

        it('escape `c\\3a\\5cnet@example.com`', () => {
            const esc = new JID('c\\3a\\5cnet@example.com');
            assert.equal(esc.toString(), 'c\\3a\\5cnet@example.com');
            assert.equal(esc.toString(true), 'c:\\net@example.com');
        });

        xit('escape `c:\\\\net@example.com`', () => {
            const esc = new JID('c:\\\\net@example.com');
            assert.equal(esc.toString(), 'c\\3a\\5c\\5cnet@example.com');
            assert.equal(esc.toString(true), 'c:\\\\net@example.com');
        });

        it('escape `c\\3a\\5ccool\\20stuff@example.com`', () => {
            const esc = new JID('c\\3a\\5ccool\\20stuff@example.com');
            assert.equal(esc.toString(), 'c\\3a\\5ccool\\20stuff@example.com');
            assert.equal(esc.toString(true), 'c:\\cool stuff@example.com');
        });

        it('escape `c\\3a\\5c5commas@example.com`', () => {
            const esc = new JID('c\\3a\\5c5commas@example.com');
            assert.equal(esc.toString(), 'c\\3a\\5c5commas@example.com');
            assert.equal(esc.toString(true), 'c:\\5commas@example.com');
        });
    });
});
