import { describe, it, expect, vi, beforeEach } from "vitest";
import { parseTsInterface } from "../../src/parser/tsParser";
import { Project } from "ts-morph";

// Mock ts-morph
vi.mock("ts-morph", () => {
  const mockSourceFile = {
    getInterface: vi.fn(),
  };

  const mockProject = {
    addSourceFileAtPath: vi.fn().mockReturnValue(mockSourceFile),
  };

  return {
    Project: vi.fn(() => mockProject),
    InterfaceDeclaration: {},
    SyntaxKind: {},
  };
});

describe("TypeScript Parser", () => {
  let mockProject;
  let mockSourceFile;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSourceFile = {
      getInterface: vi.fn(),
    };

    mockProject = {
      addSourceFileAtPath: vi.fn().mockReturnValue(mockSourceFile),
    };

    vi.mocked(Project).mockImplementation(() => mockProject as any);
  });

  it("should throw an error when interface is not found", () => {
    mockSourceFile.getInterface.mockReturnValue(undefined);

    expect(() => {
      parseTsInterface("dummy/path.ts", "NonExistentInterface");
    }).toThrow(/not found in/);
  });

  it("should parse interface properties correctly", () => {
    const mockProperties = [
      { getName: () => "id", getType: () => ({ getText: () => "number" }) },
      { getName: () => "name", getType: () => ({ getText: () => "string" }) },
      {
        getName: () => "isActive",
        getType: () => ({ getText: () => "boolean" }),
      },
    ];

    const mockIface = {
      getProperties: () => mockProperties,
    };

    mockSourceFile.getInterface.mockReturnValue(mockIface);

    // Execute
    const result = parseTsInterface("dummy/path.ts", "TestInterface");

    // Verify
    expect(result).toEqual({
      id: "number",
      name: "string",
      isActive: "boolean",
    });
  });
});
