import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React from 'react';
import Header from '../components/header';
import {useSelector, useDispatch} from 'react-redux';
import {setCred} from '../store/slices/homeSlice';
import auth from '@react-native-firebase/auth';

const Forgot = ({navigation}) => {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();

  const forgotPassword = async () => {
    if (!email) {
      Alert.alert('Email is required');
      return;
    }
    try {
      setLoading(true);
      await auth().sendPasswordResetEmail(email);
      setLoading(false);
      Alert.alert('Password reset email sent!');
    } catch (error) {
      setLoading(false);
      Alert.alert(`Error sending password reset email:, ${error} `);
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#fff',
        flex: 1,
      }}>
      <Header
        name="Forgot Password"
        login={() => {
          auth()
            .signOut()
            .then(() => {
              console.log('User signed out!');
              dispatch(setCred({username: '', password: '', loggedIn: false}));
              navigation.popToTop();
            });
        }}
      />
      <View style={{padding: 24}}>
        <TextInput
          style={styles.input}
          onChangeText={value => setEmail(value)}
          value={email}
          placeholder="Email"
          placeholderTextColor={'#000'}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={forgotPassword}
          disabled={loading}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
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
  buttonText: {
    fontSize: 20,
    fontFamily: 'Nunito-Regular',
    color: '#fff',
    lineHeight: 30,
    textAlign: 'center',
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

export default Forgot;
