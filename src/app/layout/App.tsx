import React from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashBoard from '../../features/activities/dashboard/ActivityDashBoard';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';


//Dosen't Work when clicking on View!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/////////////////////////////////////////////////////////////////////////////

function App() {

  //This Basically will [create] a [New Instance] of [ActivityForm] in the [Route] we using Down Here VV. Continue DownVV
  //Basically Every time that the [state] changes in the [ActivityForm].
  const location = useLocation();

  return (
    <>
      <Route exact path='/' component={HomePage} />
      <Route
        path={'/(.+)'} // Everything that match the ('/') [plus/(.+)] will be [Rended]
        render={() => (
          <>
            <NavBar />
            {/* This [style={{marginTop: '7em'}}] will put are [lists] below the [NavBar] */}
            <Container style={{ marginTop: '7em' }}>
              <Route exact path='/activities' component={ActivityDashBoard} />
              <Route path='/activities/:id' component={ActivityDetails} />
              <Route key={location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm} />
            </Container>
          </>
        )}
      />

    </>

  );
}

export default observer(App);
