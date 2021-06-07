export function isLucyFilePath(filePath: string) {
  return filePath.endsWith('.lucy');
}

export function isVirtualLucyFilePath(filePath: string) {
  return filePath.endsWith('.lucy.ts');
}

export function toRealLucyFilePath(filePath: string) {
  return filePath.slice(0, -'.ts'.length);
}

export function ensureRealLucyFilePath(filePath: string) {
  return isVirtualLucyFilePath(filePath) ? toRealLucyFilePath(filePath) : filePath;
}