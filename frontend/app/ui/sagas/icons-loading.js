import "babel-polyfill";
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { LOAD_ICONS, iconsLoaded } from '../redux/icons'
import IconLoader from '../utils/icon-loader'
import NodeTypes, { NodeType } from '../../map/node-types'

function* loadIcons(action) {
   try {
      let settings = action.payload;
      let parsedIcons = [];
      Object.keys(settings.map['node-types']).map(nodeType => {
        let typeProps = settings.map['node-types'][nodeType];
        Object.keys(typeProps.icons).map(function(iconSrc) {
         let props = typeProps.icons[iconSrc];
         let parts = (props || settings.map.zoomer.min + "-" + settings.map.zoomer.max + ",1").split(/-|,/);
         let sRange = parseFloat(parts[0]) || settings.map.zoomer.min;
         let eRange = parseFloat(parts[1]) || settings.map.zoomer.max;
         let rescale = parseFloat(parts[2]) || 1;
         parsedIcons.push({
           iconSrc: iconSrc,
           nodeType: nodeType,
           typeProps: typeProps,
           scaleRange: [sRange, eRange],
           rescale: rescale
         });
        });
      });

      let loadedIcons = yield parsedIcons.map(function(icon){
          return call(IconLoader.load, icon);
      });

      let nodeTypes = new NodeTypes();

      loadedIcons.map(function(icon) {
        if (!nodeTypes.exists(icon.nodeType)) {
          nodeTypes.add(new NodeType(icon.nodeType, icon.typeProps.name, icon.typeProps.code));
        }
        nodeTypes.lookup(icon.nodeType).addIcon(icon.iconSrc, icon.iconImg, icon.rescale, icon.scaleRange);
      })

      yield put(iconsLoaded(nodeTypes));
   } catch (e) {
      console.log(e);
      yield put({type: "LOAD_ICONS_FAILED", message: e.message});
   }
}

function* loadIconsSaga() {
  yield takeEvery(LOAD_ICONS, loadIcons);
}

export default loadIconsSaga;
