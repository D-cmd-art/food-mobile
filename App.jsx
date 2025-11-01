import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from './src/pages/CartContext.js';
import { FavoritesProvider } from './src/pages/FavoritesContext.js';
import { useUserStore } from './src/utils/store/userStore.js';
import { getTokens } from './src/utils/tokenStorage.js';
import {jwtDecode} from 'jwt-decode';

// Screens
import Welcome from './src/pages/welcomescreen.js';
import Login from './src/pages/login.js';
import Register from './src/pages/register.js';
import Tabs from './src/navigation.js';
import ResturantFood from './src/pages/Home/Resturantfood.js';
import subcategory from './src/pages/Home/Subcategories.js';
import ALlFood from './src/pages/Home/Allfood.js';
import HelpAndSupport from './src/pages/setting/Helpandsupports.js';
import Wallets from './src/pages/setting/Wallets.js';
import MapPicker from './src/pages/setting/MapTilerPicker.js';
import ReferandEarn from './src/pages/setting/ReferEarn.js';
import Order from './src/pages/setting/order.js';
import ProfileDetails from './src/pages/setting/ProfileDetails.js';
import Addtocart from './src/pages/addtocart.js';
import ConfirmOrder from './src/pages/confirmorder.js';
import TermsAndConditions from './src/pages/setting/Terms.js';
import Cashback from './src/pages/setting/Cashback.js';
import PrivatePolicy from './src/pages/setting/Privacy.js';
import Aboutus from './src/pages/setting/Aboutus.js';
import Favourites from './src/pages/favourite.js';
import Search from './src/pages/Home/Search.js';
import SplashScreen from './src/pages/SplashScreen.js';
import location from './src/pages/Home/location.js';
import { Text } from 'react-native';

const queryClient = new QueryClient();
const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Welcome" component={Welcome} />
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
    </AuthStack.Navigator>
  );
}

function AppNavigator() {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="Tabs" component={Tabs} />
      <AppStack.Screen name="subcategory" component={subcategory} />
      <AppStack.Screen name="location" component={location} />
      <AppStack.Screen name="AllFood" component={ALlFood} />
      <AppStack.Screen name="HelpAndSupport" component={HelpAndSupport} />
      <AppStack.Screen name="Favourites" component={Favourites} />
      <AppStack.Screen name="Search" component={Search} />
      <AppStack.Screen name="Order" component={Order} />
      <AppStack.Screen name="Wallets" component={Wallets} />
      <AppStack.Screen name="ProfileDetails" component={ProfileDetails} />
      <AppStack.Screen name="ResturantFood" component={ResturantFood} />
      <AppStack.Screen name="ConfirmOrder" component={ConfirmOrder} />
      <AppStack.Screen name="MapPicker" component={MapPicker} />
      <AppStack.Screen name="ReferandEarn" component={ReferandEarn} />
      <AppStack.Screen name="Aboutus" component={Aboutus} />
      <AppStack.Screen name="Cashback" component={Cashback} />
      <AppStack.Screen name="PrivacyPolicy" component={PrivatePolicy} />
      <AppStack.Screen name="TermsAndConditions" component={TermsAndConditions} />
      <AppStack.Screen name="Addtocarts" component={Addtocart} />
      <AppStack.Screen name="splashScreen" component={SplashScreen} />
      
    </AppStack.Navigator>
  );
}

export default function App() {
  const { user, setUser } = useUserStore();
  const [showSplash, setShowSplash] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkStoredToken = async () => {
      try {
        const tokens = await getTokens();
        if (tokens?.accessToken) {
          const decoded = jwtDecode(tokens.accessToken);
          console.log(decoded);
          setUser(decoded);
        }
      } catch (err) {
        console.warn('Token check failed:', err);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkStoredToken();

    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(splashTimer);
  }, []);

  // ✅ Render SplashScreen directly as a component
  if (showSplash || checkingAuth) {
    return <SplashScreen/>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        <CartProvider>
          <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
              {user?.name ? (
                <RootStack.Screen name="App" component={AppNavigator} />
              ) : (
                <RootStack.Screen name="Auth" component={AuthNavigator} />
              )}
            </RootStack.Navigator>
          </NavigationContainer>
        </CartProvider>
      </FavoritesProvider>
    </QueryClientProvider>
  );
}