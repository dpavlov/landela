import Observable from '../utils/observable';

export default class Map extends Observable {
  constructor(layers) {
    super();
    this._layers = {};
    layers.forEach(layer => {
      this._layers[layer.id] = layer
      layer.subscribe(this);
    });
    this._active = layers[layers.length - 1].id;
    this._version = 0;
  }
  version(v) {
    this._version = v;
  }
  activate = (id) => this._active = id;
  active = () => this.layer(this._active);
  layers = () => Object.keys(this._layers).map(id => this._layers[id]);
  layer = (id) => this._layers[id];
  onEvent = (obj, ...args) => this.notify(obj, ...args);
};
