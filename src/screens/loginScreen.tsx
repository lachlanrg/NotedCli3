import * as React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = () => {
    // Hardcoded username and password for demo purposes
    const validUsername = 'Admin';
    const validPassword = 'Password';

    if (username === validUsername && password === validPassword) {
      // Navigate to the MainTabNavigator if login is successful
      navigation.navigate('Main');
    } else {
      // Display an error message if login is unsuccessful
      Alert.alert('Invalid username or password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login - Test new branch. new authtest edits</Text>
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
      <Button title="Login" onPress={handleLogin}/>
      <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />

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

export default LoginScreen;
