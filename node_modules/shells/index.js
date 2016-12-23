const stat = require('fs').statSync
const os = require('os')
const path = require('path')
const exists = require('path-exists').sync
const types = ['bash', 'fish', 'zsh']
const files = [
  '~/.bashrc',
  '~/.bash_profile',
  '~/.zshrc',
  '~/.config/fish/config.fish'
]

module.exports = function () {
  var baseDir = process.env.SHELLS_HOMEDIR || os.homedir()

  return files
    .map(file => path.resolve(file.replace('~', baseDir)))
    .filter(file => exists(file))
    .sort((a, b) => stat(b).mtime - stat(a).mtime)
    .map(file => {
      return {
        file: file,
        type: types.find(type => file.match(type))
      }
    })
}
