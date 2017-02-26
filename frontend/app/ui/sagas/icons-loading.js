import "babel-polyfill";
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { LOAD_ICONS, iconsLoaded } from '../redux/icons'
import IconLoader from '../utils/icon-loader'

function* loadIcons(action) {
   try {
      let settings = action.payload;
      let parsedIcons = [];
      Object.keys(settings.map.icons).map(function(iconType){
        let stateIcons = settings.map.icons[iconType];
        Object.keys(stateIcons).map(function(iconState){
           Object.keys(stateIcons[iconState]).map(function(iconSrc) {
            let props = stateIcons[iconState][iconSrc]
            let parts = (props || settings.map.zoomer.min + "-" + settings.map.zoomer.max + ",1").split(/-|,/);
            let sRange = parseFloat(parts[0]) || settings.map.zoomer.min;
            let eRange = parseFloat(parts[1]) || settings.map.zoomer.max;
            let rescale = parseFloat(parts[2]) || 1;
            parsedIcons.push({
              iconSrc: iconSrc,
              iconType: iconType,
              iconState: iconState,
              scaleRange: [sRange, eRange],
              rescale: rescale
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
