import * as ts from 'typescript';
import { ensureRealLucyFilePath, isVirtualLucyFilePath, toRealLucyFilePath } from './file.js';

export function createLucySys() {
  const lucySys: ts.System = {
      ...ts.sys,
      fileExists(path: string) {
          return ts.sys.fileExists(ensureRealLucyFilePath(path));
      },
      readDirectory(path, extensions, exclude, include, depth) {
          const extensionsWithLucy = (extensions ?? []).concat('.lucy');

          return ts.sys.readDirectory(path, extensionsWithLucy, exclude, include, depth);
      }
  };

  if (ts.sys.realpath) {
      const realpath = ts.sys.realpath;
      lucySys.realpath = function (path) {
          if (isVirtualLucyFilePath(path)) {
              return realpath(toRealLucyFilePath(path)) + '.ts';
          }
          return realpath(path);
      };
  }

  return lucySys;
}