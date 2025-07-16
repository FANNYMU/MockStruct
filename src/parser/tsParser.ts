import { Project, InterfaceDeclaration, SyntaxKind } from "ts-morph";
// import path from "path";

export function parseTsInterface(
  filePath: string,
  interfaceName: string,
): Record<string, string> {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);

  const iface: InterfaceDeclaration | undefined =
    sourceFile.getInterface(interfaceName);
  if (!iface)
    throw new Error(`Interface ${interfaceName} not found in ${filePath}`);

  const result: Record<string, string> = {};

  iface.getProperties().forEach((prop) => {
    const propName = prop.getName();
    const propType = prop.getType().getText();
    result[propName] = propType;
  });
  return result;
}
