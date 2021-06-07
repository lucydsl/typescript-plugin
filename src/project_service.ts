import type { ProgramState } from './state';
import { isLucyFilePath } from './file.js';
import { info } from './logger.js';

export function createHostReadFile(state: ProgramState) {
  const { logger, projectService } = state;

  const readFile = projectService.host.readFile;
  return function(path: string) {
    if(!isLucyFilePath(path)) {
      return readFile(path);
    }

    const lucyCode = readFile(path) || '';
    try {
      // TODO compile

      return `
        interface CreateMachineRet {
          one: string;
        }
        export function createMachine(): CreateMachineRet
      `.trim();
    } catch(err) {
      info(logger, `Error loading Lucy file ${path}`);
      // TODO debug(logger, err)
    }
  }
}