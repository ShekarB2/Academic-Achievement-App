import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../components/header';
import {useSelector, useDispatch} from 'react-redux';
import {setCred} from '../store/slices/homeSlice';
import auth from '@react-native-firebase/auth';

const Change = ({navigation}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();

  const changePassword = async () => {
    if (!newPassword || !currentPassword) {
      Alert.alert('Every field is required');
    }
    try {
      setLoading(true);
      const user = auth().currentUser;
      const credential = auth.EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );
      await user.reauthenticateWithCredential(credential);
      await user.updatePassword(newPassword);
      setLoading(false);
      Alert.alert('Password changed successfully!');
    } catch (error) {
      setLoading(false);
      Alert.alert(`Error changing password:, ${error}`);
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#fff',
        flex: 1,
      }}>
      <Header
        name="Change Password"
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
          onChangeText={setCurrentPassword}
          value={currentPassword}
          placeholder="Old Password"
          placeholderTextColor={'#000'}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          onChangeText={setNewPassword}
          value={newPassword}
          placeholder="New Password"
          placeholderTextColor={'#000'}
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.button}
          onPress={changePassword}
          disabled={loading}>
          <Text style={styles.buttonText}>Reset Password</Text>
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

export default Change;
