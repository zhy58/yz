import React, { PureComponent } from 'react'
import { 
  View,
  Text, 
  SafeAreaView, 
  StyleSheet, 
  Dimensions, 
  FlatList, 
  Platform, 
  PermissionsAndroid, 
  BackHandler,
  AppState,
  RefreshControl,
} from 'react-native'
import Modal from 'react-native-modal'
import { connect } from 'react-redux'
import I18n from 'i18n-js'

// ble
import BleModule from "../utils/BleModule"
import BleProtocol from "../utils/BleProtocol"
//确保全局只有一个BleManager实例，BleModule类保存着蓝牙的连接信息
global.BluetoothManager = new BleModule()
global.BluetoothProtocol = new BleProtocol()

import { ImageButton, TouchableOpacity, Header } from '../components'
import styles from '../styles'
import { NavigationActions, setLang, Storage, Config, createAction, Toast } from '../utils'

const { height } = Dimensions.get("window")

@connect(({ app }) => ({ ...app }))
class Home extends PureComponent {
  constructor(props){
    super(props)
    this.bluetoothReceiveData = [] //蓝牙接收的数据缓存
    this.isScan = false
    this.lang = [
      { name: "中文", languageCode: "zh", countryCode: "CN" },
      { name: "English", languageCode: "en", countryCode: "US" }
    ]
    this.state = {
      isVisible: false,
      isDisplay: false,
      scaning: false,
      appState: '',
      connected: '',
      peripherals: new Map(),
    }
  }

