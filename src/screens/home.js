//home page
/* eslint-disable react-native/no-inline-styles */
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';

import {
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';


function Home({navigation}) {
  const backgroundStyle = {
    flex: 1,
    backgroundColor: '#fff',
  };


  return (       
    <SafeAreaView style={backgroundStyle}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Image
          source={require('../assets/images/head.png')}
          style={styles.img}
        />
        <Text style={{...styles.text, marginTop: 40}}>Choose Your Login</Text>
        <View style={styles.head}>

        <View style={{width: '50%', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() =>
                homeData?.loggedIn
                  ? navigation.navigate('Dashboard')
                  : navigation.navigate('Login', {
                      type: 'Super Admin',
                    })
              }>
              <Image
                source={require('../assets/images/admin.png')}
                style={styles.icon}
              />
              <Text style={styles.text}>Super Admin</Text>
            </TouchableOpacity>
          </View>

          
          <View style={{width: '50%', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() =>
                homeData?.loggedIn
                  ? navigation.navigate('Dashboard')
                  : navigation.navigate('Login', {
                      type: 'Admin',
                    })
              }>
              <Image
                source={require('../assets/images/admin.png')}
                style={styles.icon}
              />
              <Text style={styles.text}>Admin</Text>
            </TouchableOpacity>
          </View>

          <View style={{width: '100%', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() =>
                homeData?.loggedIn
                  ? navigation.navigate('Dashboard')
                  : navigation.navigate('Login', {
                      type: 'Teacher',
                    })
              }>
              <Image
                source={require('../assets/images/teacher.png')}
                style={styles.icon}
              />
              <Text style={styles.text}>Teacher</Text>
            </TouchableOpacity>
          </View>
         
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  head: {
    marginTop: 40,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  text: {
    fontSize: 20,
    fontFamily: 'Nunito-Regular',
    color: '#000',
    lineHeight: 30,
    textAlign: 'center',
  },
  img: {
    resizeMode: 'stretch',
    width: Dimensions.get('screen').width,
    paddingVertical: '50' 
  },
  icon: {
    width: 100,
    height: 100,
  
  },
});

export default Home;
