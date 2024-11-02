import {Text, Image, SafeAreaView, StyleSheet, View} from 'react-native';
import React from 'react';
import Header from '../components/header';
import {useSelector, useDispatch} from 'react-redux';
import {setCred} from '../store/slices/homeSlice';
import auth from '@react-native-firebase/auth';

const School = ({navigation}) => {
  const dispatch = useDispatch();
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#fff',
        flex: 1,
      }}>
      <Header
        name="Dashboard"
        login={() => {
          auth()
          .signOut()
          .then(() => {
          console.log('User signed out!')
          dispatch(setCred({username: '', password: '', loggedIn: false}));
          navigation.popToTop();
          });
        }}
      />
      <View style={{marginTop: 10, padding: 24}}>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={require('../assets/images/nvm.jpeg')}
            style={styles.img}
          />
        </View>
        <Text style={styles.desc}>
          This university typically offers undergraduate and graduate, programs
          in various fields of study. It is well known for its commitment to
          academic excellence, research, and the development of students'
          critical thinking and problem-solving skills. University often have
          diverse faculties, including liberal arts, sciences, engineering,
          business, and more, allowing students to pursue a wide range of
          academic disciplines. They also play a crucial role in advancing
          knowledge through research and innovation, making significant
          contributions to society and the global economy.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  desc: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#000',
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 16,
  },
  img: {
    resizeMode: 'contain',
    flex: 1,
    aspectRatio: 1.5, // Your aspect ratio
  },
});

export default School;
