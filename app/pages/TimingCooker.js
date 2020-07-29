import React, { PureComponent } from 'react'
import { View, SafeAreaView, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import I18n from 'i18n-js'
import Icon from 'react-native-vector-icons/Ionicons'

import { Header, IconButton, Picker, Text, TouchableOpacity } from '../components'
import styles from '../styles'
import { NavigationActions, Config, Toast } from '../utils'

@connect(({ app }) => ({ ...app }))
class TimingCooker extends PureComponent {
  constructor(props){
    super(props)
    this.pickerVal = Array(10).fill('').map((item, i) => i+'')
    this.pickerVal9 = Array(9).fill('').map((item, i) => i+'')
    this.pickerVal0 = ['0']
    this.colorOn = { color: "#6CD6ED" }
    this.colorOff = { color: '#444' }
    this.t = { color: 'transparent' }
    this.r = { color: 'red' }
    this.b = { color: 'blue' }
    this.state = {
      leftFire: false,
      bluetooth: false,
      battery: false,
      rightFire: false,
      leftStart: false,
      rightStart: false,
      leftPower: false,
      rightPower: false,
      selectedItem : {
        l1: 0,
        l2: 0,
        l3: 0,
        r1: 0,
        r2: 0,
        r3: 0,
      },
      refresh: false,
      countLeft: '00',
      minuteLeft1: ['0', '1'],
      minuteLeft2: this.pickerVal,
      minuteLeft3: this.pickerVal,
      countRight: '00',
      minuteRight1: ['0', '1'],
      minuteRight2: this.pickerVal,
      minuteRight3: this.pickerVal,
      
    }
  }

  back = () => {
    this.props.dispatch(NavigationActions.back())
  }

  ctrlPower = name => {
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
  ctrlStart = name => {
    const { selectedItem } = this.state
    let timeHex = ''
    let time = 0
    if(name == 'leftStart'){
      time = selectedItem.l1 * 100 + selectedItem.l2 * 10 + selectedItem.l3
    }else{
      time = selectedItem.r1 * 100 + selectedItem.r2 * 10 + selectedItem.r3
    }
    let hour = Math.floor(time / 60)
    let minute = time % 60
    console.log(hour, minute)
    hour = hour.toString(16)
    minute = minute.toString(16)
    if(hour.length == 1){
      hour = '0' + hour
    }
    if(minute.length == 1){
      minute = '0' + minute
    }
    timeHex = hour + minute + '00'
    let i = Config.prefix + '03' + Config.Instructions[name] + timeHex + Config.address
    let hexStr = BluetoothProtocol.check(i)
    let instructions = i + hexStr
    console.log(name, instructions)
    BluetoothManager.writeWithoutResponse(instructions, 0).then(() => {
      this.setState({ gear: name })
      this.props.dispatch(createAction("app/updateState")({ gear: name }))
    }).catch((err) => {})
  }
  onPickerSelect (index, name) {
    let { selectedItem } = this.state
    selectedItem[name] = index

    let minuteLeft2 = this.pickerVal,
      minuteLeft3 = this.pickerVal,
      minuteRight2 = this.pickerVal,
      minuteRight3 = this.pickerVal
    if(selectedItem.l1 == 1){
      minuteLeft2 = this.pickerVal9
      if(selectedItem.l2 >= 8){
        selectedItem.l2 = 8
        minuteLeft3 = this.pickerVal0
        if(selectedItem.l3 > 0){
          selectedItem.l3 = 0
        }
      }
    }
    if(selectedItem.r1 == 1){
      minuteRight2 = this.pickerVal9
      if(selectedItem.r2 >= 8){
        selectedItem.r2 = 8
        minuteRight3 = this.pickerVal0
        if(selectedItem.r3 >= 0){
          selectedItem.r3 = 0
        }
      }
    }
    this.setState({ 
      selectedItem,
      minuteLeft2,
      minuteLeft3,
      minuteRight2,
      minuteRight3,
      refresh: !this.state.refresh
    })
    
	}

  renderIconBtnView = () => {
    let color1 = this.t,
      color2 = this.t,
      color3 = this.t,
      color4 = this.t
    if(this.props.connected){
      color2 = this.colorOn
    }
    if(this.props.receive.icon == 1){
      if(this.props.receive.key == 82){
        color1 = this.b
      }else if(this.props.receive.key == 83){
        color4 = this.b
      }
    }
    if(this.props.receive.elec <= 20){
      color3 = this.r
    }else{
      color3 = { color: 'green' }
    }
    // console.log(color2)
    return (
      <View style={[styles.flexSubAround, styles.marginV20]}>
        <IconButton icon={Config.icon.fire} color={color1} />
        <IconButton icon={Config.icon.bluetooth} color={color2} />
        <IconButton text={this.props.receive.elec+'%'} icon={Config.icon.battery} color={color3} />
        <IconButton icon={Config.icon.fire} color={color4} />
      </View>
    )
  }
  renderStartBtnView = () => {
    const { leftStart, rightStart } = this.state
    const color1 = leftStart ? this.colorOn : ''
    const color2 = rightStart ? this.colorOn : ''
    return (
      <View style={[styles.flexSubAround, styles.marginV20]}>
        <TouchableOpacity onPress={() => { this.ctrlStart('leftStart') }} style={[styles.rectBox, styles.flexSubAround]}>
          <Text style={[css.primary, color1]}>左启动</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { this.ctrlStart('rightStart') }} style={[styles.rectBox, styles.flexSubAround]}>
          <Text style={[css.primary, color2]}>右启动</Text>
        </TouchableOpacity>
      </View>
    )
  }
  renderPowerBtnView = () => {
    const { leftPower, rightPower } = this.state
    const color1 = leftPower ? this.colorOn.color : css.primary.color
    const color2 = rightPower ? this.colorOn.color : css.primary.color
    return (
      <View style={[styles.flexSubAround, styles.marginV20]}>
        <TouchableOpacity onPress={() => {this.ctrlPower('leftPower')}} style={[styles.flexCenter, styles.power]} >
          {/* <Text style={[styles.icon, css.primary, color1]}>{Config.icon.power}</Text> */}
          <Icon name={"ios-power"} color={color1} size={30} />
        </TouchableOpacity>
      
        <TouchableOpacity onPress={() => {this.ctrlPower('rightPower')}} style={[styles.flexCenter, styles.power]} >
          {/* <Text style={[styles.icon, css.primary, color2]}>{Config.icon.power}</Text> */}
          <Icon name={"ios-power"} color={color2} size={30} />
        </TouchableOpacity>
      </View>
    )
  }
  
  render() {
    return (
      <View style={[styles.container]}>
        <SafeAreaView />
        <Header lIcon={Config.icon.back} onPressL={this.back} text={I18n.t("timingCooker")} />
        
        <View style={styles.paddingH20}>
          {this.renderIconBtnView()}

          <View style={[styles.flexSubBetween, styles.marginV20]}>
            <View style={{paddingHorizontal: 20, flexDirection: "row",}}>
              <Picker 
                data={this.state.minuteLeft1}
                selectedValue={this.state.selectedItem.l1}
                onValueChange={(index) => this.onPickerSelect(index, 'l1')} />
              <Picker 
                data={this.state.minuteLeft2}
                selectedValue={this.state.selectedItem.l2}
                onValueChange={(index) => this.onPickerSelect(index, 'l2')} />
              <Picker 
                data={this.state.minuteLeft3}
                selectedValue={this.state.selectedItem.l3}
                onValueChange={(index) => this.onPickerSelect(index, 'l3')} />
              <View style={{alignItems: "center",justifyContent: "center", marginTop: 5}}>
                <Text style={css.sencend}>{this.state.countLeft}</Text>
              </View>
            </View>
            <View style={{paddingHorizontal: 20, flexDirection: "row"}}>
              <Picker 
                data={this.state.minuteRight1}
                selectedValue={this.state.selectedItem.r1}
                onValueChange={(index) => this.onPickerSelect(index, 'r1')} />
              <Picker 
                data={this.state.minuteRight2}
                selectedValue={this.state.selectedItem.r2}
                onValueChange={(index) => this.onPickerSelect(index, 'r2')} />
              <Picker 
                data={this.state.minuteRight3}
                selectedValue={this.state.selectedItem.r3}
                onValueChange={(index) => this.onPickerSelect(index, 'r3')} />
              <View style={{alignItems: "center",justifyContent: "center", marginTop: 5}}>
                <Text style={css.sencend}>{this.state.countRight}</Text>
              </View>
            </View>
          </View>
          
          {this.renderStartBtnView()}
          
          {this.renderPowerBtnView()}
          
        </View>
        
        <View style={styles.ident}>
          <Text style={styles.identText}>古特智能</Text>
        </View>
      </View>
    )
  }
}

const css = StyleSheet.create({
  picker: {
    width: 40,
    height: 180
  },
  primary: {
    color: '#444',
    fontWeight: "600",
  },
  sencend: {
    fontSize: 20,
    color: '#444',
  },
})

export default TimingCooker
