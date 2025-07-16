import { describe, it, expect, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { beforeEach } from "node:test";

describe("Data Generation Utilities", () => {
  beforeEach(() => {
    // Set a fixed seed for consistent test results
    faker.seed(12345);
  });

  describe("Type-based value generation", () => {
    it("should generate appropriate values for basic types", () => {
      function generateBasicTypeValue(propName: string, type: string) {
        if (type === "string") return faker.string.sample();
        if (type === "number") return faker.number.int();
        if (type === "boolean") return faker.datatype.boolean();
        if (type === "Date") return faker.date.recent();
        return null;
      }

      // Test string generation
      const stringValue = generateBasicTypeValue("name", "string");
      expect(typeof stringValue).toBe("string");

      // Test number generation
      const numberValue = generateBasicTypeValue("id", "number");
      expect(typeof numberValue).toBe("number");

      // Test boolean generation
      const boolValue = generateBasicTypeValue("isActive", "boolean");
      expect(typeof boolValue).toBe("boolean");

      // Test date generation
      const dateValue = generateBasicTypeValue("createdAt", "Date");
      expect(dateValue instanceof Date).toBe(true);
    });

    it("should generate contextual values based on property names", () => {
      function generateContextualValue(propName: string) {
        if (propName.includes("email")) return faker.internet.email();
        if (propName.includes("name")) return faker.person.fullName();
        if (propName.includes("phone")) return faker.phone.number();
        return faker.string.sample();
      }

      // Test email context
      const emailValue = generateContextualValue("email");
      expect(typeof emailValue).toBe("string");
      expect(emailValue).toContain("@");

      // Test name context
      const nameValue = generateContextualValue("userName");
      expect(typeof nameValue).toBe("string");

      // Test phone context
      const phoneValue = generateContextualValue("phoneNumber");
      expect(typeof phoneValue).toBe("string");
    });

    it("should handle array types correctly", () => {
      // Placeholder for array generation testing
      function generateArrayValue(propName: string, itemType: string) {
        const count = 3;
        return Array(count)
          .fill(null)
          .map(() => {
            if (itemType === "string") return faker.string.sample();
            if (itemType === "number") return faker.number.int();
            return null;
          });
      }

      const stringArray = generateArrayValue("tags", "string");
      expect(Array.isArray(stringArray)).toBe(true);
      expect(stringArray.length).toBe(3);
      expect(typeof stringArray[0]).toBe("string");

      const numberArray = generateArrayValue("scores", "number");
      expect(Array.isArray(numberArray)).toBe(true);
      expect(numberArray.length).toBe(3);
      expect(typeof numberArray[0]).toBe("number");
    });
  });
});
