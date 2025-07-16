import { program } from "commander";
import {
  generateTypeScriptInterfaceMock,
  generateMultipleMocks,
  tsGenerateMock,
} from "./generator";
import { existsSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";

const CLI_VERSION = "1.0.0";
const CLI_NAME = "mockstruct";
const CLI_DESCRIPTION = "Advanced TypeScript Interface Mock Generator CLI";

program
  .name(CLI_NAME)
  .version(CLI_VERSION)
  .description(CLI_DESCRIPTION)
  .helpOption("-h, --help", "Display help for command");

program
  .command("generate")
  .alias("gen")
  .alias("g")
  .description("Generate mock data from TypeScript interface")
  .requiredOption(
    "-f, --file <filePath>",
    "Path to TypeScript file containing the interface"
  )
  .requiredOption(
    "-i, --interface <interfaceName>",
    "Name of the interface to generate mock for"
  )
  .option("-c, --count <number>", "Number of mock objects to generate", "1")
  .option("-s, --seed <number>", "Seed for consistent random generation")
  .option(
    "-o, --output <format>",
    "Output format (json, pretty, compact)",
    "pretty"
  )
  .option(
    "--out <file>",
    "Save output to a JSON file instead of displaying in console"
  )
  .option("--no-validation", "Skip file validation")
  .action(async (options) => {
    try {
      await handleGenerateCommand(options);
    } catch (error) {
      handleError(error);
    }
  });

// THIS IS LEGACY COMMAND
program
  .command("ms")
  .description("Generate mock structure (legacy command)")
  .requiredOption(
    "--interface <filePath>",
    "Path to TypeScript file containing the interface"
  )
  .requiredOption("--name <interfaceName>", "Name of the interface to parse")
  .option(
    "--out <file>",
    "Save output to a JSON file instead of displaying in console"
  )
  .action(async (options) => {
    try {
      const {
        interface: filePath,
        name: interfaceName,
        out: outputFile,
      } = options;

      if (!validateFile(filePath)) {
        return;
      }

      const mockData = tsGenerateMock(filePath, interfaceName);

      if (outputFile) {
        await saveToFile(mockData, outputFile, "pretty");
        console.log(`✅ Mock data saved to: ${resolve(outputFile)}`);
      } else {
        console.log(JSON.stringify(mockData, null, 2));
      }
    } catch (error) {
      handleError(error);
    }
  });

program
  .command("info")
  .alias("i")
  .description("Display information about the CLI")
  .action(() => {
    displayInfo();
  });

program
  .command("validate")
  .alias("val")
  .description("Validate TypeScript file and interface")
  .requiredOption("-f, --file <filePath>", "Path to TypeScript file")
  .requiredOption(
    "-i, --interface <interfaceName>",
    "Interface name to validate"
  )
  .action(async (options) => {
    try {
      await handleValidateCommand(options);
    } catch (error) {
      handleError(error);
    }
  });

async function handleGenerateCommand(options: {
  file: string;
  interface: string;
  count: string;
  seed?: string;
  output: string;
  out?: string;
  validation: boolean;
}) {
  const {
    file: filePath,
    interface: interfaceName,
    count: countStr,
    seed: seedStr,
    output: outputFormat,
    out: outputFile,
    validation,
  } = options;

  // Validate inputs
  const resolvedFilePath = resolve(filePath);

  if (validation && !validateFile(resolvedFilePath)) {
    return;
  }

  const count = parseInt(countStr, 10);
  if (isNaN(count) || count <= 0) {
    console.error("❌ Error: Count must be a positive number");
    process.exit(1);
  }

  const seed = seedStr ? parseInt(seedStr, 10) : undefined;
  if (seedStr && isNaN(seed!)) {
    console.error("❌ Error: Seed must be a valid number");
    process.exit(1);
  }

  if (outputFile && !validateOutputFile(outputFile)) {
    return;
  }

  console.log(
    `🔄 Generating ${count} mock object(s) for interface "${interfaceName}"...`
  );

  let mockData: any;

  if (count === 1) {
    mockData = generateTypeScriptInterfaceMock(
      resolvedFilePath,
      interfaceName,
      { seed }
    );
  } else {
    mockData = generateMultipleMocks(resolvedFilePath, interfaceName, count, {
      seed,
    });
  }

  if (outputFile) {
    await saveToFile(mockData, outputFile, outputFormat);
    console.log(
      `\n✅ Successfully generated ${count} mock object(s) for interface "${interfaceName}"`
    );
    console.log(`📄 Output saved to: ${resolve(outputFile)}`);

    const stats = require("fs").statSync(resolve(outputFile));
    const fileSizeInBytes = stats.size;
    const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(2);
    console.log(`📊 File size: ${fileSizeInKB} KB`);

    if (Array.isArray(mockData)) {
      console.log(`📊 Generated ${mockData.length} objects`);
    } else {
      const propertyCount = Object.keys(mockData).length;
      console.log(`📊 Generated object with ${propertyCount} properties`);
    }
  } else {
    outputMockData(mockData, outputFormat, interfaceName, count);
  }
}

async function handleValidateCommand(options: {
  file: string;
  interface: string;
}) {
  const { file: filePath, interface: interfaceName } = options;
  const resolvedFilePath = resolve(filePath);

  if (!validateFile(resolvedFilePath)) {
    return;
  }

  try {
    generateTypeScriptInterfaceMock(resolvedFilePath, interfaceName);
    console.log(`✅ Interface "${interfaceName}" is valid and can be mocked`);
  } catch (error: any) {
    console.error(`❌ Interface validation failed: ${error.message}`);
    process.exit(1);
  }
}

function validateFile(filePath: string): boolean {
  if (!existsSync(filePath)) {
    console.error(`❌ Error: File "${filePath}" does not exist`);
    process.exit(1);
  }

  if (!filePath.endsWith(".ts") && !filePath.endsWith(".tsx")) {
    console.error(`❌ Error: File "${filePath}" is not a TypeScript file`);
    process.exit(1);
  }

  return true;
}

function validateOutputFile(outputPath: string): boolean {
  try {
    const resolvedPath = resolve(outputPath);
    const dir = dirname(resolvedPath);

    if (!existsSync(dir)) {
      try {
        mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      } catch (error) {
        console.error(`❌ Error: Cannot create directory "${dir}"`);
        process.exit(1);
      }
    }

    if (!outputPath.toLowerCase().endsWith(".json")) {
      console.error(`❌ Error: Output file must have .json extension`);
      process.exit(1);
    }

    if (existsSync(resolvedPath)) {
      console.log(
        `⚠️  Warning: File "${resolvedPath}" already exists and will be overwritten`
      );
    }

    return true;
  } catch (error) {
    console.error(`❌ Error: Invalid output file path "${outputPath}"`);
    process.exit(1);
  }
}

async function saveToFile(
  data: any,
  filePath: string,
  format: string
): Promise<void> {
  try {
    const resolvedPath = resolve(filePath);
    let jsonContent: string;

    switch (format.toLowerCase()) {
      case "compact":
      case "json":
        jsonContent = JSON.stringify(data);
        break;
      case "pretty":
      default:
        jsonContent = JSON.stringify(data, null, 2);
        break;
    }

    writeFileSync(resolvedPath, jsonContent, "utf8");
  } catch (error: any) {
    console.error(`❌ Error writing to file: ${error.message}`);
    process.exit(1);
  }
}

function outputMockData(
  mockData: any,
  format: string,
  interfaceName: string,
  count: number
): void {
  console.log(
    `\n✅ Successfully generated ${count} mock object(s) for interface "${interfaceName}"\n`
  );

  switch (format.toLowerCase()) {
    case "json":
    case "compact":
      console.log(JSON.stringify(mockData));
      break;

    case "pretty":
    default:
      console.log(JSON.stringify(mockData, null, 2));
      break;
  }

  if (Array.isArray(mockData)) {
    console.log(`\n📊 Generated ${mockData.length} objects`);
  } else {
    const propertyCount = Object.keys(mockData).length;
    console.log(`\n📊 Generated object with ${propertyCount} properties`);
  }
}

function handleError(error: any): void {
  if (error.message) {
    console.error(`❌ Error: ${error.message}`);
  } else {
    console.error(`❌ Unexpected error:`, error);
  }

  console.error("\n💡 Use --help for usage information");
  process.exit(1);
}

function displayInfo(): void {
  console.log(`
🚀 ${CLI_NAME} v${CLI_VERSION}
${CLI_DESCRIPTION}

📦 Features:
• Generate realistic mock data from TypeScript interfaces
• Support for multiple mock objects generation
• Seed-based consistent random generation
• Multiple output formats (JSON, pretty, compact)
• Save output to JSON files
• File and interface validation
• Contextual data generation based on property names

🔧 Usage Examples:
  ${CLI_NAME} generate -f ./types.ts -i User
  ${CLI_NAME} gen -f ./types.ts -i User -c 5 -s 12345
  ${CLI_NAME} gen -f ./types.ts -i User --out ./output/users.json
  ${CLI_NAME} gen -f ./types.ts -i User -c 10 -o compact --out ./data/mock-users.json
  ${CLI_NAME} validate -f ./types.ts -i User
  ${CLI_NAME} ms --interface ./types.ts --name User --out ./legacy-output.json

📚 For more help: ${CLI_NAME} --help
  `);
}

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error.message);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
  process.exit(1);
});

program.parse();

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
