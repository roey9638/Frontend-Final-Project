import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.min.css';
import './app/layout/styles.css';
import App from './app/layout/App';
import 'semantic-ui-css/semantic.min.css';
import reportWebVitals from './reportWebVitals';
import { store, StoreContext } from './app/stores/store';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

//We took the [history Object] in [order] to [Redirect/push] [someone] who [goes to] a [Not Found Component]. Continue Down VV
//And we [Use it] in the [agent Component] in the [Switch case].
//We [export] [in order] to [use it] [somewhere else].
export const history = createBrowserHistory();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  //There was a [<React.StrictMode></React.StrictMode>] Down here VV
  //We Switched from [<BrowserRouter> </BrowserRouter>] to [<Router history={history}> </Router>]. Continue Down VV
  //[In order] to be [able] [to use] the [history Object] [somewhere else]. Also //We [export] [in order] to [use it] [somewhere else].

    <StoreContext.Provider value={store}>
      <Router history={history}>
        <App />
      </Router>
    </StoreContext.Provider>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
