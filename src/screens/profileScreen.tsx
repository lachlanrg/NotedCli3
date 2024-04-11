// profileScreen.tsx
import * as React from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { signOut, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { confirmSignUp, type ConfirmSignUpInput } from 'aws-amplify/auth';


type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [userInfo, setUserInfo] = React.useState<any>(null);
  const [email, setEmail] = React.useState<string | null>(null);
  // const [confirmationCode, setConfirmationCode] = React.useState('');
  // const [username, setUsername] = React.useState('');

  React.useEffect(() => {
    currentAuthenticatedUser();
    UserAttributes();
  }, []);

  async function currentAuthenticatedUser() {
    try {
      const { username, userId, signInDetails } = await getCurrentUser();
      console.log(`The username: ${username}`);
      console.log(`The userId: ${userId}`);
      console.log(`The signInDetails: ${signInDetails}`);

      setUserInfo({ username, userId, signInDetails });
    } catch (err) {
      console.log(err);
    }
  }

  const UserAttributes = async () => {
    try {
      const userAttributes = await fetchUserAttributes();
      if (userAttributes.email) {
        setEmail(userAttributes.email);
      } else {
        console.log('Email attribute is undefined');
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      navigation.navigate('Login');

    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  // const handleSignUpConfirmation = async () => {
  //   try {
  //     const { isSignUpComplete, nextStep } = await confirmSignUp({
  //       username,
  //       confirmationCode, // Pass the confirmationCode state here
  //     });
  //     // Handle successful confirmation
  //   } catch (error: any) {
  //     console.error('Error confirming sign up', error);
  //     Alert.alert('Error confirming sign up', error.message);
  //   }
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      {userInfo && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfo}>Username: {userInfo.username}</Text>
          <Text style={styles.userInfo}>User ID: {userInfo.userId}</Text>
          <Text style={styles.userInfo}>Sign In Details: {JSON.stringify(userInfo.signInDetails)}</Text>
          {email && <Text style={styles.userInfo}>Email: {email}</Text>}
        </View>
      )}
      <Button title="Logout" onPress={handleSignOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  userInfoContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    alignSelf: 'stretch',
  },
  userInfo: {
    marginBottom: 10,
  },
});

export default ProfileScreen;


   {/* <View> */}
      {/* <Text>Enter Confirmation Code:</Text>
        <TextInput
        style={styles.input}
        placeholder="Confirmation Code"
        value={confirmationCode}
        onChangeText={setConfirmationCode}
        autoCapitalize="none"
      />
      <Button title="Confirm" onPress={handleSignUpConfirmation} /> Remove the () from the function call */}   
         {/* </View> */}