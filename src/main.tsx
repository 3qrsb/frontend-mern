import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { persistor, store } from './redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleOAuthProvider } from '@react-oauth/google';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <GoogleOAuthProvider clientId={"180185828312-f6bbb8p6e4kcjlbf1mdi0j3pcbq3mk8v.apps.googleusercontent.com"}>
        <App />
      </GoogleOAuthProvider>

    </PersistGate>
  </Provider >
);
