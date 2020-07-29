import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  // icon
  icon: {
    fontFamily: 'iconfont',
    fontSize: 34,
    color: '#444',
  },
  // btn
  rectBox: {
    width: 120,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    elevation:1.5,
  },
  power: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderColor: '#ccc',
    backgroundColor: "#fff",
    elevation:1.5,
  },
  // name
  ident: {
    position: "absolute",
    bottom: 50,
    left: "50%",
    marginLeft: -36
  },
  identText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6CD6ED",
  },

  container: {
    flex: 1,
    backgroundColor: "#BCD6ED"
  },
  // padding
  paddingH20: {
    paddingHorizontal: 20
  },
  paddingH30: {
    paddingHorizontal: 30
  },
  // margin
  marginV20: {
    marginVertical: 20
  },
  // flex
  flexMainAround: {
    justifyContent: "space-around",
    alignItems: "center",
  },
  flexSubAround: {
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row"
  },
  flexSubBetween: {
    flexDirection: "row", 
    justifyContent: "space-between",
    alignItems: "center",
  },
  flexCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
})
