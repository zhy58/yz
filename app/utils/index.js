
export { NavigationActions, StackActions } from 'react-navigation'

export { default as Storage } from './storage'
export { default as Config } from './config'
export { default as setLang } from './i18n'
export { default as Toast } from './toast'

export const createAction = type => payload => ({ type, payload })
