import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { reducer as iconsReducer } from './ui/redux/icons';
import { reducer as configReducer } from './ui/redux/config';

import IconsLoadingSaga from './ui/sagas/icons-loading';
import ConfigLoadingSaga from './ui/sagas/config-loading';

export default () => {
  const reducers = {
    icons: iconsReducer,
    config: configReducer
  };
  const reducer = combineReducers(reducers);
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    reducer,
    undefined,
    compose(
      applyMiddleware(sagaMiddleware),
      typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f,
    ),
  );
  sagaMiddleware.run(IconsLoadingSaga);
  sagaMiddleware.run(ConfigLoadingSaga);
  return store;
}
