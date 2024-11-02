// Lib
import React from 'react';
import {Provider} from 'react-redux';

// Store
import {store} from './src/store';

// Routes
import Routes from './src/routes';

// App
const App = () => {
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
};

console.disableYellowBox = true;

export default App;
