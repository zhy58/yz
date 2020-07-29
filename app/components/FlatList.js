import React from 'react'
import { FlatList } from 'react-native'
import RefreshControl from './RefreshControl'

const refresh = () => {}

const SelfFlatList = ({children, onRefresh, style, ...rest}) => 
{
  return (
    <FlatList showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      refreshControl={
        <RefreshControl
          onRefresh={onRefresh || refresh}
        />
      }
      {...rest}
    />
  )
}

export default SelfFlatList