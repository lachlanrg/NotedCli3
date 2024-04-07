// loginScreen.tsx
import * as React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { signIn, type SignInInput } from 'aws-amplify/auth';
import { signOut} from 'aws-amplify/auth';


type LoginScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  async function handleSignIn() {
    try {
      console.log('Attempting sign in with username:', username);
      const { isSignedIn, nextStep } = await signIn({ username, password });
      // Handle successful sign-in
      navigation.navigate('Main');

      console.log('Sign in successful:', isSignedIn);
      console.log('Next step:', nextStep);

    } catch (error: any) {
      console.log('error signing in', error);
      Alert.alert('Error signing in', error.message);
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      navigation.navigate('Login');
      console.log('User Signed Out');


    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login - awsauth branch</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity activeOpacity={0.7} style={styles.button} onPress={() => handleSignIn()}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} style={styles.button} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <Button title="Logout" onPress={(handleSignOut)} />

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: 'column', // Change this line
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    width: '40%', // reduced width
    backgroundColor: '#007BFF',
    borderRadius: 10,
    padding: 10, // reduced padding
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;
