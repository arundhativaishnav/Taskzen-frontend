import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonRange,
    IonButton,
    IonText,
    IonLoading,
    IonAlert,
}from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';

interface RouteParams{
    id: string;
}

const EditTask: React.FC =() =>{
    const {id} = useParams<RouteParams>();
    const history = useHistory();

    const[title, setTitle] = useState('');
    const[description, setDescription] = useState('');
    const[importance, setImportance] = useState(1);
    const[urgency, setUrgency] = useState(1);
    const[loading, setLoading] = useState(false);
    const[showAlert, setShowAlert] = useState(false);
    const[alertMessage, setAlertMessage] = useState('');

    const token = localStorage.getItem('token');

    useEffect(()=>{
        fetchTask();
    } ,[id]);

    const fetchTask = async () =>{
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API}/api/tasks/${id}`,
                {
                    headers :{
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            const task = res.data;
            setTitle(task.title);
            setDescription(task.description);
            setImportance(task.importance);
            setUrgency(task.urgency);

        } catch (error) {
            console.log('Error fetching task:', error);
            setAlertMessage('Failed to fetch task details');
            setShowAlert(true);
            
        }finally{
            setLoading(false);
        }
    };
    const handleUpdate = async () =>{
        if(!title.trim()){
            setAlertMessage('Please enter a task title');
            setShowAlert(true);
            return;
        }
        try {
            setLoading(true);
            await axios.put(`${import.meta.env.VITE_API}/api/tasks/${id}`,
            {
                title,
                description,
                importance,
                urgency,
                
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },

            });
            history.push('/tasks');
            
        } catch (error) {
            console.error('Error updating task:', error);
            setAlertMessage('Failed to update task');
            setShowAlert(true);
            
        }finally{
            setLoading(false);
        }
    };
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Edit Task</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonLoading isOpen={loading} message="Loading..." />
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header="Error"
                    message={alertMessage}
                    buttons={['OK']}
                />
                <IonItem>
                    <IonLabel position="stacked">Title</IonLabel>
                    <IonInput
                        value={title}
                        onIonChange={(e) => setTitle(e.detail.value!)}
                        placeholder="Enter task title"
                        required
                    />
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Description</IonLabel>
                    <IonTextarea
                        value={description}
                        onIonChange={(e) => setDescription(e.detail.value!)}
                        placeholder="Enter task description"
                        rows={4}
                    />
                </IonItem>
                <IonItem>
                    <IonLabel>Importance:{importance}</IonLabel>
                    <IonRange
                        min={1}
                        max={5}
                        step={1}
                        value={importance}
                        onIonChange={(e) => setImportance(e.detail.value as number)}
                    >
                        <div slot="start">1</div>
                        <div slot="end">5</div>
                    </IonRange>
                </IonItem>
                <IonItem>
                    <IonLabel>Urgency: {urgency}</IonLabel>
                    <IonRange
                        min={1}
                        max={5}
                        step={1}
                        value={urgency}
                        onIonChange={(e) => setUrgency(e.detail.value as number)}
                    >
                        <div slot="start">1</div>
                        <div slot="end">5</div>
                    </IonRange>
                </IonItem>

                <div className="ion-padding">
                    <IonButton expand="full" onClick={handleUpdate}>
                        Update Task
                    </IonButton>
                </div>
                <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Error"
          message={alertMessage}
          buttons={['OK']}
        />

            </IonContent>
        </IonPage>
    );

    
};
export default EditTask;