  jump = routeName => {
    this.props.dispatch(NavigationActions.navigate({ routeName }))
  }
  // 关闭弹窗
  closeModal = () => {
    this.setState({ isVisible: false })
  }
  closeBLEModal = () => {
    this.setState({ isDisplay: false })
    if(this.state.scaning){
      BluetoothManager.stopScan()
    }
  }
  // header method
  bleLink = () => {
    this.setState({
      isDisplay: true
    })
    if(!this.isScan){
      this.startScan()
      this.isScan = true;
    }
  }
  language = () => {
    this.setState({ isVisible: true })
  }
  // 设置语言
  setLanguage = item => {
    const { name, ...lang } = item
    Storage.set(Config.storageKey.languageStorageKey, lang)
    setLang(lang)
    this.closeModal()
  }
  // ble
  // 蓝牙状态监听
  handleBLEStatus = (args) => {
    console.log('BleManagerDidUpdateState:', args)
  }
  startScan = () => {
    if(!this.state.scaning){
      BluetoothManager.scan().then(() => {
        this.setState({ scaning: true })
      }).catch((err) => {
        console.log("ble scan: ", err)
      })
    }
  }
  handleStopScan = () => {
    console.log('Scan is stopped')
    this.setState({ scaning: false })
  }
  handleDiscoverPeripheral = (peripheral) => {
    let peripherals = this.state.peripherals
    console.log('Got ble peripheral', peripheral)
    if (!peripheral.name) {
      peripheral.name = 'NO NAME'
    }
    peripherals.set(peripheral.id, peripheral)
    this.setState({ peripherals })
  }
  handleDisconnectedPeripheral = (data) => {
    Toast("蓝牙断开连接！")
    this.setState({ connected: '' })
    this.props.dispatch(createAction("app/updateState")({ connected: '' }))
    // console.log('Disconnected from:', data)
  }
  handleBLEConnect = (data) => {
    console.log("ble connect:", data)
  }
  handleUpdateValueForCharacteristics = (data) => {
    const receiveData = data.value
    if(receiveData.length != 14){
      Toast("接收到蓝牙数据长度不对！")
      return;
    }

    const receive = {
      switch: receiveData[4],
      key: receiveData[5],
      hour: receiveData[6],
      min: receiveData[7],
      sec: receiveData[8],
      icon: receiveData[9],
      elec: receiveData[10],
    }
    this.props.dispatch(createAction("app/updateState")({ 
      receiveData,
      receive
     }))
    console.log(data.value)
  }
  // 连接蓝牙
  link = (peripheral) => {
    if (peripheral){
      if (this.state.connected === peripheral.id){
        // 断开蓝牙连接
        BluetoothManager.disconnect()
        Storage.remove(Config.storageKey.blePeripheralId)
      }else{
        BluetoothManager.connect(peripheral.id).then(() => {
          Toast("蓝牙配对成功！")
          this.setState({ connected: peripheral.id })
          this.props.dispatch(createAction("app/updateState")({ connected: peripheral.id }))
          Storage.set(Config.storageKey.blePeripheralId, peripheral.id)
          this.closeBLEModal()
          this.notify(0)
          // console.log(BluetoothManager)
        }).catch((err) => {
          Toast("蓝牙配对成功！")
        })
      }
    }
  }
  // 打开蓝牙通知
  notify = (index) => {
    BluetoothManager.startNotification(index).then(() => {
      setTimeout(()=>{
        const i = "AA0C03010401000000"+ Config.address
        const hexStr = BluetoothProtocol.check(i)
        const instructions = i + hexStr
        BluetoothManager.writeWithoutResponse(instructions, 0).then(() => {
          console.log("query:");
        }).catch((err) => {console.log("home:notify:", err)})
      }, 10)
      // this.props.dispatch(createAction("app/updateState")({ isMonitoring: true }))
    }).catch((err) => {
      // this.props.dispatch(createAction("app/updateState")({ isMonitoring: false }))
    });
  };
  // 返回当前蓝牙连接
  getConnectedPeripherals = () => {
    BluetoothManager.getConnectedPeripherals().then((peripheralsArray) => {
      console.log('Connected peripherals: ', peripheralsArray)
      if(peripheralsArray[0]){
        this.setState({ connected: peripheralsArray[0].id })
        this.props.dispatch(createAction("app/updateState")({ connected: peripheralsArray[0].id }))
        this.notify(0)
      }
    }).catch(err => {
      console.log('Connected err peripherals: ', err)
    })
  }
  // app当前状态
  handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
      this.getConnectedPeripherals()
    }
    this.setState({appState: nextAppState})
  }
  // judge root
  judgeAndroidVersion = () => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
          if (result) {
            // 打开蓝牙
            BluetoothManager.enableBluetooth()
          } else {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
              if (result) {
                // 打开蓝牙
                BluetoothManager.enableBluetooth()
              } else {
                BackHandler.exitApp()
              }
            })
          }
      })
    }
  }
  componentDidMount = () => {
    AppState.addEventListener('change', this.handleAppStateChange)
    //蓝牙初始化
    BluetoothManager.start()

    this.handlerBLE = BluetoothManager.addListener('BleManagerDidUpdateState', this.handleBLEStatus )
    this.handlerStop = BluetoothManager.addListener('BleManagerStopScan', this.handleStopScan )
    this.handlerDiscover = BluetoothManager.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral )
    this.handlerConnect = BluetoothManager.addListener('BleManagerConnectPeripheral', this.handleBLEConnect )
    this.handlerDisconnect = BluetoothManager.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral )
    this.handlerUpdate = BluetoothManager.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristics )

    this.judgeAndroidVersion()
    this.getConnectedPeripherals()
  }
  componentWillUnmount() {
    console.log("leave:")
    this.handlerBLE.remove()
    this.handlerStop.remove()
    this.handlerDiscover.remove()
    this.handlerConnect.remove()
    this.handlerDisconnect.remove()
    this.handlerUpdate.remove()
    if (this.state.connected) {
      //退出时断开蓝牙连接
      BluetoothManager.disconnect()
    }
  }
  // render
  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView />
        <Header lIcon={Config.icon.bleLink} rIcon={Config.icon.lang} onPressL={this.bleLink} onPressR={this.language} text={I18n.t("IntelligentCooker")} />
        <View style={[styles.paddingH30, styles.flexMainAround, css.container]}>
          <ImageButton onPress={() => { this.jump("TimingCooker") }} 
            source={require('../assets/images/zj.png')} 
            text={I18n.t("timingCooker")} />
          <ImageButton onPress={() => { this.jump("Hood") }} 
            source={require('../assets/images/yj.png')} 
            text={I18n.t("hood")} />
        </View>
        
        { this.renderLangView() }
        { this.renderBLEPairingView() }
      </View>
    )
  }
  // 语言弹窗
  renderLangView = () => {
    return (
      <Modal isVisible={this.state.isVisible} 
        style={css.modal}
        coverScreen={ false }
        scrollOffsetMax={height - 200}
        onBackdropPress={this.closeModal}
        onBackButtonPress={this.closeModal}>
          <View style={css.mask}>
            <FlatList showsVerticalScrollIndicator={false}
              style={[styles.container, {backgroundColor: '#fff'}]}
              keyExtractor={(item, index) => index.toString()}
              data={this.lang} 
              renderItem={(item) => this.renderLanguageItemView(item)} />
          </View>
      </Modal>
    )
  }
  renderLanguageItemView = ({item, index}) => {
    return (
      <TouchableOpacity style={css.selectList} onPress={() => { this.setLanguage(item) }}>
        <Text key={index} style={css.selectText}>{item.name}</Text>
      </TouchableOpacity>
    )
  }
  // ble配对弹窗
  renderBLEPairingView = () => {
    const list = Array.from(this.state.peripherals.values())
    return (
      <Modal isVisible={ this.state.isDisplay }
        style={ css.modal }
        coverScreen={ false }
        scrollOffsetMax={ height - 200 }
        onBackdropPress={ this.closeBLEModal }
        onBackButtonPress={ this.closeBLEModal }>
          <View style={[css.mask, css.mask4]}>
            <FlatList showsVerticalScrollIndicator={ false }
              refreshControl={
                <RefreshControl
                  refreshing={this.state.scaning}
                  tintColor={"#BCD6ED"}
                  colors={["#BCD6ED"]}
                  onRefresh={ this.startScan }
                />
              }
              style={[styles.container, {backgroundColor: '#fff'}]}
              keyExtractor={ item => item.id }
              data={ list } 
              ListHeaderComponent={ this.renderBLEHeaderView }
              renderItem={ ({ item }) => this.renderBLEItemView(item) } />
          </View>
      </Modal>
    )
  }
  renderBLEHeaderView = () => {
    return (
      <Text style={{paddingHorizontal: 10}}>设备列表</Text>
    )
  }
  renderBLEItemView = item => {
    const color = this.state.connected === item.id ? "#BCD6ED" : '#f2f2f2'
    return (
      <View>
      <TouchableOpacity onPress={ () => this.link(item) }>
        <View style={{backgroundColor: color, marginHorizontal: 10, marginVertical: 5, paddingTop: 5}}>
          <Text style={{fontSize: 12, textAlign: 'center', color: '#333333', padding: 5}}>{item.name}</Text>
          <Text style={{fontSize: 10, textAlign: 'center', color: '#333333', padding: 2}}>RSSI: {item.rssi}</Text>
          <Text style={{fontSize: 8, textAlign: 'center', color: '#333333', padding: 2, paddingBottom: 10}}>{item.id}</Text>
        </View>
      </TouchableOpacity>
      </View>
    )
  }
}

const css = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 80
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  mask: {
    height: 200,
    borderRadius: 5,
    paddingVertical: 39,
    backgroundColor: "#FFFFFF"
  },
  mask4: {
    height: 400,
  },
  selectList: {
    paddingVertical: 10,
    textAlign: "center",
  },
  selectText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    textAlign: "center"
  },
})

export default Home
