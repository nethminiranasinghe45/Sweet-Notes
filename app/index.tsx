import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
const router = useRouter();
  const handleRegister = async () => {
    const ip = "192.168.43.47"; 
    if (!name || !mobile || !password) {
      Alert.alert("Wait! ✨", "Please fill in all the marshmallow clouds.");
      return;
    }

    try {
      const details = new URLSearchParams();
      details.append('name', name);
      details.append('mobile', mobile);
      details.append('password', password);

      const response = await fetch(`http://${ip}/mySweetNotes_api/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: details.toString(),
      });

      const result = await response.json();
      if (result.status === "success") {
        Alert.alert("Yay! 🎉", result.message);
        setName(''); setMobile(''); setPassword('');
      } else {
        Alert.alert("Oops!", result.message);
      }
    } catch (error) {
      Alert.alert("Connection Error", "Check XAMPP and your IP!");
    }
  };

  return (
    <LinearGradient colors={['#CFBAEA', '#8EC0D8','#97E1B3','#EED896','#E3B2B2']} style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <Text style={styles.title}>SweetNotes</Text>
            <Text style={styles.subtitle}>write on a cloud... ☁️</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Create your account</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Your Name"
              placeholderTextColor="#A0AEC0"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              placeholderTextColor="#A0AEC0"
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={setMobile}
            />

            <TextInput
              style={styles.input}
              placeholder="Secret Password"
              placeholderTextColor="#A0AEC0"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Join the Cloud</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.push('/login')}>
  <Text style={styles.footerText}>
    Already a dreamer? <Text style={styles.linkText}>Login</Text>
  </Text>
</TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#D88EC0', // pink-400
  },
  subtitle: {
    fontSize: 16,
    color: '#60A5FA', // blue-400
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 40,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    elevation: 10, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  cardTitle: {
    textAlign: 'center',
    color: '#718096',
    marginBottom: 20,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FCE7F3',
    color: '#4A5568',
  },
  button: {
    backgroundColor: '#F9A8D4', // marsh-pink
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    textAlign: 'center',
    color: '#60A5FA',
  },
  linkText: {
    color: '#F472B6',
    textDecorationLine: 'underline',
  }
});