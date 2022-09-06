import React, { useEffect } from 'react';
import { Container} from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashBoard from '../../features/activities/dashboard/ActivityDashBoard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {
  
  //Here I'm [destructuring] the [activityStore] fron the [useStore()].
  const {activityStore} = useStore();

  useEffect(() => {
    activityStore.loadActivities();
  },[activityStore])


  //What this do - If The [activityStore.loadingInitial] which is a [property] in [ActivityStore.ts]. then will [return/execute] the [<LoadingComponent content='Loading app' />].
  if(activityStore.loadingInitial)
  {
    return <LoadingComponent content='Loading app' />
  }

  return (

    <> 
        <NavBar />

        {/* This [style={{marginTop: '7em'}}] will put are [lists] below the [NavBar] */}
        <Container style={{marginTop: '7em'}}>

          <ActivityDashBoard />
   
        </Container>
    </>
  
  );
}

export default observer(App);
