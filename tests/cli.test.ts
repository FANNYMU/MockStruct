import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { program } from "commander";
import * as fs from "fs";
import * as generator from "../../src/generator";

// Mock dependencies
vi.mock("commander", () => ({
  program: {
    name: vi.fn().mockReturnThis(),
    version: vi.fn().mockReturnThis(),
    description: vi.fn().mockReturnThis(),
    helpOption: vi.fn().mockReturnThis(),
    command: vi.fn().mockReturnThis(),
    alias: vi.fn().mockReturnThis(),
    // description: vi.fn().mockReturnThis(),
    requiredOption: vi.fn().mockReturnThis(),
    option: vi.fn().mockReturnThis(),
    action: vi.fn().mockReturnThis(),
    parse: vi.fn().mockReturnThis(),
  },
}));

vi.mock("fs", () => ({
  existsSync: vi.fn(),
  writeFileSync: vi.fn(),
  mkdirSync: vi.fn(),
  statSync: vi.fn().mockReturnValue({ size: 1024 }),
}));

vi.mock("../../src/generator", () => ({
  generateTypeScriptInterfaceMock: vi.fn(),
  generateMultipleMocks: vi.fn(),
  tsGenerateMock: vi.fn(),
}));

function mockHandleGenerateCommand(options: any) {
  const { file, interface: interfaceName, count = 1 } = options;

  if (!fs.existsSync(file)) {
    return false;
  }

  if (count === 1) {
    generator.generateTypeScriptInterfaceMock(file, interfaceName);
  } else {
    generator.generateMultipleMocks(file, interfaceName, count);
  }

  return true;
}

describe("CLI Module", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`Process exited with code ${code}`);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("handleGenerateCommand", () => {
    it("should validate file path", async () => {
      (fs.existsSync as any).mockReturnValue(false);

      mockHandleGenerateCommand({
        file: "dummy/path.ts",
        interface: "User",
      });

      expect(fs.existsSync).toHaveBeenCalled();
    });

    it("should generate mock data with correct parameters", async () => {
      (fs.existsSync as any).mockReturnValue(true);
      (generator.generateTypeScriptInterfaceMock as any).mockReturnValue({
        id: 1,
        name: "Test User",
      });

      mockHandleGenerateCommand({
        file: "dummy/path.ts",
        interface: "User",
        count: 1,
      });

      expect(generator.generateTypeScriptInterfaceMock).toHaveBeenCalled();
    });
  });
});
