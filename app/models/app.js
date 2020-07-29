import { createAction, setLang, Storage, Config } from '../utils'

export default {
  namespace: 'app',
  state: {
    loading: true,
    fetching: false,
    connected: '',// 蓝牙连接？
    // 左灶开关
    leftPower: false,
    rightPower: false,
    // 左右启动
    leftStart: false,
    rightStart: false,
    // 档位 gear1 gear2 gear3
    gear: '',
    receiveData: [170, 12, 2, 1, 4, 1, 0, 0, 0, 0, 100, 0, 0, 190], // 十进制数据
    receive: {
      switch: 4,
      key: 1,
      hour: 0,
      min: 0,
      sec: 0,
      icon: 0,
      elec: 100,
    }
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *loadStorage(action, { call, put }) {
      // 设置语言
      const storageLanguage = yield call(Storage.get, Config.storageKey.languageStorageKey)
      setLang(storageLanguage)
      // console.log("storageLanguage: ", storageLanguage)
      
      yield put(createAction('updateState')({ loading: false }))
    },
  },
  subscriptions: {
    setup({ dispatch }){
      // dispatch(createAction("loadStorage")())
      dispatch({ type: 'loadStorage' })
    }
  }
}