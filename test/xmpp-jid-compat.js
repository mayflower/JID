const JID = require('../index');
const assert = require('chai').assert;

// --------------------------------------------------------------------
// Test basic parsing
// --------------------------------------------------------------------

it('Parse JID with only domain', () => {
    const res = new JID('example.com');
    assert.equal(res.domain, 'example.com');
    assert.equal(res.local, '');
    assert.equal(res.resource, '');
    assert.equal(res.bare, 'example.com');
    assert.equal(res.full, 'example.com');
});

it('Parse JID with domain + resource', () => {
    const res = new JID('example.com/resource');
    assert.equal(res.domain, 'example.com');
    assert.equal(res.local, '');
    assert.equal(res.resource, 'resource');
    assert.equal(res.bare, 'example.com');
    assert.equal(res.full, 'example.com/resource');
});

it('Parse JID with local + domain', () => {
    const res = new JID('local@example.com');
    assert.equal(res.domain, 'example.com');
    assert.equal(res.local, 'local');
    assert.equal(res.resource, '');
    assert.equal(res.bare, 'local@example.com');
    assert.equal(res.full, 'local@example.com');
});

it('Parse JID with local + domain + resource', () => {
    const res = new JID('local@example.com/resource');
    assert.equal(res.domain, 'example.com');
    assert.equal(res.local, 'local');
    assert.equal(res.resource, 'resource');
    assert.equal(res.bare, 'local@example.com');
    assert.equal(res.full, 'local@example.com/resource');
});

it('Parse JID with resource including @', () => {
    const res = new JID('local@example.com/res@ource');
    assert.equal(res.domain, 'example.com');
    assert.equal(res.local, 'local');
    assert.equal(res.resource, 'res@ource');
    assert.equal(res.bare, 'local@example.com');
    assert.equal(res.full, 'local@example.com/res@ource');
});

it('Parse JID with resource including /', () => {
    const res = new JID('local@example.com/resource/2');
    assert.equal(res.domain, 'example.com');
    assert.equal(res.local, 'local');
    assert.equal(res.resource, 'resource/2');
    assert.equal(res.bare, 'local@example.com');
    assert.equal(res.full, 'local@example.com/resource/2');
});

// --------------------------------------------------------------------
// Test constructing from JID components
// --------------------------------------------------------------------

it('Construct JID with only domain', () => {
    const res = new JID('', 'example.com');
    assert.equal(res.domain, 'example.com');
    assert.equal(res.bare, 'example.com');
    assert.equal(res.full, 'example.com');
});

it('Construct JID with domain + resource', () => {
    const res = new JID('', 'example.com', 'resource');
    assert.equal(res.domain, 'example.com');
    assert.equal(res.resource, 'resource');
    assert.equal(res.bare, 'example.com');
    assert.equal(res.full, 'example.com/resource');
});

it('Construct JID with local + domain', () => {
    const res = new JID('local', 'example.com');
    assert.equal(res.domain, 'example.com');
    assert.equal(res.local, 'local');
    assert.equal(res.bare, 'local@example.com');
    assert.equal(res.full, 'local@example.com');
});

it('Construct JID with local + domain + resource', () => {
    const res = new JID('local', 'example.com', 'resource');
    assert.equal(res.domain, 'example.com');
    assert.equal(res.local, 'local');
    assert.equal(res.resource, 'resource');
    assert.equal(res.bare, 'local@example.com');
    assert.equal(res.full, 'local@example.com/resource');
});

it('Construct JID with resource including @', () => {
    const res = new JID('local', 'example.com', 'res@ource');
    assert.equal(res.domain, 'example.com');
    assert.equal(res.local, 'local');
    assert.equal(res.resource, 'res@ource');
    assert.equal(res.bare, 'local@example.com');
    assert.equal(res.full, 'local@example.com/res@ource');
});

it('Construct JID with resource including /', () => {
    const res = new JID('local', 'example.com', 'resource/2');
    assert.equal(res.domain, 'example.com');
    assert.equal(res.local, 'local');
    assert.equal(res.resource, 'resource/2');
    assert.equal(res.bare, 'local@example.com');
    assert.equal(res.full, 'local@example.com/resource/2');
});

// --------------------------------------------------------------------
// Test edge case valid forms
// --------------------------------------------------------------------

it('Valid: IPv4 domain', () => {
    const res = new JID('local@127.0.0.1/resource');
    assert.equal(res.domain, '127.0.0.1');
    assert.equal(res.local, 'local');
    assert.equal(res.resource, 'resource');
    assert.equal(res.bare, 'local@127.0.0.1');
    assert.equal(res.full, 'local@127.0.0.1/resource');
});

it('Valid: IPv6 domain', () => {
    const res = new JID('local@[::1]/resource');
    assert.equal(res.domain, '[::1]');
    assert.equal(res.local, 'local');
    assert.equal(res.resource, 'resource');
    assert.equal(res.bare, 'local@[::1]');
    assert.equal(res.full, 'local@[::1]/resource');
});

it('Valid: ACE domain', () => {
    const res = new JID('local@xn--bcher-kva.ch/resource');
    assert.equal(res.domain, 'bücher.ch');
    assert.equal(res.local, 'local');
    assert.equal(res.resource, 'resource');
    assert.equal(res.bare, 'local@bücher.ch');
    assert.equal(res.full, 'local@bücher.ch/resource');
});

xit('Valid: domain includes trailing .', () => {
    const res = new JID('local@example.com./resource');
    assert.equal(res.domain, 'example.com');
    assert.equal(res.local, 'local');
    assert.equal(res.resource, 'resource');
    assert.equal(res.bare, 'local@example.com');
    assert.equal(res.full, 'local@example.com/resource');
});

