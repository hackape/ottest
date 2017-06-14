import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';
import App from './App';
import style from './styles/main.styl';

function startApp (module) {
  const rootElement = document.getElementById('root');
  if (__DEV__) {
    const hotLoaderRender = () =>
      render(<AppContainer><App /></AppContainer>, rootElement);

    hotLoaderRender()
    if (module.hot) module.hot.accept('./containers/App', hotLoaderRender);

  } else {
    render(<App />, rootElement);
  }
}

startApp(module);

window.App = App;
if (__VERSION__) console.log(`[VERSION] ${__VERSION__}`);
