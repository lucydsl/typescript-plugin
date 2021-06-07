import * as ts from 'typescript/lib/tsserverlibrary';
import { createLucySys } from './lucy-sys.js';

export interface ProgramState {
  languageServiceHost: ts.LanguageServiceHost;
  logger: ts.server.Logger;
  moduleCache: Map<string, ts.ResolvedModule>;
  projectService: ts.server.ProjectService;
  sys: ts.System;
  typescript: typeof ts;
}

export function createProgramState(typescript: typeof ts, info: ts.server.PluginCreateInfo): ProgramState {
  info.project.projectService
  const state: ProgramState = {
    moduleCache: new Map<string, ts.ResolvedModule>(),
    languageServiceHost: info.languageServiceHost,
    logger: info.project.projectService.logger,
    projectService: info.project.projectService,
    sys: createLucySys(),
    typescript
  };
  
  return state;
}