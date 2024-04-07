// SignUpScreen.tsx
import * as React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { signUp } from 'aws-amplify/auth';
import { autoSignIn } from 'aws-amplify/auth';
import { signIn } from 'aws-amplify/auth';
import { confirmSignUp, type ConfirmSignUpInput } from 'aws-amplify/auth';


type SignUpScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

type SignUpParameters = {
  username: string;
  password: string;
  email: string;
};

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmationCode, setConfirmationCode] = React.useState('');
  const [isConfirmationStep, setIsConfirmationStep] = React.useState(false);

  const handleSignUp = async () => {
    try {
      console.log('Attempting sign up with username: ', username, 'email: ', email, 'and password:', password);

      await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
          },
          autoSignIn: true,
        },
      });
      
      setIsConfirmationStep(true);

      console.log('Sign up successful for user:', username);

    } catch (error: any) {
      console.error('Error signing up:', error);
      Alert.alert('Error signing up:', error.message);
    }
  };

  const handleConfirmation = async () => {
    try {
      console.log('Confirming sign up with username: ', username, 'and confirmation code:', confirmationCode);

      await confirmSignUp({
        username,
        confirmationCode,
      });

      await handleAutoSignIn();
      navigation.navigate('Main');

      console.log('Sign up confirmed for user:', username);

    } catch (error: any) {
      console.error('Error confirming sign up:', error);
      Alert.alert('Error confirming sign up:', error.message);
    }
  };

  async function handleAutoSignIn() {
    try {
      await autoSignIn();
      // handle sign-in steps
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      {isConfirmationStep ? (
        <>
          <Text style={styles.title}>Confirm Sign Up</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirmation Code"
            value={confirmationCode}
            onChangeText={setConfirmationCode}
            keyboardType="numeric"
            autoCapitalize="none"
          />
          <Button title="Confirm Sign Up" onPress={handleConfirmation}/>
        </>
      ) : (
        <>
          <Text style={styles.title}>Sign Up</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
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
          <Button title="Sign Up" onPress={handleSignUp}/>
          <Button title="Back to Login" onPress={() => navigation.navigate('Login')}/>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default SignUpScreen;