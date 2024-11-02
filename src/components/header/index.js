import React from 'react';
import {StyleSheet, View, Pressable, Image, Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

const Header = props => {
  const homeData = useSelector(state => state.home);
  console.log(homeData?.loggedIn);
  return (
    <View style={styles.headerContainer}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={require('../../assets/images/nlogo.png')}
          style={{width: 30, height: 30, marginLeft: 8}}
        />
      </View>
      <Text style={styles.headerText}>{props.name}</Text>
      {homeData?.loggedIn ? (
        <Pressable onPress={props.login}>
          <Image
            source={require('../../assets/images/signout.png')}
            style={{width: 24, height: 24}}
          />
        </Pressable>
      ) : (
        <View style={{width: 24, height: 24}}></View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#D3D3D3',
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    lineHeight: 24,
    color: '#00420C',
  },
});
export default Header;
