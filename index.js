const { Plugin } = require('powercord/entities')

module.exports = class QuickToggler extends Plugin {
  async startPlugin () {
    this._themesEnabled = true
    this._pluginsEnabled = true
    this._enabledPlugins = []
    document.addEventListener('keydown', this.onKeyDownWrapper.bind(this))
  }

  pluginWillUnload () { document.removeEventListener(this.onKeyDownWrapper.bind(this)) }

  onKeyDown (e) {
    switch (e.code) {
      case 'F6':
        if (this._pluginsEnabled) {
          this._enabledPlugins = Array.from(powercord.pluginManager.plugins.values())
            .filter(p => p.ready)
            .map(p => p.entityID)
        }
        this._enabledPlugins.forEach(v => {
          if (v.startsWith('pc-') || v === 'quick-toggler') return
          powercord.pluginManager[this._pluginsEnabled ? 'disable' : 'enable'](v)
        })
        this._pluginsEnabled = !this._pluginsEnabled
        break
      case 'F7': {
        powercord.styleManager[this._themesEnabled ? 'unloadThemes' : 'loadThemes']()

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
