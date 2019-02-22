import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import createBrowserHistory from 'history/createBrowserHistory';
import { Router } from 'react-router-dom';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import fr from 'react-intl/locale-data/fr';
import de from 'react-intl/locale-data/de';
import zh from 'react-intl/locale-data/zh';
import registerServiceWorker from './registerServiceWorker';
import localeData from './util/data.json';
import './styles/index.scss';
import './styles/bootstrap.scss';
import App from './App';
import ReduxToastr from 'react-redux-toastr';
import Routes from 'app/routes';
import configureStore from 'app/redux/configure-store';
import './global';

addLocaleData([...en, ...es, ...fr, ...de, ...zh]);
let language =
  (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage;
if (language.indexOf('-') !== -1) language = language.split('-')[0];

if (language.indexOf('_') !== -1) language = language.split('_')[0];
const messages = localeData[language] || localeData.en;

const history = createBrowserHistory();
const { store, persistor } = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <IntlProvider locale={language} messages={messages}>
        <Router history={history}>
          <div>
            <ReduxToastr
              timeOut={2000}
              newestOnTop={false}
              preventDuplicates
              position="top-left"
              transitionIn="fadeIn"
              transitionOut="fadeOut"
              progressBar
            />

            <Routes />

            <App />
          </div>
        </Router>
      </IntlProvider>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
