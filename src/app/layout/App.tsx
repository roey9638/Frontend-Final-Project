import React, { useEffect, useState } from 'react';
import { Container} from 'semantic-ui-react';
import axios from 'axios';
import { Activity } from '../Models/activity';
import NavBar from './NavBar';
import ActivityDashBoard from '../../features/activities/dashboard/ActivityDashBoard';
import {v4 as uuid} from 'uuid';

function App() {
  
  //I'm using [<Activity[]>] to make my [activities] [state] to be the type of [Activity ([]/array)]
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [ediMode, setEditMode] = useState(false);

  useEffect(() => {
      //I'm using [<Activity[]>] to be the type of [Activity ([]/array)] because we expecting to [get back] an [array] of [activities]
    axios.get<Activity[]>('http://localhost:5000/api/activities').then(response => {
      setActivities(response.data);
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
    //Here I'm checking if we [pass] an [id] to this [functions]
    activity.id ?
    //if we [pass] an [id] to this [functions].
    //Then we [check/filter] all the [activities] that [!==/not euqal] to the [id] [we [pass]] into this [function] then will add this new [activity]
    setActivities([...activities.filter(x => x.id !== activity.id), activity])
    //if we [NOT] [pass] an [id] to this [functions]. Then will [create] and [Add] new [activity] to the [array] [activities]. and we make that the [id] of the [new activity] will have a [random id]
    : setActivities([...activities, {...activity, id: uuid()}]);
    setEditMode(false);
    //We do this so will [open] the [details] of the [form] or so we [open] the [details] of the [activity] and [dispay] that.
    setSelectedActivity(activity);
  }

  function handleDeleteActivity(id: string){
    setActivities([...activities.filter(x => x.id !== id)]);
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
          />
          
        </Container>
    </>
  
  );
}

export default App;
