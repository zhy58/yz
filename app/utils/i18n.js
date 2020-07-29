import { getLocales } from 'react-native-localize'
import I18n from 'i18n-js'
import translate from '../translate'

export default (language) => {
  let defaultLang = {}
  if(!language){
    const arrayLang = getLocales()
    if(arrayLang && arrayLang.length){
      [defaultLang] = [...arrayLang]
    }
  }else{
    defaultLang = language
  }
  
  if(!translate[defaultLang.languageCode]){
    defaultLang = {
      countryCode: "US",
      languageCode: "en"
    }
  }
  
  I18n.translations[defaultLang.languageCode] = translate[defaultLang.languageCode]
  I18n.defaultLocale = defaultLang.languageCode
  I18n.locale = defaultLang.languageCode
  // console.log(I18n.locale, I18n.defaultLocale, I18n.translations)
}
