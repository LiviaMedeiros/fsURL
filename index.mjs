import fs from 'node:fs/promises';
import { sep } from 'node:path';
import { pathToFileURL } from 'node:url';

// list indices of arguments that should be converted
const processedArgs = {
  access: [0],
  appendFile: [0],
  chmod: [0],
  chown: [0],
  copyFile: [0, 1],
  cp: [0, 1],
  lchmod: [0],
  lchown: [0],
  lutimes: [0],
  link: [0, 1],
  lstat: [0],
  mkdir: [0],
  mkdtemp: [0],
  open: [0],
  opendir: [0],
  readdir: [0],
  readFile: [0],
  readlink: [0],
  realpath: [0],
  rename: [0, 1],
  rmdir: [0],
  rm: [0],
  stat: [0],
  statfs: [0],
  symlink: [0, 1],
  truncate: [0],
  unlink: [0],
  utimes: [0],
  watch: [0],
  writeFile: [0],
  constants: null,
};

// in case of this warning, new methods should be added according to https://nodejs.org/api/fs.html#promises-api
const unsupported = Object.keys(fs).filter(_ => processedArgs[_] === undefined).map(_ => `fsURL.${_}`);
if (unsupported.length)
  process.emitWarning(`${unsupported.join(', ')} is not supported`);

// this can be a string literal if cwd does not change
const cwdURL = {
  [Symbol.toPrimitive]: () => pathToFileURL(process.cwd() + sep).href
};

const fsURL = Object.fromEntries(Object.entries(processedArgs).map(([_, $]) => [_, (_ = fs[_]) && ($ = new Set($)).size ? new Proxy(_, {
  __proto__: null,
  apply: (_, __, ___) => Reflect.apply(_, __, ___.map((_, __) => $.has(__) ? new URL(_, cwdURL) : _)),
}) : _]));

export const {
  access,
  appendFile,
  chmod,
  chown,
  copyFile,
  cp,
  lchmod,
  lchown,
  lutimes,
  link,
  lstat,
  mkdir,
  mkdtemp,
  open,
  opendir,
  readdir,
  readFile,
  readlink,
  realpath,
  rename,
  rmdir,
  rm,
  stat,
  statfs,
  symlink,
  truncate,
  unlink,
  utimes,
  watch,
  writeFile,
  constants,
} = fsURL;
export default fsURL;
