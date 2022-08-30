import React, { useEffect, useState } from 'react';
import { Container} from 'semantic-ui-react';
import { Activity } from '../Models/activity';
import NavBar from './NavBar';
import ActivityDashBoard from '../../features/activities/dashboard/ActivityDashBoard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function App() {
  
  //I'm using [<Activity[]>] to make my [activities] [state] to be the type of [Activity ([]/array)]
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [ediMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting]= useState(false);

  useEffect(() => {
    //I'm using [<Activity[]>] to be the type of [Activity ([]/array)] because we expecting to [get back] an [array] of [activities]
    agent.Activities.list().then(response => {
      let activities: Activity[] = [];
      response.forEach(activity => {
        //This [activity.date.split('T')[0];] will [split] the [first part] of the [array] becuase of this ([0]), so that we only see the [dd/mm/yyy]
        activity.date = activity.date.split('T')[0];
        activities.push(activity);
      })
      setActivities(activities);
      setLoading(false);
    })
  },[])

  function handleSelectActivity(id: string){
    setSelectedActivity(activities.find(x => x.id === id))
  }

  function handleCancelSelectActivity(){
    setSelectedActivity(undefined)
  }

  function handleFormOpen(id?: string){
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose(){
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity){

    setSubmitting(true);

    if(activity.id) {
      agent.Activities.update(activity).then(() => {
        //if we [pass] an [id] to this [functions].
        //Then we [Remove] the [activity] that we [Edit/Updating]. then will Replace it with the new [activity] that we [pass] into the [function]
        setActivities([...activities.filter(x => x.id !== activity.id), activity])
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      })
    } else {
      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        //if we [NOT] [pass] an [id] to this [functions]. Then will [create] and [Add] new [activity] to the [array] [activities].
        //And we make that the [id] of the [new activity] will be from the [activity.id = uuid();] [line above^^]
        setActivities([...activities, activity]);

        //We do this so will [open] the [details] of the [form] or so we [open] the [details] of the [activity] and [dispay] that.
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);

      })
    }
  }

  function handleDeleteActivity(id: string){
    setSubmitting(true);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(x => x.id !== id)]);
      setSubmitting(false);
    })
  }

  //What this do - If The [loading] which is a [state] is [True] then will [return/execute] the [<LoadingComponent content='Loading app' />]. Continue DownVV
  //The [loading] will be [true] at the [start] but will [change] [to] [false] after [setActivities] [on top^^] in the [useEffrct]
  if(loading)
  {
    return <LoadingComponent content='Loading app' />
  }

  return (

    <> 
        <NavBar openForm={handleFormOpen} />

        {/* This [style={{marginTop: '7em'}}] will put are [lists] below the [NavBar] */}
        <Container style={{marginTop: '7em'}}>

          <ActivityDashBoard 
            activities={activities}
            selectedActivity={selectedActivity}
            selectActivity={handleSelectActivity}
            cancelSelectActivity={handleCancelSelectActivity}
            editMode = {ediMode}
            openForm = {handleFormOpen}
            closeForm = {handleFormClose}
            createOrEdit={handleCreateOrEditActivity}
            deleteActivity={handleDeleteActivity}
            submitting={submitting}
          />
          
        </Container>
    </>
  
  );
}

export default App;
