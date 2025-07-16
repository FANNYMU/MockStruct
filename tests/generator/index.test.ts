import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  generateTypeScriptInterfaceMock,
  generateMultipleMocks,
} from "../../src/generator";
import { parseTsInterface } from "../../src/parser/tsParser";

vi.mock("../../src/parser/tsParser", () => ({
  parseTsInterface: vi.fn(),
}));

describe("Generator Module", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("generateTypeScriptInterfaceMock", () => {
    it("should generate mock data for a simple interface", () => {
      const mockInterfaceStructure = {
        id: "number",
        name: "string",
        email: "string",
        isActive: "boolean",
      };

      (parseTsInterface as any).mockReturnValue(mockInterfaceStructure);

      const result = generateTypeScriptInterfaceMock("dummy/path.ts", "User", {
        seed: 123,
      });

      expect(parseTsInterface).toHaveBeenCalledWith("dummy/path.ts", "User");

      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("email");
      expect(result).toHaveProperty("isActive");

      expect(typeof result.id).toBe("number");
      expect(typeof result.name).toBe("string");
      expect(typeof result.email).toBe("string");
      expect(typeof result.isActive).toBe("boolean");
    });

    it("should throw an error if interface is not found", () => {
      (parseTsInterface as any).mockReturnValue({});

      expect(() => {
        generateTypeScriptInterfaceMock(
          "dummy/path.ts",
          "NonExistentInterface"
        );
      }).toThrow(/not found or is empty/);
    });

    it("should use custom generators when provided", () => {
      const mockInterfaceStructure = {
        id: "number",
        customField: "string",
      };

      (parseTsInterface as any).mockReturnValue(mockInterfaceStructure);

      const customGenerators = {
        customField: () => "CUSTOM_VALUE",
      };

      const result = generateTypeScriptInterfaceMock("dummy/path.ts", "User", {
        customGenerators,
      });

      expect(result.customField).toBe("CUSTOM_VALUE");
    });
  });

  describe("generateMultipleMocks", () => {
    it("should generate multiple mock objects", () => {
      const mockInterfaceStructure = {
        id: "number",
        name: "string",
      };

      (parseTsInterface as any).mockReturnValue(mockInterfaceStructure);

      const count = 3;
      const result = generateMultipleMocks("dummy/path.ts", "User", count, {
        seed: 123,
      });

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(count);

      result.forEach((item) => {
        expect(item).toHaveProperty("id");
        expect(item).toHaveProperty("name");
        expect(typeof item.id).toBe("number");
        expect(typeof item.name).toBe("string");
      });
    });
  });
});
