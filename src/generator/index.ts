import { parseTsInterface } from "../parser/tsParser";
import { faker } from "@faker-js/faker";

type InterfaceStructure = Record<string, string>;
type MockDataObject = Record<string, any>;

interface MockGenerationOptions {
  seed?: number;
  customGenerators?: Record<string, () => any>;
}

export function generateTypeScriptInterfaceMock(
  filePath: string,
  interfaceName: string,
  options: MockGenerationOptions = {}
): MockDataObject {
  const { seed, customGenerators = {} } = options;

  if (seed !== undefined) {
    faker.seed(seed);
  }

  const interfaceStructure = parseTsInterface(filePath, interfaceName);

  if (!interfaceStructure || Object.keys(interfaceStructure).length === 0) {
    throw new Error(
      `Interface "${interfaceName}" not found or is empty in file "${filePath}"`
    );
  }

  return createMockObjectFromStructure(interfaceStructure, customGenerators);
}

function createMockObjectFromStructure(
  interfaceStructure: InterfaceStructure,
  customGenerators: Record<string, () => any> = {}
): MockDataObject {
  const mockObject: MockDataObject = {};

  for (const [propertyName, propertyType] of Object.entries(
    interfaceStructure
  )) {
    if (customGenerators[propertyName]) {
      mockObject[propertyName] = customGenerators[propertyName]();
    } else {
      mockObject[propertyName] = generateMockValueByType(
        propertyName,
        propertyType
      );
    }
  }

  return mockObject;
}

function generateMockValueByType(propertyName: string, dataType: string): any {
  const normalizedPropertyName = propertyName.toLowerCase();
  const normalizedDataType = dataType.toLowerCase().trim();

  // Handle array types
  if (
    normalizedDataType.includes("[]") ||
    normalizedDataType.startsWith("array")
  ) {
    const arrayLength = faker.number.int({ min: 1, max: 3 });
    return Array.from({ length: arrayLength }, () =>
      generateBasicValueByProperty(propertyName)
    );
  }

  // Handle union types (e.g., "string | number")
  if (normalizedDataType.includes("|")) {
    const types = normalizedDataType.split("|").map((t) => t.trim());

    for (const type of types) {
      if (isBasicType(type)) {
        return generateMockValueByType(propertyName, type);
      }
    }

    return generateBasicValueByProperty(propertyName);
  }

  // Handle optional types (remove '?' and 'undefined')
  const cleanType = normalizedDataType.replace(/\?|undefined/g, "").trim();

  if (isBasicType(cleanType)) {
    return generateBasicTypeValue(propertyName, cleanType);
  }

  // Handle Record<string, any> and similar complex types
  if (
    cleanType.includes("record<") ||
    cleanType.includes("object") ||
    cleanType === "{}" ||
    cleanType.startsWith("{") ||
    cleanType.includes("any")
  ) {
    return generateSimpleObject();
  }

  return generateBasicValueByProperty(propertyName);
}

function isBasicType(type: string): boolean {
  const basicTypes = [
    "string",
    "number",
    "boolean",
    "date",
    "datetime",
    "uuid",
    "url",
  ];
  return basicTypes.includes(type);
}

function generateBasicTypeValue(propertyName: string, type: string): any {
  const normalizedPropertyName = propertyName.toLowerCase();

  switch (type) {
    case "string":
      return generateContextualString(normalizedPropertyName);
    case "number":
      return generateContextualNumber(normalizedPropertyName);
    case "boolean":
      return faker.datatype.boolean();
    case "date":
    case "datetime":
      return faker.date.past().toISOString();
    case "uuid":
      return faker.string.uuid();
    case "url":
      return faker.internet.url();
    default:
      return generateBasicValueByProperty(propertyName);
  }
}

