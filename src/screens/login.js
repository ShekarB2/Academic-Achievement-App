import auth from '@react-native-firebase/auth';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  Image,
  Text,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {fetchUserData} from '../api/auth';

// store
import {setCred} from '../store/slices/homeSlice';

const Login = ({route, navigation}) => {
  // const {type} = route.params;
  const homeData = useSelector(state => state.home);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const dispatch = useDispatch();
  const [message, setMessage] = React.useState('');

  const HandleLogin = async () => {
    if (!email && !password) {
      dispatch(setCred({email: '', password: ''}));
      Alert.alert('email and password is required');
    } else {
      if (email && password) {
        try {
          console.log(email);
          const isUserCreated = await auth().signInWithEmailAndPassword(
            email.trim(),
            password,
          );
          const additionalDetails = await fetchUserData(isUserCreated.user.uid);
          console.log('creds', isUserCreated, additionalDetails);
          dispatch(
            setCred({
              email: email,
              password: password,
              loggedIn: true,
              class: additionalDetails.class,
              firstName: additionalDetails.firstName,
              lastName: additionalDetails.lastName,
              middleName: additionalDetails.middleName,
              phone: additionalDetails.phone,
              roleNumber: additionalDetails.roleNumber,
              userRole: additionalDetails.userRole,
              dept: additionalDetails.dept ? additionalDetails.dept : '',
              course: additionalDetails.course ? additionalDetails.course : '',
            }),
          );
          navigation.navigate('Dashboard');
        } catch (err) {
          console.log(err.message);
          setMessage(err.message);
          Alert.alert('email and password is incorrect');
        }
      } else {
        dispatch(setCred({email: '', password: ''}));
        Alert.alert('email or password is incorrect');
      }
    }
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#fff',
        flex: 1,
      }}>
      <View>
        <Image
          source={require('../assets/images/head.png')}
          style={styles.img}
        />

        <View
          style={{
            padding: 24,
          }}>
          <TextInput
            style={styles.input}
            onChangeText={value => setEmail(value)}
            value={email}
            placeholder="Email"
            placeholderTextColor={'#000'}
          />
          <TextInput
            style={styles.input}
            onChangeText={value => setPassword(value)}
            value={password}
            placeholder="Password"
            placeholderTextColor={'#000'}
            secureTextEntry={true}
          />
          <TouchableOpacity style={styles.button} onPress={() => HandleLogin()}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('forgot')}>
            <Text style={styles.text}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    margin: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#B3B3B3',
    padding: 10,
    color: '#000',
  },
  text: {
    fontSize: 20,
    fontFamily: 'Nunito-Regular',
    color: '#000',
    lineHeight: 30,
    textAlign: 'center',
    marginTop: 24,
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'Nunito-Regular',
    color: '#fff',
    lineHeight: 30,
    textAlign: 'center',
  },
  img: {
    resizeMode: 'stretch',
    width: Dimensions.get('screen').width,
  },
  button: {
    backgroundColor: '#003B70',
    opacity: 0.9,
    paddingVertical: 6,
    marginTop: 20,
    width: '94%',
    alignSelf: 'center',
    borderRadius: 8,
  },
});

export default Login;
