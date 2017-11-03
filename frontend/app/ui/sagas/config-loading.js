import "babel-polyfill";
import { call, put, takeEvery, takeLatest } from 'redux-saga/lib/effects'
import { LOAD_CONFIG, configLoaded } from '../redux/config'
import ConfigLoader from '../utils/config-loader';
import yaml from 'js-yaml';

function* loadConfig(action) {
   try {
      let source = yield call(ConfigLoader.load);
      let config = yaml.safeLoad(source);
      yield put(configLoaded(config));
   } catch (e) {
      yield put({type: "LOAD_CONFIG_FAILED", message: e.message});
   }
}

function* loadConfigSaga() {
  yield takeEvery(LOAD_CONFIG, loadConfig);
}

export default loadConfigSaga;
