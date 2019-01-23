/**
 * The file enables `@/store/index.js` to import all vuex modules
 * in a one-shot manner. There should not be any reason to edit this file.
 */
import login from './login'
// const files = require.context('.', false, /\.js$/)
const modules = {}
modules.login = login
// files.keys().forEach(key => {
//   if (key === './index.js') return
//   modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
// })
export default modules
