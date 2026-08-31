import * as migration_20260712_195239 from './20260712_195239';
import * as migration_20260828_143656 from './20260828_143656';
import * as migration_20260830_193325 from './20260830_193325';

export const migrations = [
  {
    up: migration_20260712_195239.up,
    down: migration_20260712_195239.down,
    name: '20260712_195239',
  },
  {
    up: migration_20260828_143656.up,
    down: migration_20260828_143656.down,
    name: '20260828_143656',
  },
  {
    up: migration_20260830_193325.up,
    down: migration_20260830_193325.down,
    name: '20260830_193325'
  },
];
