import type { ProgramState } from './state';
import { ensureRealLucyFilePath, isVirtualLucyFilePath } from './file.js';
import { info } from './logger.js';
import * as ts from 'typescript/lib/tsserverlibrary';

export function createResolveModuleNames(state: ProgramState) {
  const { languageServiceHost, logger, projectService, sys, typescript } = state;
  const resolveModuleNames: typeof languageServiceHost.resolveModuleNames = languageServiceHost.resolveModuleNames.bind(languageServiceHost);

  function resolveModuleName(
    name: string,
    containingFile: string,
    compilerOptions: ts.CompilerOptions
  ): ts.ResolvedModule | undefined {
    const lucyResolvedModule = typescript.resolveModuleName(
      name,
      containingFile,
      compilerOptions,
      sys
    ).resolvedModule;
    if (
        !lucyResolvedModule ||
        !isVirtualLucyFilePath(lucyResolvedModule.resolvedFileName)
    ) {
        return lucyResolvedModule;
    }

    const resolvedFileName = ensureRealLucyFilePath(lucyResolvedModule.resolvedFileName);
    info(logger, 'Resolved', name, 'to Lucy file', resolvedFileName);

    // This will trigger projectService.host.readFile which is patched
    const scriptInfo = projectService.getOrCreateScriptInfoForNormalizedPath(
      typescript.server.toNormalizedPath(resolvedFileName),
      false
    );

    if(!scriptInfo) {
      info(logger, 'Was able to create scriptInfo');
      return;
    }

    const snapshot = scriptInfo.getSnapshot();
    if(!snapshot) {
      return undefined;
    }

    const resolvedLucyModule: ts.ResolvedModuleFull = {
        extension: ts.Extension.Ts,
        resolvedFileName
    };
    return resolvedLucyModule;
  }

  return function resolveLucyModuleNames(
    moduleNames: string[],
    containingFile: string,
    reusedNames: string[] | undefined,
    redirectedReference: ts.ResolvedProjectReference | undefined,
    compilerOptions: ts.CompilerOptions
  ): Array<ts.ResolvedModule | undefined> {
    info(logger, `Resolving ${moduleNames.join(',')}`);
    const r = resolveModuleNames(
      moduleNames,
      containingFile,
      reusedNames,
      redirectedReference,
      compilerOptions
    ) || Array.from<undefined>(Array(moduleNames.length));

    return r.map((moduleName, idx) => {
      const fileName = moduleNames[idx];
      if (moduleName || !ensureRealLucyFilePath(fileName).endsWith('.lucy')) {
          return moduleName;
      }

      const resolvedModule = resolveModuleName(fileName, containingFile, compilerOptions);
      return resolvedModule;
    });
  };
}