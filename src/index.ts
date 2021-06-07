import { createProgramState } from './state.js';
import { createResolveModuleNames } from './module_names.js';
import { createHostReadFile } from './project_service.js';

function init(modules: { typescript: typeof import("typescript/lib/tsserverlibrary") }) {
  const ts = modules.typescript;

  type LanguageServiceKeys = Array<keyof ts.LanguageService>;

  function create(info: ts.server.PluginCreateInfo) {
    const state = createProgramState(ts, info);

    const proxy: ts.LanguageService = Object.create(null);
    for (let k of Object.keys(info.languageService) as LanguageServiceKeys) {
      const x = info.languageService[k];
      proxy[k] = (...args: Array<{}>) => x.apply(info.languageService, args);
    }

    info.languageServiceHost.resolveModuleNames = createResolveModuleNames(state);
    info.project.projectService.host.readFile = createHostReadFile(state);

    return proxy;
  }

  return { create };
}

export = init;
