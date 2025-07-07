import axios from 'axios';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonIcon,
  IonText,
  IonBackButton,
  IonButtons,
  IonToast
} from '@ionic/react';
import { personOutline, mailOutline, lockClosedOutline, checkboxOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import './Auth.css';

const Signup: React.FC = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('danger');

  const handleSignup = async () => {
  if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
    setToastMessage('Please fill in all fields');
    setToastColor('danger');
    setShowToast(true);
    return;
  }

  if (password !== confirmPassword) {
    setToastMessage('Passwords do not match');
    setToastColor('danger');
    setShowToast(true);
    return;
  }

  if (password.length < 6) {
    setToastMessage('Password must be at least 6 characters long');
    setToastColor('danger');
    setShowToast(true);
    return;
  }

  setLoading(true);
  try {
    const response = await axios.post(`${import.meta.env.VITE_API}/api/auth/signup`, {
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
    });

    // Store token if backend sends one
    localStorage.setItem('token', response.data.token);

    setToastMessage('Account created successfully!');
    setToastColor('success');
    setShowToast(true);

    setTimeout(() => {
      history.push('/Tasks');
    }, 1500);
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to create account. Please try again.';
    setToastMessage(errorMessage);
    setToastColor('danger');
    setShowToast(true);
  } finally {
    setLoading(false);
  }
};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Sign Up</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="auth-container">
          <div className="auth-header">
            <IonIcon icon={checkboxOutline} className="auth-icon" />
            <h1>Get Started</h1>
            <p>Create your account to start organizing</p>
          </div>

          <IonCard className="auth-card">
            <IonCardContent>
              <IonItem>
                <IonIcon icon={personOutline} slot="start" />
                <IonLabel position="stacked">Full Name</IonLabel>
                <IonInput
                  type="text"
                  value={name}
                  onIonInput={(e) => setName(e.detail.value!)}
                  placeholder="Enter your full name"
                />
              </IonItem>

              <IonItem>
                <IonIcon icon={mailOutline} slot="start" />
                <IonLabel position="stacked">Email Address</IonLabel>
                <IonInput
                  type="email"
                  value={email}
                  onIonInput={(e) => setEmail(e.detail.value!)}
                  placeholder="Enter your email"
                />
              </IonItem>

              <IonItem>
                <IonIcon icon={lockClosedOutline} slot="start" />
                <IonLabel position="stacked">Password</IonLabel>
                <IonInput
                  type="password"
                  value={password}
                  onIonInput={(e) => setPassword(e.detail.value!)}
                  placeholder="Enter your password"
                />
              </IonItem>

              <IonItem>
                <IonIcon icon={lockClosedOutline} slot="start" />
                <IonLabel position="stacked">Confirm Password</IonLabel>
                <IonInput
                  type="password"
                  value={confirmPassword}
                  onIonInput={(e) => setConfirmPassword(e.detail.value!)}
                  placeholder="Confirm your password"
                />
              </IonItem>

              <IonButton
                expand="block"
                onClick={handleSignup}
                disabled={loading}
                className="auth-button"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </IonButton>

              <div className="auth-divider">
                <span>or</span>
              </div>

              <IonButton
                expand="block"
                fill="outline"
                onClick={() => history.push('/login')}
              >
                Already have an account? Sign In
              </IonButton>
            </IonCardContent>
          </IonCard>

          <IonText className="terms-text">
            <p>
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
          </IonText>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color={toastColor}
        />
      </IonContent>
    </IonPage>
  );
};

export default Signup;