// --------------------------------------------------------------------
// Test JID prepping
// --------------------------------------------------------------------

it('Prep: Lowercase', () => {
    const res = new JID('LOCAL@EXAMPLE.com/RESOURCE');
    assert.equal(res.local, 'local');
    assert.equal(res.domain, 'example.com');
    assert.equal(res.resource, 'RESOURCE');
    assert.equal(res.bare, 'local@example.com');
    assert.equal(res.full, 'local@example.com/RESOURCE');
});

// --------------------------------------------------------------------
// Test escaping/unescaping
// --------------------------------------------------------------------

it('Escape: No starting/ending \\20', () => {
    const res = new JID(' test ', 'example.com');
    assert.equal(res.local, 'test');
    assert.equal(res.unescapedLocal, 'test');
});

xit('Escape: Existing escape sequences', () => {
    const res = new JID('test.20\\22\\26\\27\\2f\\3a\\3c\\3e\\40', 'example.com');
    assert.equal(res.local, 'test.5c20\\5c22\\5c26\\5c27\\5c2f\\5c3a\\5c3c\\5c3e\\5c40');
    assert.equal(res.bare, 'test.5c20\\5c22\\5c26\\5c27\\5c2f\\5c3a\\5c3c\\5c3e\\5c40@example.com');
    assert.equal(res.unescapedLocal, 'test.20\\22\\26\\27\\2f\\3a\\3c\\3e\\40');
});

xit('Escape: Existing escape sequence \\5c', () => {
    const res = new JID('test.5c', 'example.com');
    assert.equal(res.local, 'test.5c5c');
    assert.equal(res.bare, 'test.5c5c@example.com');
    assert.equal(res.unescapedLocal, 'test.5c');
});

it('Escape: Non-escape sequence \\32\\', () => {
    const res = new JID('test.32\\', 'example.com');
    assert.equal(res.local, 'test.32\\');
    assert.equal(res.bare, 'test.32\\@example.com');
    assert.equal(res.unescapedLocal, 'test.32\\');
});

it('Escape: Escaped characters', () => {
    const res = new JID('testing @\\\'"?:&<>', 'example.com');
    assert.equal(res.local, 'testing\\20\\40\\\\27\\22?\\3a\\26\\3c\\3e');
    assert.equal(res.bare, 'testing\\20\\40\\\\27\\22?\\3a\\26\\3c\\3e@example.com');
    assert.equal(res.unescapedLocal, 'testing @\\\'"?:&<>');
    assert.equal(res.unescapedBare, 'testing @\\\'"?:&<>@example.com');
});

it('Unescape: Non-escape sequence', () => {
    const res = new JID('test.32@example.com');
    assert.equal(res.local, 'test.32');
    assert.equal(res.bare, 'test.32@example.com');
    assert.equal(res.unescapedLocal, 'test.32');
});

it('Unescape: Escaped characters', () => {
    const res = new JID('testing\\20\\40\\5c\\27\\22?\\3a\\26\\3c\\3e@example.com');
    assert.equal(res.local, 'testing\\20\\40\\5c\\27\\22?\\3a\\26\\3c\\3e');
    assert.equal(res.unescapedLocal, 'testing @\\\'"?:&<>');
});

// --------------------------------------------------------------------
// Tesassert.equality
// --------------------------------------------------------------------

it('Equal: Full JID', () => {
    const jid1 = new JID('local@example.com/resource');
    const jid2 = new JID('LOcAL@EXample.COM/resource');
    assert.ok(JID.equal(jid1, jid2));
});

it('Equal: Bare JID', () => {
    const jid1 = new JID('local@example.com/resource');
    const jid2 = new JID('LOcAL@EXample.COM/resource');
    assert.ok(JID.equalBare(jid1, jid2));
});

// --------------------------------------------------------------------
// Test JID utilities
// --------------------------------------------------------------------

it('toString', () => {
    const res = new JID('local@example.com/resource');
    assert.equal(res.toString(), 'local@example.com/resource');
});

it('JSON.stringify', () => {
    const res = new JID('local@example.com/resource');
    assert.equal(JSON.stringify(res), '"local@example.com/resource"');
});

it('Create', () => {
    const res = JID.create('local@example.com/resource');
    assert.equal(res.domain, 'example.com');
    assert.equal(res.local, 'local');
    assert.equal(res.resource, 'resource');
    assert.equal(res.bare, 'local@example.com');
    assert.equal(res.full, 'local@example.com/resource');
});

it('Clone JID', () => {
    const orig = new JID('local@example.com/resource');
    const clone = new JID(orig);
    assert.equal(orig.full, clone.full);
    assert.equal(orig.bare, clone.bare);
    assert.equal(orig.domain, clone.domain);
    assert.equal(orig.local, clone.local);
    assert.equal(orig.resource, clone.resource);
});

it('isBare', () => {
    const jid1 = new JID('local@example.com');
    const jid2 = new JID('local@example.com/resource');

    assert(JID.isBare(jid1));
    assert.notOk(JID.isBare(jid2));
});

it('isFull', () => {
    const jid1 = new JID('local@example.com/resource');
    const jid2 = new JID('local@example.com');

    assert.ok(JID.isFull(jid1));
    assert.notOk(JID.isFull(jid2));
});

it('Invalid arguments', () => {
    assert.throws(() => {
        new JID(1234); // eslint-disable-line no-new
    });
});
