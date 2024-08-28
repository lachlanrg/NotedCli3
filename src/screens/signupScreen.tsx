// SignUpScreen.tsx
import * as React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { 
  signUp,
  autoSignIn,
  getCurrentUser,
  confirmSignUp,
  signIn,
} from 'aws-amplify/auth';
import { dark, light, error, gray, placeholder } from '../components/colorModes';

import { generateClient } from 'aws-amplify/api';
import { createUser } from '../graphql/mutations';

const client = generateClient();

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
  const [activeInput, setActiveInput] = React.useState<string | null>(null);
  
  const handleSignUp = async () => {
    try {
      console.log('Attempting sign up with username: ', username, 'email: ', email, 'and password:', password);

      await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
            'custom:publicProfile': 'false'          
          },
          autoSignIn: true,
        },
      });
      
      setIsConfirmationStep(true);

      console.log('Input - Sign up successful for user:', username);

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
      console.log('Cognito - Sign up confirmed for user:', username);

      const { userId } = await getCurrentUser();
      await createUserInGraphQL(userId);

      navigation.navigate('Main');


    } catch (error: any) {
      console.error('Error confirming sign up:', error);
      Alert.alert('Error confirming sign up:', error.message);
    }
  };

  const createUserInGraphQL = async (userId: string) => {
    try {
      const client = generateClient();
      const user = {
        id: userId,
        username: username,
        email: email,
        publicProfile: false,
      };

      await client.graphql({
        query: createUser,
        variables: { input: user }
      });

      console.log('GraphQL - User successfully created with:', user, "userId:", userId, "username:", username, "email:", email);

    } catch (error: any) {
      console.error('Error creating user in GraphQL:', error);
      Alert.alert('Error creating user in GraphQL:', error.message);
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
            style={[
              styles.input, 
              activeInput === 'confirmationCode' && styles.activeInput 
            ]} 
            placeholder="Confirmation Code"
            value={confirmationCode}
            onChangeText={setConfirmationCode}
            keyboardType="numeric"
            autoCapitalize="none"
            placeholderTextColor={placeholder}
            onFocus={() => setActiveInput('confirmationCode')}
            onBlur={() => setActiveInput(null)}
          />
          <Button title="Confirm Sign Up" onPress={handleConfirmation}/>
          <Button title="Back to Login" onPress={() => navigation.navigate('Login')}/>

        </>
      ) : (
        <>
          <Text style={styles.title}>Sign Up</Text>
          <TextInput
            style={[
              styles.input, 
              activeInput === 'username' && styles.activeInput 
            ]} 
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholderTextColor={placeholder}
            onFocus={() => setActiveInput('username')}
            onBlur={() => setActiveInput(null)}
            maxLength={20}
          />
          <TextInput
            style={[
              styles.input, 
              activeInput === 'email' && styles.activeInput 
            ]} 
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={placeholder}
            onFocus={() => setActiveInput('email')} 
            onBlur={() => setActiveInput(null)}
          />
          <TextInput
            style={[
              styles.input, 
              activeInput === 'password' && styles.activeInput 
            ]} 
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            placeholderTextColor={placeholder}
            onFocus={() => setActiveInput('password')} 
            onBlur={() => setActiveInput(null)}    
          />
          <TouchableOpacity activeOpacity={0.7} style={styles.button} onPress={() => handleSignUp()}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backToLoginButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.backToLoginText}>Back to Login</Text>
          </TouchableOpacity>
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
    backgroundColor: dark,
  },
  title: {
    fontSize: 28,
    fontWeight: '400',
    color: light,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: dark,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: gray,
    fontSize: 16,
    color: light,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    width: '40%', // reduced width
    backgroundColor: '#007BFF',
    borderRadius: 10,
    padding: 10, // reduced padding
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: light,
    fontSize: 16,
    fontWeight: '600',
  },
  backToLoginButton: {
    marginTop: 20,
  },
  backToLoginText: {
    color: '#007BFF',
    fontSize: 18,
  },
  activeInput: {
    borderColor: 'white',
    borderWidth: 0.8,         
  },
});

export default SignUpScreen;