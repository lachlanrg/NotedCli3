import * as React from 'react';
import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Button, 
  StyleSheet, 
  TextInput 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { resetPassword, confirmResetPassword, type ResetPasswordOutput, type ConfirmResetPasswordInput, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { dark, light, placeholder, gray, error } from '../../components/colorModes';

const ResetPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [showConfirmationError, setShowConfirmationError] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('start'); // 'start', 'codeSent', 'done'
  const [username, setUsername] = useState('');
  const navigation = useNavigation(); 

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const { username } = await getCurrentUser();
      setUsername(username); 

      const userAttributes = await fetchUserAttributes();
      if (userAttributes.email) {
        setEmail(userAttributes.email);
      } else {
        console.log('Email attribute is undefined');
      }
    } catch (err) {
      console.log('Error fetching user info:', err);
      // Handle error, e.g., redirect to login
    }
  };

  const handleResetPassword = async () => {
    try {
      const output: ResetPasswordOutput = await resetPassword({ username: username }); // Use fetched username
      handleResetPasswordNextSteps(output);
      setIsConfirmingReset(true);
    } catch (error) {
      console.log(error);
      // Handle error, e.g., display an error message to the user
    }
  };

  const handleResetPasswordNextSteps = (output: ResetPasswordOutput) => {
    const { nextStep } = output;
    switch (nextStep.resetPasswordStep) {
      case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
        console.log(`Confirmation code was sent to ${nextStep.codeDeliveryDetails.deliveryMedium}`);
        setCurrentPhase('codeSent');
        break;
      case 'DONE':
        console.log('Successfully reset password.');
        setCurrentPhase('done');
        break;
    }
  };

  const handleConfirmResetPassword = async ({ confirmationCode, newPassword }: ConfirmResetPasswordInput) => {
    try {
      await confirmResetPassword({ username, confirmationCode, newPassword }); 
      console.log('Password reset successful.');
      setCurrentPhase('done');
    } catch (error) {
      console.log(error);
      // Handle error, e.g., display an error message to the user
    }
  };

  const handleConfirmReset = () => {
    if (newPassword !== confirmNewPassword) {
      setShowConfirmationError(true);
      return;
    }

    setShowConfirmationError(false); 
    handleConfirmResetPassword({ username: email, confirmationCode, newPassword });
  };

  return (
    <View style={styles.container}>
      {currentPhase === 'start' && (
        <View style={styles.content}>
          <Text style={styles.title}>Reset password for <Text style={styles.username}>{username}</Text></Text> 
          <Text style={styles.subtitle}>Send email to {email}</Text>
          <Button title="Send Reset Code" onPress={handleResetPassword} />
        </View>
      )}

      {currentPhase === 'codeSent' && (
        <View style={styles.content}>
          <Text style={styles.title}>Enter Code and New Password</Text>
          <TextInput
            placeholder="Confirmation Code"
            value={confirmationCode}
            onChangeText={setConfirmationCode}
            style={styles.input}
            placeholderTextColor={placeholder}
          />
          <TextInput
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor={placeholder}
          />
          <TextInput
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor={placeholder}
          />
          {showConfirmationError && (
            <Text style={styles.errorText}>Passwords do not match</Text>
          )}
          <Button title="Confirm Reset" onPress={handleConfirmReset} />
        </View>
      )}

    {currentPhase === 'done' && (
        <View style={styles.content}>
        <Text style={styles.title}>Password Reset Successful!</Text>
        <Button title="Back to Profile" onPress={() => navigation.goBack()} /> 
        </View>
    )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: gray,
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: light
  },
  username: {
    fontSize: 20, // Make username slightly larger
  },
  subtitle: {
    fontSize: 12, 
    color: light,
    marginBottom: 20, 
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: placeholder,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: light
  },
  errorText: {
    color: error,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ResetPasswordScreen;