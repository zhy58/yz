import React from 'react'
import { RefreshControl } from 'react-native'

const SelfRefreshControl = props => <RefreshControl refreshing={false} tintColor="#00A0E9" colors={["#00A0E9"]} {...props} />

export default SelfRefreshControl