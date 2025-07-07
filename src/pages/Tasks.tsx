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
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonFab,
  IonFabButton,
  IonAlert,
  IonCheckbox,
  IonLabel,
  IonItem
} from '@ionic/react';

import { useIonViewWillEnter } from '@ionic/react';
import {
  addOutline,
  alertCircleOutline,
  calendarOutline,
  timeOutline,
  archiveOutline,
  pencilOutline,
  trashOutline
} from 'ionicons/icons';

import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './Tasks.css';

interface Task {
  _id: string;
  title: string;
  description: string;
  importance: number;
  urgency: number;
  completed: boolean;
  createdAt: string;
}

const Tasks: React.FC = () => {
  const history = useHistory();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  useIonViewWillEnter(() => {
    if (!user || !token) {
      history.replace('/login');
    } else {
      loadTasks();
    }
  });

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API}/api/tasks/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const markTaskComplete = async (id: string) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API}/api/tasks/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadTasks();
    } catch (error) {
      console.error('Error marking task as completed:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleRefresh = async (event: CustomEvent) => {
    await loadTasks();
    event.detail.complete();
  };

  const getTasksByQuadrant = (importance: number, urgency: number) => {
    return tasks
      .filter(task => {
        const isImportant = task.importance >= 4;
        const isUrgent = task.urgency >= 4;

        if (importance >= 4 && urgency >= 4) return isImportant && isUrgent;
        if (importance >= 4 && urgency < 4) return isImportant && !isUrgent;
        if (importance < 4 && urgency >= 4) return !isImportant && isUrgent;
        return !isImportant && !isUrgent;
      })
      .sort((a, b) => {
        const scoreA = a.importance + a.urgency;
        const scoreB = b.importance + b.urgency;
        return scoreB - scoreA || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  };

  const quadrants = [
    {
      title: 'Do First',
      subtitle: 'Important & Urgent',
      importance: 5,
      urgency: 5,
      color: 'danger',
      icon: alertCircleOutline,
      tasks: getTasksByQuadrant(5, 5)
    },
    {
      title: 'Schedule',
      subtitle: 'Important & Not Urgent',
      importance: 5,
      urgency: 2,
      color: 'warning',
      icon: calendarOutline,
      tasks: getTasksByQuadrant(5, 2)
    },
    {
      title: 'Delegate',
      subtitle: 'Not Important & Urgent',
      importance: 2,
      urgency: 5,
      color: 'primary',
      icon: timeOutline,
      tasks: getTasksByQuadrant(2, 5)
    },
    {
      title: 'Eliminate',
      subtitle: 'Not Important & Not Urgent',
      importance: 2,
      urgency: 2,
      color: 'medium',
      icon: archiveOutline,
      tasks: getTasksByQuadrant(2, 2)
    }
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Your Tasks</IonTitle>
          <IonButton slot="end" color="danger" fill="outline" size="small" onClick={handleLogout}>
            Log Out
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {loading ? (
          <div className="center-content">
            <IonText><p>Loading tasks...</p></IonText>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <IonIcon icon={addOutline} className="empty-icon" />
            <h2>No tasks yet</h2>
            <p>Start by adding your first task to organize your priorities</p>
            <IonButton onClick={() => history.push('/add-tasks')}>
              <IonIcon icon={addOutline} slot="start" />
              Add First Task
            </IonButton>
          </div>
        ) : (
          <div className="tasks-container">
            {quadrants.map((q, idx) => (
              <IonCard key={idx} className={`quadrant-card quadrant-${q.color}`}>
                <IonCardHeader>
                  <div className="quadrant-header">
                    <div className="quadrant-info">
                      <IonIcon icon={q.icon} />
                      <div>
                        <IonCardTitle>{q.title}</IonCardTitle>
                        <IonText color="medium"><p>{q.subtitle}</p></IonText>
                      </div>
                    </div>
                    <div className="task-count">
                      <span>{q.tasks.length}</span>
                    </div>
                  </div>
                </IonCardHeader>
                <IonCardContent>
                  {q.tasks.length === 0 ? (
                    <IonText color="medium">
                      <p className="no-tasks">No tasks in this quadrant</p>
                    </IonText>
                  ) : (
                    <div className="tasks-list">
                      {q.tasks.map(task => (
                        <IonCard key={task._id} className="task-card">
                          <IonCardHeader>
                            <IonItem lines="none">
                              <IonCheckbox
                                slot="start"
                                checked={task.completed}
                                disabled={task.completed}
                                onIonChange={async (e) => {
                                  if (!task.completed) {
                                    try {
                                      await axios.patch(`${import.meta.env.VITE_API}/api/tasks/${task._id}`, {}, {
                                        headers: { Authorization: `Bearer ${token}` },
                                      });
                                      setTasks(prev =>
                                        prev.map(t => t._id === task._id ? { ...t, completed: true } : t)
                                      );
                                      } catch (err) {
                                        console.error("Failed to mark task complete:", err);
                                      }
                                    }
                                  }}
                                />

                              <IonLabel>
                                <IonCardTitle className={task.completed ? 'completed-task' : ''}>
                                  {task.title}
                                </IonCardTitle>
                                <IonText color="medium">
                                  <p>{task.description || 'No description provided'}</p>
                                </IonText>
                              </IonLabel>
                            </IonItem>
                          </IonCardHeader>
                          <IonCardContent>
                            <div className="task-buttons">
                              <IonButton
                                fill="clear"
                                size="small"
                                onClick={() => history.push(`/edit-task/${task._id}`)}
                                disabled={task.completed}
                              >
                                <IonIcon icon={pencilOutline} />
                              </IonButton>
                              <IonButton
                                fill="clear"
                                color="danger"
                                size="small"
                                onClick={() => {
                                  setTaskToDelete(task._id);
                                  setShowDeleteAlert(true);
                                }}
                              >
                                <IonIcon icon={trashOutline} />
                              </IonButton>
                            </div>
                          </IonCardContent>
                        </IonCard>
                      ))}
                    </div>
                  )}
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/add-tasks')}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Delete Task"
          message="Are you sure you want to delete this task?"
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel'
            },
            {
              text: 'Delete',
              role: 'destructive',
              handler: () => {
                if (taskToDelete) {
                  handleDelete(taskToDelete);
                }
              }
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Tasks;
