// const prefix = "AA0C0101"
// const address = "00000000"

export default {
  // 缓存
  storageKey: {
    // 用户设定默认语言
    languageStorageKey: "LANGUAGE_STORAGE_KEY",
    // 默认蓝牙uuid
    blePeripheralId: "BLE_PERIPHERAL_ID",
  },
  icon: {
    back: '\ue6db',
    lang: '\ue692',
    bleLink: '\ue699',
    fire: '\ue6eb',
    bluetooth: '\ue698',
    start: '\ue69b',
    power: '\ue615',
    battery: '\ue694',
  },
  prefix: "AA0C0101",
  address: "00000000",
  // 设备控制指令
  // 关开：01 02  左灶开关：59 5A  右灶开关：5B 5C
  // 左启动：52 右启动：53  
  // 一档：54  二档：55  三档56
  // 灯光开：5D  灯光关：5E
  // 清洗开：5F  清洗关：60
  Instructions: {
    power0: '02',
    power1: '01',
    gear1: '54',
    gear2: '55',
    gear3: '56',
    lighting0: '5D',
    lighting1: '5E',
    clean0: '5F',
    clean1: '60',
    leftStart: '52',
    rightStart: '53',
    leftPower0: '59',
    leftPower1: '5A',
    rightPower0: '5B',
    rightPower1: '5C',
  }
}