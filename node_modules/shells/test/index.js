const test = require('tape')
const path = require('path')
const stat = require('fs').statSync

test('shells', function (t) {
  process.env.SHELLS_HOMEDIR = path.join(__dirname, 'fixtures')
  const shells = require('..')()
  t.equal(shells.length, 4, 'finds zsh, bash, and fish files')
  t.ok(shells[0].file, 'sets file')
  t.ok(shells[0].type, 'sets type')
  t.ok(stat(shells[0].file).mtime > stat(shells[1].file).mtime,
    'sorts most recently modified shell profile first')

  process.env.SHELLS_HOMEDIR = 'nonexistent/path'
  const emptyShells = require('..')()
  t.equal(emptyShells.length, 0, 'returns an empty array if no shell configs are found')

  t.end()
})
