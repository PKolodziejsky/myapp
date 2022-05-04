
module.exports = {
  presets: [
    require('@seatti-tech/lithium/tailwind.config')
  ],
  mode: 'jit',
  content: [
    './node_modules/@seatti-tech/lithium/src/**/*.tsx',
    './src/**/*.tsx',
    './public/index.html',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        "seatti-logo": "url('/src/assets/seatti-logo-round.svg')"
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
    }
  }
}
