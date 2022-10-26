import React, { useEffect } from 'react';
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
import LoginForm from '../../features/users/LoginForm';
import { useStore } from '../stores/store';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';


function App() {

  //This Basically will [create] a [New Instance] of [ActivityForm] in the [Route] we using Down Here VV. Continue DownVV
  //Basically Every time that the [state] changes in the [ActivityForm].
  const location = useLocation();

  const {commonStore, userStore} = useStore();

  //The [useEffect] will [Run] [Only] [Once]
  useEffect(() => {
    if(commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    }
    else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore])


  if(!commonStore.appLoaded)
  {
    return <LoadingComponent content='Loading app...' />
  }
  
  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar />

      <ModalContainer /> 

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
                <Route path='/login' component={LoginForm} />

                {/* Anything that [dosent match] the [Routes] [above this] line^^. Will be t[aken] to this [Route] [NotFound]. To [make] this [work] we [put all] the [Routes] [inside] [<Switch> </Switch>] */}
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


