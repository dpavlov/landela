import Uuid from '../utils/uuid'
export default class Id {
  static zero() { return '00000000-00000000-00000000-00000000'; }
  static one() { return '11111111-11111111-11111111-11111111'; }
  static generate() {
    return Uuid.uuid4();
  }
}
