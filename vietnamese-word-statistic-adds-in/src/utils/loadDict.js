import dict from '!!raw-loader!../dictionary/vndict.txt';
import sinoDict from '!!raw-loader!../dictionary/sinodict.txt';

export function loadDict() {
  return dict.split('\n').map(word => word.trim());
}

export function loadSinoDict() {
  return sinoDict.split('\n').map(word => word.trim());
}