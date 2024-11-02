import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React from 'react';
import Header from '../components/header';
import {useSelector, useDispatch} from 'react-redux';
import {setCred, updateCred} from '../store/slices/homeSlice';
import {useFocusEffect} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import DocumentPicker from 'react-native-document-picker';
import {readFile} from 'react-native-fs';
import {useEffect} from 'react';
import XLSX from 'xlsx';

const Profile = ({navigation}) => {
  const homeData = useSelector(state => state.home);
  const [firstName, setFirstName] = React.useState(homeData?.firstName);
  const [middleName, setMiddleName] = React.useState(homeData?.middleName);
  const [lastName, setLastName] = React.useState(homeData?.lastName);
  const [email, setEmail] = React.useState(homeData?.email);
  const [phone, setPhone] = React.useState(homeData?.phone);
  const [nameOfClass, setNameOfClass] = React.useState(homeData?.class);
  const [roleNumber, setRoleNumber] = React.useState(homeData?.roleNumber);

  const dispatch = useDispatch();
  useFocusEffect(
    React.useCallback(() => {
      setFirstName(homeData?.firstName);
      setMiddleName(homeData?.middleName);
      setLastName(homeData?.lastName);
      setEmail(homeData?.email);
      setPhone(homeData?.phone);
      setNameOfClass(homeData?.class);
      setRoleNumber(homeData?.roleNumber);
    }, [
      homeData?.firstName,
      homeData?.middleName,
      homeData?.lastName,
      homeData?.email,
      homeData?.phone,
      homeData?.class,
      homeData?.roleNumber,
    ]),
  );

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#fff',
        flex: 1,
      }}>
      <Header
        name="Profile"
        login={() => {
          auth()
            .signOut()
            .then(() => {
              console.log('User signed out!');
              dispatch(setCred({email: '', password: '', loggedIn: false}));
              navigation.popToTop();
            });
        }}
      />
      <ScrollView style={{marginTop: 10, padding: 24}}>
        <View style={styles.flex}>
          <View style={styles.first}>
            {/* <View style={{position: 'relative'}}>
              <Image
                source={{uri: 'https://i.pravatar.cc/100'}}
                style={{width: 100, height: 100}}
              />
              <Image
                source={require('../assets/images/add-icon.png')}
                style={{
                  width: 30,
                  height: 30,
                  position: 'absolute',
                  bottom: -15,
                  right: -10,
                }}
              />
            </View> */}
            {homeData?.userRole === 'SuperAdmin' && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Admin')}>
                <Text style={styles.buttonText}>Admin Portal</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('change')}>
              <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.second}>
          <Text style={styles.label}>First Name*</Text>
          <TextInput
            style={styles.input}
            onChangeText={setFirstName}
            value={firstName}
            placeholder="Username"
            placeholderTextColor={'#000'}
          />
          <Text style={styles.label}>Middle Name*</Text>
          <TextInput
            style={styles.input}
            onChangeText={setMiddleName}
            value={middleName}
            placeholder="Username"
            placeholderTextColor={'#000'}
          />
          <Text style={styles.label}>Last Name*</Text>
          <TextInput
            style={styles.input}
            onChangeText={setLastName}
            value={lastName}
            placeholder="Username"
            placeholderTextColor={'#000'}
          />
          <Text style={styles.label}>Email*</Text>
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Username"
            placeholderTextColor={'#000'}
          />
          <Text style={styles.label}>Phone Number*</Text>
          <TextInput
            style={styles.input}
            onChangeText={setPhone}
            value={phone}
            placeholder="Username"
            placeholderTextColor={'#000'}
          />
          <Text style={styles.label}>Class*</Text>
          <TextInput
            style={styles.input}
            onChangeText={setNameOfClass}
            value={nameOfClass}
            placeholder="Username"
            placeholderTextColor={'#000'}
          />
          <Text style={styles.label}>Role number*</Text>
          <TextInput
            style={styles.input}
            onChangeText={setRoleNumber}
            value={roleNumber}
            placeholder="Username"
            placeholderTextColor={'#000'}
          />
          {/* <TouchableOpacity
            style={styles.button}
            onPress={() => {
              dispatch(
                updateCred({
                  firstName,
                  middleName,
                  lastName,
                  email,
                  phone,
                  class: nameOfClass,
                  roleNumber,
                }),
                Alert.alert('updated successfully'),
              );
            }}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  first: {
    alignItems: 'center',
  },
  second: {
    marginTop: 16,
    paddingBottom: 40,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#00420C',
    lineHeight: 20,
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#B3B3B3',
    color: '#000',
    padding: 0,
    height: 30,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#003B70',
    opacity: 0.9,
    padding: 12,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'Nunito-Regular',
    color: '#fff',
    lineHeight: 30,
    textAlign: 'center',
  },
});

export default Profile;
