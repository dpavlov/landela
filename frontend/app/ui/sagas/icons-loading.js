import "babel-polyfill";
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { LOAD_ICONS, iconsLoaded } from '../redux/icons'
import IconLoader from '../utils/icon-loader'

function* loadIcons(action) {
   try {
      let parsedIcons = [];
      Object.keys(action.payload).map(function(iconType){
        let stateIcons = action.payload[iconType];
        Object.keys(stateIcons).map(function(iconState){
           Object.keys(stateIcons[iconState]).map(function(iconSrc) {
            let parts = stateIcons[iconState][iconSrc].split(/-|,/);
            parsedIcons.push({
              iconSrc: iconSrc,
              iconType: iconType,
              iconState: iconState,
              scaleRange: [parseFloat(parts[0]), parseFloat(parts[1])],
              rescale: parseFloat(parts[2])
            });
           });
        });
      })

      let loadedIcons = yield parsedIcons.map(function(icon){
          return call(IconLoader.load, icon);
      })

      let icons = {};

      loadedIcons.map(function(icon) {
        if (!icons[icon.iconType + "." + icon.iconState]) {
          icons[icon.iconType + "." + icon.iconState] = {};
        }
        icons[icon.iconType + "." + icon.iconState][icon.iconSrc] = {
          image: icon.iconImg,
          scaleRange: icon.scaleRange,
          rescale: icon.rescale
        }
      })

      yield put(iconsLoaded(icons));
   } catch (e) {
      yield put({type: "LOAD_ICONS_FAILED", message: e.message});
   }
}

function* loadIconsSaga() {
  yield takeEvery(LOAD_ICONS, loadIcons);
}

export default loadIconsSaga;
