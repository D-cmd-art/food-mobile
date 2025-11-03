import { View, Text } from 'react-native'
import React from 'react'
import { useUserOrders } from '../../hooks/useOrder'
import { useUserStore } from '../../utils/store/userStore'
const Order = () => {
  const {user}=useUserStore();
  const {data,isLoading,error}=useUserOrders(user?.id);
  if(isLoading) return <Text>Loading...</Text>
  console.log(data);
  return (
    <View>
      <Text> Order</Text>
    </View>
  )
}

export default Order