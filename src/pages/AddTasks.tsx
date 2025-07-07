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
  IonTextarea,
  IonIcon,
  IonBackButton,
  IonButtons,
  IonToast,
  IonText
} from '@ionic/react';
import { saveOutline, starOutline, star } from 'ionicons/icons';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import '../pages/AddTasks.css';

const AddTask: React.FC = () => {
  const history = useHistory();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [importance, setImportance] = useState(3);
  const [urgency, setUrgency] = useState(3);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('danger');

  const handleSave = async () => {
    if (!title.trim()) {
      setToastMessage('Please enter a task title');
      setToastColor('danger');
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/tasks`,
        {
          title: title.trim(),
          description: description.trim(),
          importance,
          urgency,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setToastMessage('Task saved successfully');
      setToastColor('success');
      setShowToast(true);

      setTimeout(() => {
        history.push('/tasks');
      }, 1000);
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to save task';
      setToastMessage(message);
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const renderStarRating = (
    value: number,
    onPress: (rating: number) => void,
    label: string
  ) => (
    <IonCard className="rating-card">
      <IonCardHeader>
        <IonCardTitle>{label}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <div className="stars-container">
          {[1, 2, 3, 4, 5].map((starVal) => (
            <IonButton
              key={starVal}
              fill="clear"
              onClick={() => onPress(starVal)}
              className="star-button"
            >
              <IonIcon
                icon={starVal <= value ? star : starOutline}
                className={starVal <= value ? 'star-filled' : 'star-empty'}
              />
            </IonButton>
          ))}
        </div>
        <IonText color="medium">
          <p className="rating-text">
            {value === 1
              ? 'Very Low'
              : value === 2
              ? 'Low'
              : value === 3
              ? 'Medium'
              : value === 4
              ? 'High'
              : 'Very High'}
          </p>
        </IonText>
      </IonCardContent>
    </IonCard>
  );

  const getPreviewCategory = () => {
    if (importance >= 4 && urgency >= 4) {
      return {
        title: 'Do First',
        description: 'Important & Urgent - Handle immediately',
        color: 'danger',
      };
    }
    if (importance >= 4 && urgency < 4) {
      return {
        title: 'Schedule',
        description: 'Important & Not Urgent - Plan for later',
        color: 'warning',
      };
    }
    if (importance < 4 && urgency >= 4) {
      return {
        title: 'Delegate',
        description: 'Not Important & Urgent - Consider delegating',
        color: 'primary',
      };
    }
    return {
      title: 'Eliminate',
      description: 'Not Important & Not Urgent - Minimize or eliminate',
      color: 'medium',
    };
  };

  const category = getPreviewCategory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tasks" />
          </IonButtons>
          <IonTitle>Add New Task</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave} disabled={loading}>
              <IonIcon icon={saveOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="add-task-container">
          <IonCard>
            <IonCardContent>
              <IonItem>
                <IonLabel position="stacked">Task Title *</IonLabel>
                <IonInput
                  value={title}
                  onIonInput={(e) => setTitle(e.detail.value!)}
                  placeholder="Enter task title..."
                  maxlength={100}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Description</IonLabel>
                <IonTextarea
                  value={description}
                  onIonInput={(e) => setDescription(e.detail.value!)}
                  placeholder="Add more details about this task..."
                  rows={4}
                  maxlength={500}
                />
              </IonItem>
            </IonCardContent>
          </IonCard>

          {renderStarRating(importance, setImportance, 'Importance Level')}
          {renderStarRating(urgency, setUrgency, 'Urgency Level')}

          <IonCard className="preview-card">
            <IonCardHeader>
              <IonCardTitle>Task Category Preview</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className={`category-preview category-${category.color}`}>
                <IonText color={category.color}>
                  <h3>{category.title}</h3>
                </IonText>
                <IonText color="medium">
                  <p>{category.description}</p>
                </IonText>
              </div>
            </IonCardContent>
          </IonCard>

          <IonButton
            expand="block"
            onClick={handleSave}
            disabled={loading}
            className="save-button"
          >
            <IonIcon icon={saveOutline} slot="start" />
            {loading ? 'Saving...' : 'Save Task'}
          </IonButton>
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

export default AddTask;