function generateBasicValueByProperty(propertyName: string): any {
  const normalizedPropertyName = propertyName.toLowerCase();

  // Email patterns - always use @gmail.com
  if (
    normalizedPropertyName.includes("email") ||
    normalizedPropertyName.includes("mail")
  ) {
    const username = faker.internet.username().toLowerCase();
    return `${username}@gmail.com`;
  }

  // Phone patterns
  if (
    normalizedPropertyName.includes("phone") ||
    normalizedPropertyName.includes("mobile") ||
    normalizedPropertyName.includes("tel")
  ) {
    return faker.phone.number();
  }

  // Name patterns
  if (normalizedPropertyName.includes("name")) {
    if (
      normalizedPropertyName.includes("first") ||
      normalizedPropertyName.includes("fname")
    ) {
      return faker.person.firstName();
    }
    if (
      normalizedPropertyName.includes("last") ||
      normalizedPropertyName.includes("lname")
    ) {
      return faker.person.lastName();
    }
    if (
      normalizedPropertyName.includes("user") ||
      normalizedPropertyName.includes("username")
    ) {
      return faker.internet.username();
    }
    return faker.person.fullName();
  }

  // ID patterns
  if (
    normalizedPropertyName.includes("id") &&
    !normalizedPropertyName.includes("email")
  ) {
    return faker.string.uuid();
  }

  // URL patterns
  if (
    normalizedPropertyName.includes("url") ||
    normalizedPropertyName.includes("link") ||
    normalizedPropertyName.includes("website")
  ) {
    return faker.internet.url();
  }

  // Address patterns
  if (normalizedPropertyName.includes("address")) {
    return faker.location.streetAddress();
  }

  if (normalizedPropertyName.includes("city")) {
    return faker.location.city();
  }

  if (normalizedPropertyName.includes("country")) {
    return faker.location.country();
  }

  if (normalizedPropertyName.includes("state")) {
    return faker.location.state();
  }

  // Company patterns
  if (
    normalizedPropertyName.includes("company") ||
    normalizedPropertyName.includes("organization")
  ) {
    return faker.company.name();
  }

  // Job/Title patterns
  if (
    normalizedPropertyName.includes("title") ||
    normalizedPropertyName.includes("job") ||
    normalizedPropertyName.includes("position")
  ) {
    return faker.person.jobTitle();
  }

  // Description patterns
  if (
    normalizedPropertyName.includes("description") ||
    normalizedPropertyName.includes("desc") ||
    normalizedPropertyName.includes("bio") ||
    normalizedPropertyName.includes("content")
  ) {
    return faker.lorem.paragraph();
  }

  // Password patterns
  if (
    normalizedPropertyName.includes("password") ||
    normalizedPropertyName.includes("pwd")
  ) {
    return faker.internet.password();
  }

  // Color patterns
  if (normalizedPropertyName.includes("color")) {
    return faker.color.human();
  }

  // Number-like patterns
  if (
    normalizedPropertyName.includes("age") ||
    normalizedPropertyName.includes("year") ||
    normalizedPropertyName.includes("count") ||
    normalizedPropertyName.includes("quantity") ||
    normalizedPropertyName.includes("price") ||
    normalizedPropertyName.includes("amount") ||
    normalizedPropertyName.includes("rating") ||
    normalizedPropertyName.includes("score")
  ) {
    return generateContextualNumber(normalizedPropertyName);
  }

  // Date-like patterns
  if (
    normalizedPropertyName.includes("date") ||
    normalizedPropertyName.includes("time") ||
    normalizedPropertyName.includes("at") // for createdAt, updatedAt, etc.
  ) {
    return faker.date.past().toISOString();
  }

  // Boolean-like patterns
  if (
    normalizedPropertyName.startsWith("is") ||
    normalizedPropertyName.startsWith("has") ||
    normalizedPropertyName.startsWith("can") ||
    normalizedPropertyName.includes("active") ||
    normalizedPropertyName.includes("enabled") ||
    normalizedPropertyName.includes("verified")
  ) {
    return faker.datatype.boolean();
  }

  // Default to random string
  return faker.lorem.words({ min: 1, max: 3 });
}

function generateSimpleObject(): Record<string, any> {
  const objectSize = faker.number.int({ min: 1, max: 3 });
  const obj: Record<string, any> = {};

  for (let i = 0; i < objectSize; i++) {
    const key = faker.lorem.word();
    const value = faker.helpers.arrayElement([
      faker.lorem.words({ min: 1, max: 2 }),
      faker.number.int({ min: 0, max: 100 }),
      faker.datatype.boolean(),
    ]);
    obj[key] = value;
  }

  return obj;
}

function generateContextualString(normalizedPropertyName: string): string {
  // Email patterns - always use @gmail.com
  if (
    normalizedPropertyName.includes("email") ||
    normalizedPropertyName.includes("mail")
  ) {
    const username = faker.internet.username().toLowerCase();
    return `${username}@gmail.com`;
  }

  // Use the property-based generation
  return generateBasicValueByProperty(normalizedPropertyName);
}

function generateContextualNumber(normalizedPropertyName: string): number {
  const numberPatterns = [
    {
      patterns: ["age"],
      generator: () => faker.number.int({ min: 18, max: 80 }),
    },
    {
      patterns: ["price", "cost", "amount"],
      generator: () =>
        faker.number.float({ min: 0, max: 1000, fractionDigits: 2 }),
    },
    {
      patterns: ["quantity", "count"],
      generator: () => faker.number.int({ min: 1, max: 100 }),
    },
    {
      patterns: ["year"],
      generator: () =>
        faker.number.int({ min: 1900, max: new Date().getFullYear() }),
    },
    {
      patterns: ["month"],
      generator: () => faker.number.int({ min: 1, max: 12 }),
    },
    {
      patterns: ["day"],
      generator: () => faker.number.int({ min: 1, max: 31 }),
    },
    {
      patterns: ["hour"],
      generator: () => faker.number.int({ min: 0, max: 23 }),
    },
    {
      patterns: ["minute", "second"],
      generator: () => faker.number.int({ min: 0, max: 59 }),
    },
    {
      patterns: ["percentage", "percent"],
      generator: () => faker.number.int({ min: 0, max: 100 }),
    },
    {
      patterns: ["rating", "score"],
      generator: () => faker.number.int({ min: 1, max: 5 }),
    },
  ];

  for (const { patterns, generator } of numberPatterns) {
    if (patterns.some((pattern) => normalizedPropertyName.includes(pattern))) {
      return generator();
    }
  }

  // Default number generation
  return faker.number.int({ min: 0, max: 10000 });
}

export function generateMultipleMocks(
  filePath: string,
  interfaceName: string,
  count: number,
  options: MockGenerationOptions = {}
): MockDataObject[] {
  if (count <= 0) {
    throw new Error("Count must be a positive number");
  }

  return Array.from({ length: count }, (_, index) => {
    const seedOffset = options.seed ? options.seed + index : undefined;
    return generateTypeScriptInterfaceMock(filePath, interfaceName, {
      ...options,
      seed: seedOffset,
    });
  });
}

export function tsGenerateMock(
  filePath: string,
  interfaceName: string
): MockDataObject {
  return generateTypeScriptInterfaceMock(filePath, interfaceName);
}
