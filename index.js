const { Plugin } = require('powercord/entities')

module.exports = class QuickToggler extends Plugin {
  async startPlugin () {
    this._themesEnabled = true
    this._pluginsEnabled = true
    document.addEventListener('keydown', this.onKeyDownWrapper.bind(this))
  }

  pluginWillUnload () { document.removeEventListener(this.onKeyDownWrapper.bind(this)) }

  onKeyDown (e) {
    switch (e.code) {
      case 'F6':
        powercord.pluginManager.plugins.forEach(v => {
          if (v.entityID.startsWith('pc-') || v.entityID === 'quick-toggler') return
          powercord.pluginManager[this._pluginsEnabled ? 'disable' : 'enable'](v.entityID)
        })
        this._pluginsEnabled = !this._pluginsEnabled
        break
      case 'F7': {
        powercord.styleManager.themes.forEach(v => v.entityID && powercord.styleManager[this._themesEnabled ? 'disable' : 'enable'](v.entityID))

        let moduleManager = powercord.pluginManager.get('pc-moduleManager')
        if (this._themesEnabled)
          document.querySelector('#powercord-quickcss')?.remove()
        else moduleManager._loadQuickCSS.bind(moduleManager)()

        this._themesEnabled = !this._themesEnabled
        break
      }
    }
  }

  onKeyDownWrapper (e) { this.onKeyDown(e) }
}
