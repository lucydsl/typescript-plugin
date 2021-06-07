import * as ts from 'typescript/lib/tsserverlibrary';

function stringify(args: any[]): string {
  return args
  .map((arg) => {
      if (typeof arg === 'object') {
          try {
              return JSON.stringify(arg);
          } catch (e) {
              return '[object that cannot by stringified]';
          }
      }
      return arg;
  })
  .join(' ');
}

export function info(logger: ts.server.Logger, ...args: any[]) {
  logger.info(`lucytsplugin: ${stringify(args)}`);
}