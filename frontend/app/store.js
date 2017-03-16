import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { reducer as iconsReducer } from './ui/redux/icons';
import { reducer as configReducer } from './ui/redux/config';
import { reducer as mapReducer } from './ui/redux/map';

import persistState from 'redux-localstorage';

import IconsLoadingSaga from './ui/sagas/icons-loading';
import ConfigLoadingSaga from './ui/sagas/config-loading';

export default () => {
  const reducers = {
    icons: iconsReducer,
    config: configReducer,
    map: mapReducer
  };
  const reducer = combineReducers(reducers);
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    reducer,
    undefined,
    compose(
      applyMiddleware(sagaMiddleware),
      persistState(['config', 'map']),
      typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f,
    ),
  );
  sagaMiddleware.run(IconsLoadingSaga);
  sagaMiddleware.run(ConfigLoadingSaga);
  return store;
}
