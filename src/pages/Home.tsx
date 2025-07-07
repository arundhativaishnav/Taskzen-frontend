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
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonItem,
  IonLabel,
  IonText
} from '@ionic/react';
import { 
  checkboxOutline, 
  atOutline, 
  timeOutline, 
  trendingUpOutline, 
  shieldCheckmarkOutline,
  phonePortraitOutline,
  
  personAddOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';
import './Home.css';

const Home: React.FC = () => {
  const history = useHistory();
  const { user } = useAuth();

  const benefits = [
    {
      icon: atOutline,
      title: 'Focus on What Matters',
      description: 'Prioritize tasks using the proven Eisenhower Matrix method'
    },
    {
      icon: timeOutline,
      title: 'Save Time',
      description: 'Eliminate time-wasting activities and focus on important tasks'
    },
    {
      icon: trendingUpOutline,
      title: 'Boost Productivity',
      description: 'Achieve more by working on the right tasks at the right time'
    },
    {
      icon: shieldCheckmarkOutline,
      title: 'Reduce Stress',
      description: 'Clear priorities help reduce overwhelm and decision fatigue'
    },
    {
      icon: phonePortraitOutline,
      title: 'Access Anywhere',
      description: 'Sync your tasks across all devices - web, mobile, and tablet'
    }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>TaskZen</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="hero-section">
          <div className="hero-content">
            <IonIcon icon={checkboxOutline} className="hero-icon" />
            <h1 className="hero-title">TaskZen</h1>
            <p className="hero-subtitle">
              Your Personal Task Management App with the Eisenhower Matrix
            </p>
            
            {!user ? (
              <div className="auth-buttons">
                
                <IonButton 
                  color="light"
                  onClick={() => history.push('/signup')}
                >
                  <IonIcon icon={personAddOutline} slot="start" />
                  Get Started
                </IonButton>
              </div>
            ) : (
              <div className="welcome-section">
                <IonText color="light">
                  <h3>Welcome back!</h3>
                </IonText>
                <IonButton 
                  color="light"
                  onClick={() => history.push('/tasks')}
                >
                  View Your Tasks
                </IonButton>
              </div>
            )}
          </div>
        </div>

        <div className="content-section">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>What is the Eisenhower Matrix?</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>
                The Eisenhower Matrix, also known as the Urgent-Important Matrix, is a powerful 
                decision-making tool that helps you prioritize tasks by categorizing them into 
                four quadrants based on their urgency and importance.
              </p>
            </IonCardContent>
          </IonCard>

          <div className="matrix-container">
            <IonGrid>
              <IonRow>
                <IonCol size="6">
                  <IonCard className="quadrant quadrant-1">
                    <IonCardContent>
                      <h4>Do First</h4>
                      <p>Important & Urgent</p>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
                <IonCol size="6">
                  <IonCard className="quadrant quadrant-2">
                    <IonCardContent>
                      <h4>Schedule</h4>
                      <p>Important & Not Urgent</p>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="6">
                  <IonCard className="quadrant quadrant-3">
                    <IonCardContent>
                      <h4>Delegate</h4>
                      <p>Not Important & Urgent</p>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
                <IonCol size="6">
                  <IonCard className="quadrant quadrant-4">
                    <IonCardContent>
                      <h4>Eliminate</h4>
                      <p>Not Important & Not Urgent</p>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>

          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Why Choose EisenFlow?</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {benefits.map((benefit, index) => (
                <IonItem key={index} lines="none">
                  <IonIcon icon={benefit.icon} slot="start" color="primary" />
                  <IonLabel>
                    <h3>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                  </IonLabel>
                </IonItem>
              ))}
            </IonCardContent>
          </IonCard>

          {!user && (
            <IonCard className="cta-card">
              <IonCardContent className="cta-content">
                <h2>Ready to Get Organized?</h2>
                <p>
                  Sign up for a free account and start using TaskZen today! 
                  Experience the power of the Eisenhower Matrix to boost your productivity.
                </p>
                <IonButton 
                  expand="block" 
                  size="large"
                  onClick={() => history.push('/signup')}
                >
                  Start Free Today
                </IonButton>
              </IonCardContent>
            </IonCard>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;