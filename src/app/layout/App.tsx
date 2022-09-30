import React from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashBoard from '../../features/activities/dashboard/ActivityDashBoard';
import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import TestErrors from '../../features/errors/TestError';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/errors/NotFound';
import ServerError from '../../features/errors/ServerError';


function App() {

  //This Basically will [create] a [New Instance] of [ActivityForm] in the [Route] we using Down Here VV. Continue DownVV
  //Basically Every time that the [state] changes in the [ActivityForm].
  const location = useLocation();

  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar />

      <Route exact path='/' component={HomePage} />

      <Route
        path={'/(.+)'} // Everything that match the ('/') [plus/(.+)] will be [Rended]
        render={() => (
          <>
            <NavBar />
            {/* This [style={{marginTop: '7em'}}] will put are [lists] below the [NavBar] */}
            <Container style={{ marginTop: '7em' }}>
              <Switch>

                <Route exact path='/activities' component={ActivityDashBoard} />
                <Route path='/activities/:id' component={ActivityDetails} />
                <Route key={location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm} />
                <Route path='/errors' component={TestErrors} />
                <Route path='/server-error' component={ServerError} />
                <Route component={NotFound} />

              </Switch>
            </Container>
          </>
        )}
      />

    </>

  );
}

export default observer(App);
