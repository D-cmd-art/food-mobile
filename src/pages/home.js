import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import VegFood from '../pages/Home/VegFood';
import NonVegFood from  '../pages/Home/NonVegFood';
import Slideshow from '../pages/Home/slideshowimage';
import ReferandEarn from '../pages/Home/ReferandEarn';
import Search from '../pages/Home/Search';
import Categories from '../pages/Home/menu';
import BestReviewedFood from '../pages/Home/Bestreviewedfood';
import OrderFood from '../pages/Home/foodlist';
import AllRestaurants from './Home/resturantHome';
import Location from '../pages/Home/location';
import appData from '../data/appData';
import { useNavigation } from '@react-navigation/native';

// Get screen dimensions
const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

const Home = () => {
  const [likedFoods, setLikedFoods] = useState(new Set());
  const navigation = useNavigation();

  const handleFoodLike = (id) => {
    setLikedFoods((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
         
      <FlatList
        style={styles.flatList}
        data={[]} // No actual list data; only header content
        keyExtractor={() => 'dummy'}
        
        ListHeaderComponent={
          <>
         <Location screenOptions={{ headerShown: true }} />
      <TouchableOpacity onPress={() => navigation.navigate("Search")}>
        <View style={styles.Searchbar}>
                   <Text style={styles.addressText}>Search your Favourite foods....</Text>
                 </View>
           </TouchableOpacity>

            {/* Sections */}
            <Slideshow images={appData.slideshowImages} deviceWidth={deviceWidth} style={styles.slideshow} />
            <Categories categories={appData.categories} deviceWidth={deviceWidth} />
            <BestReviewedFood
              foods={appData.bestReviewedFoods}
              likedFoods={likedFoods}
              onLike={handleFoodLike}
              deviceWidth={deviceWidth}
            />
             
              <VegFood/>
              <NonVegFood/>
               <ReferandEarn/>
          

             
            <AllRestaurants
              restaurants={appData.AllRestaurants}
              deviceWidth={deviceWidth}
            />
          </>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f6faff',
    

  },
  flatList: {
    backgroundColor: '#ffffffff',
  },
  header: {
    flexDirection: 'row',

    alignItems: 'left',
    marginBottom: deviceHeight * 0.015,
    paddingHorizontal: deviceWidth * 0.07,
    marginTop: deviceHeight * 0.015,
  },
  location: {
    marginLeft: deviceWidth * 0.01,
    fontWeight: 'italic',
    color: '#1521C4',
    fontSize: deviceWidth * 0.030,
  },
  Searchbar: {
    flexDirection: 'row',
    backgroundColor: '#8c8e8fff',
    paddingHorizontal: deviceWidth * 0.04,
    borderRadius: deviceWidth * 0.06,
    borderColor:"#0144fc99",
    alignItems: 'center',
    marginBottom: deviceHeight * 0.01,
    marginHorizontal: deviceWidth * 0.04,
    paddingVertical: deviceHeight * 0.015,
  },
  

   
  input: {
    flex: 1,
    marginLeft: deviceWidth * 0.001,
    fontSize: deviceWidth * 0.042,
  },
});
