import React, { PureComponent } from 'react'
import { View, SafeAreaView, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import I18n from 'i18n-js'
import Icon from 'react-native-vector-icons/Ionicons'

import { Header, TouchableOpacity, Text } from '../components'
import styles from '../styles'
import { NavigationActions, Config } from '../utils'

@connect(({ app }) => ({ ...app }))
class Home extends PureComponent {
  constructor(props){
    super(props)
    this.colorOn = { color: "#6CD6ED" }
    this.colorOff = { color: '#444' }
    this.gear = [
      {code: 'gear1', name: '一档'},
      {code: 'gear2', name: '二档'},
      {code: 'gear3', name: '三档'},
    ]
    this.state = {
      power: false,
      gear: false,
      lighting: false,
      clean: false,
    }
  }
  back = () => {
    this.props.dispatch(NavigationActions.back())
  }
  ctrlPower = (name) => {
    let instructions = '';
    if(this.state[name]){
      let _name = name + '1'
      // 执行关逻辑
      let i = Config.prefix + '04' + Config.Instructions[_name] +'000000' + Config.address
      let hexStr = BluetoothProtocol.check(i)
      instructions = i + hexStr
    }else{
      let _name = name + '0'
      // 执行开逻辑
      let i = Config.prefix + '00' + Config.Instructions[_name] +'000000' + Config.address
      let hexStr = BluetoothProtocol.check(i)
      instructions = i + hexStr
    }
    console.log(instructions)
    BluetoothManager.writeWithoutResponse(instructions, 0).then(() => {
      this.setState({
        [name]: !this.state[name]
      })
      this.props.dispatch(createAction("app/updateState")({ [name]: true }))
    }).catch((err) => {})
  }
  ctrlGear = (name) => {
    let i = Config.prefix + '03' + Config.Instructions[name] +'000000' + Config.address
    let hexStr = BluetoothProtocol.check(i)
    let instructions = i + hexStr
    console.log(name, instructions)
    BluetoothManager.writeWithoutResponse(instructions, 0).then(() => {
      this.setState({ gear: name })
      this.props.dispatch(createAction("app/updateState")({ gear: name }))
    }).catch((err) => {})
  }
  ctrlOtherPower = name => {
    let instructions = '';
    if(this.state[name]){
      // 执行关逻辑
      let _name = name + '1'
      let i = Config.prefix + '03'+ Config.Instructions[_name] +'000000' + Config.address
      let hexStr = BluetoothProtocol.check(i)
      instructions = i + hexStr
    }else{
      // 执行开逻辑
      let _name = name + '0'
      let i = Config.prefix + '04'+ Config.Instructions[_name] +'000000' + Config.address
      let hexStr = BluetoothProtocol.check(i)
      instructions = i + hexStr
    }
    console.log(BluetoothManager)
    BluetoothManager.writeWithoutResponse(instructions, 0).then(() => {
      this.setState({
        [name]: !this.state[name]
      })
      this.props.dispatch(createAction("app/updateState")({ [name]: true }))
    }).catch((err) => {})
  }
  renderPowerView = () => {
    const { power } = this.state
    const color = power ? this.colorOn : ''
    return (
      <View style={[styles.flexSubAround, css.marginV50]}>
        <TouchableOpacity onPress={() => { this.ctrlPower('power') }} style={[styles.flexCenter, styles.power]} >
          {/* <Text style={[styles.icon, css.primary, color]}>{Config.icon.power}</Text> */}
          <Icon name={"ios-power"} color={css.primary.color} size={30} />
        </TouchableOpacity>
      </View>
    )
  }
  renderGearView = () => {
    return this.gear.map((item, idx)=>{
      const { gear } = this.state
      const color = gear == item.code ? this.colorOn : ''
      return (
        <TouchableOpacity key={item.code} onPress={() => { this.ctrlGear(item.code) }} style={[styles.rectBox, styles.flexSubAround, css.rectBox]}>
          <Text style={[css.primary, color]}>{item.name}</Text>
        </TouchableOpacity>
      )
    })
  }
  renderLightingView = () => {
    const { lighting } = this.state
    const color = lighting ? this.colorOn : ''
    return (
      <TouchableOpacity onPress={() => { this.ctrlOtherPower('lighting') }} style={[styles.rectBox, styles.flexSubAround, css.rectBox]}>
        <Text style={[css.primary, color]}>灯光</Text>
      </TouchableOpacity>
    )
  }
  renderCleanView = () => {
    const { clean } = this.state
    const color = clean ? this.colorOn : ''
    return (
      <TouchableOpacity onPress={() => { this.ctrlOtherPower('clean') }} style={[styles.rectBox, styles.flexSubAround, css.rectBox]}>
        <Text style={[css.primary, color]}>清洗</Text>
      </TouchableOpacity>
    )
  }
  render() {
    return (
      <View style={[styles.container]}>
        <SafeAreaView />
        <Header lIcon={Config.icon.back} onPressL={this.back} text={I18n.t("hood")} />
        
        {this.renderPowerView()}
        <View style={[styles.flexSubAround, styles.marginV20]}>
          {this.renderGearView()}
        </View>
        <View style={[styles.flexSubAround, styles.marginV20]}>
          {this.renderLightingView()}
          <Text style={css.rectBox} />
          {this.renderCleanView()}
        </View>
        
        <View style={styles.ident}>
          <Text style={styles.identText}>古特智能</Text>
        </View>
      </View>
    )
  }
}

const css = StyleSheet.create({
  primary: {
    color: '#444',
    fontWeight: "600",
  },
  marginV50: {
    marginVertical: 50,
  },
  rectBox: {
    width: 100,
    height: 40,
  },
})

export default Home
