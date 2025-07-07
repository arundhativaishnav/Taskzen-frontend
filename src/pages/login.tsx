import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonIcon,
  IonText,
  IonBackButton,
  IonButtons,
  IonToast,
} from '@ionic/react';
import { mailOutline, lockClosedOutline, checkboxOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import './Auth.css';

const Login: React.FC = () => {
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setToastMessage('Please fill in all fields');
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API}/api/auth/signin`, {
        email: email.trim(),
        password,
      });

      const { user, token } = res.data;

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      // Redirect to tasks page
      history.push('/Tasks');
    } catch (error: any) {
      console.error('Login failed:', error);
      const msg =
        error.response?.data?.message || 'Failed to sign in. Please try again.';
      setToastMessage(msg);
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
          <IonTitle>Sign In</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="auth-container">
          <div className="auth-header">
            <IonIcon icon={checkboxOutline} className="auth-icon" />
            <h1>Welcome Back</h1>
            <p>Sign in to continue organizing your tasks</p>
          </div>

          <IonCard className="auth-card">
            <IonCardContent>
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

              <IonButton
                expand="block"
                onClick={handleLogin}
                disabled={loading}
                className="auth-button"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </IonButton>

              <div className="auth-divider">
                <span>or</span>
              </div>

              <IonButton
                expand="block"
                fill="outline"
                onClick={() => history.push('/signup')}
              >
                Don't have an account? Sign Up
              </IonButton>
            </IonCardContent>
          </IonCard>

          
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
