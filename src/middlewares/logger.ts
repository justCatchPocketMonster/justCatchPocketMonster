import { createLogger, format, transports } from "winston";
import { basename } from "node:path";
const { combine, timestamp, printf } = format;

interface LogEntry {
  level: string;
  message: string;
  timestamp: number;
  file?: string;
  line?: string;
}
interface TransformableInfo {
  level: string;
  message: string;
  file?: string;
  line?: string;
  [key: string]: any;
}

function getCallerInfo(): { file: string; line: string } | null {
  const stack = new Error("caller stack").stack;
  if (!stack) return null;

  const stackLines = stack.split("\n");
  const lineColRegex = /:(\d+):(\d+)\)?\s*$/;
  for (let i = 3; i < stackLines.length; i++) {
    const line = stackLines[i];
    if (!line.includes("logger.ts") && line.includes("at ")) {
      const match = lineColRegex.exec(line);
      if (match) {
        const lineNumber = match[1];
        const endIndex = line.indexOf(match[0]);
        if (endIndex !== -1) {
          const pathPart = line
            .slice(0, endIndex)
            .replace(/^\s*at\s+/, "")
            .replace(/^\s*\(\s*/, "")
            .trim();
          if (pathPart) {
            const fileName = basename(pathPart);
            return { file: fileName, line: lineNumber };
          }
        }
      }
    }
  }
  return null;
}

const logFormat = printf((info: TransformableInfo) => {
  const { level, message, timestamp, file, line } = info as LogEntry;
  const location = file && line ? `[${file}:${line}]` : "";
  const locationStr = location ? `${location} ` : "";
  return `${timestamp} ${level}: ${locationStr}${message}`;
});

const logger = createLogger({
  format: combine(timestamp(), logFormat),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "error.log", level: "error" }),
  ],
});

export function newLogger(
  level: string,
  message: string,
  ...args: any[]
): void {
  const callerInfo = getCallerInfo();
  const fullMessage =
    args.length > 0 ? `${message} ${args.join(" ")}` : message;

  const logData: TransformableInfo = {
    level,
    message: fullMessage,
  };

  if (callerInfo) {
    logData.file = callerInfo.file;
    logData.line = callerInfo.line;
  }

  logger.log(level, logData);
}

export default logger;
