// loginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

import { signIn, type SignInInput, signOut, getCurrentUser, confirmSignUp, resendSignUpCode, autoSignIn } from 'aws-amplify/auth';
import { dark, light, error, gray, placeholder } from '../components/colorModes';
import { createUser } from '../graphql/mutations';
import { generateClient } from 'aws-amplify/api';
import ConfirmationCodeInput from '../components/ConfirmationCodeInput';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [confirmationEmail, setConfirmationEmail] = useState(''); // New state for email in modal
  const client = generateClient(); 

  const { setIsAuthenticated } = useAuth();

  async function handleSignIn() {
    try {
      console.log('Attempting sign in with username:', username);
      const { isSignedIn, nextStep } = await signIn({ username, password });
      console.log("Is user signed in: ", isSignedIn);

      if (isSignedIn) {
        console.log("Successful Sign In with:", username);
        navigation.navigate('Main'); 
        // navigation.navigate("SignUpSpotifyLogin");

        setIsAuthenticated(true);

      } else if (nextStep && nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        console.log('User not confirmed. Showing confirmation modal...');
        setIsConfirmationModalVisible(true);
      } else {
        console.error('Unexpected sign-in flow or error:', nextStep);
        Alert.alert('Error signing in', 'An unexpected error occurred.');
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      Alert.alert('Error signing in', error.message);
    }
  }

  const handleResendConfirmation = async () => {
    try {
      await resendSignUpCode({ username: username }); // Make sure to call the function
      Alert.alert('Code Resent', 'Please check your email.');
    } catch (error: any) {
      console.error('Error resending confirmation code:', error);
      Alert.alert('Error', error.message);
    }
  };

  const handleConfirmSignIn = async (confirmationCode: string) => {
    try {
      console.log("Confirming sign in with username: ", username, "and email:", confirmationEmail);
  
      await confirmSignUp({username, confirmationCode}); // Pass confirmationCode here

      //  Sign in the user manually after confirmation:
    const { isSignedIn } = await signIn({ username, password });

    if (isSignedIn) {
      console.log("Successful Sign In with:", username);

      const { userId } = await getCurrentUser(); 
      await createUserInGraphQL(userId, confirmationEmail);
      setIsConfirmationModalVisible(false);

      navigation.navigate("SignUpSpotifyLogin");
    } else {
      // Handle signIn error 
      console.error("Error signing in after confirmation");
      Alert.alert("Error", "Failed to sign in after confirmation.");
    }

  } catch (error: any) {
    console.error("Error confirming sign in:", error);
    Alert.alert("Error confirming sign in:", error.message);
  }
};

  const createUserInGraphQL = async (userId: string, userEmail: string) => { // Add userEmail parameter
    try {
      const client = generateClient();
      const user = {
        id: userId,
        username: username,
        email: userEmail,
        publicProfile: true,
      };

      await client.graphql({
        query: createUser,
        variables: { input: user }
      });

      console.log('GraphQL - User successfully created with:', user, "userId:", userId, "username:", username, "email:", userEmail);

    } catch (error: any) {
      console.error('Error creating user in GraphQL:', error);
      Alert.alert('Error creating user in GraphQL:', error.message);
    }
  };

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
    <SafeAreaView style={styles.safeAreaContainer}> 

    <View style={styles.container}>
      <Text style={styles.title}>Login - awsauth branch</Text>
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity activeOpacity={0.7} style={styles.button} onPress={() => handleSignIn()}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.signUpRow}>
          <Text style={styles.signupText}>
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <Button title="Logout" onPress={(handleSignOut)} />

        {/* Confirmation Modal  */}
        <Modal
          visible={isConfirmationModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsConfirmationModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirm Your Email</Text>

              <TextInput
                style={styles.modalInput}
                placeholder="Enter your email"
                value={confirmationEmail}
                onChangeText={setConfirmationEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <TouchableOpacity onPress={handleResendConfirmation}>
                <Text style={styles.resendLink}>Resend Code</Text>
              </TouchableOpacity>

              <ConfirmationCodeInput value={confirmationCode} setValue={setConfirmationCode} onComplete={handleConfirmSignIn} />

              <TouchableOpacity 
                activeOpacity={0.7} 
                style={styles.modalButton} 
                // onPress={handleConfirmSignIn} 
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


      </View>
    </View>
    </SafeAreaView>
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
    color: light,
    fontSize: 16,
    fontWeight: '600',
  },
  activeInput: {
    borderColor: 'white',
    borderWidth: 0.8,         
  },
  signUpRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  signupText: {
    color: light,
    fontSize: 16,
  },
  signupLink: {
    color: '#007BFF', 
    fontWeight: '600',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)', 
    paddingBottom: 120,
  },
  modalContent: {
    width: '85%', // Adjust width as needed
    backgroundColor: dark, // Match background color
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 28, 
    fontWeight: '400',
    color: light, 
    marginBottom: 20,
  },
  modalInput: { // Style for modal TextInputs
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
  },
  modalButton: { // Style for the modal Confirm button
    width: '40%', 
    backgroundColor: '#007BFF',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginTop: 10, 
  },
  modalButtonText: {
    color: light, 
    fontSize: 16,
    fontWeight: '600',
  },
  resendLink: {
    color: '#007BFF',
    marginBottom: 15,
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: dark, // or your background color
  },
});

export default LoginScreen;