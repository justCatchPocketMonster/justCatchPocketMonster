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

const LINE_COL_REGEX = /:(\d+):(\d+)\)?\s*$/;

function parseStackLine(line: string): { file: string; line: string } | null {
  if (line.includes("logger.ts") || !line.includes("at ")) return null;
  const match = LINE_COL_REGEX.exec(line);
  if (!match) return null;
  const lineNumber = match[1];
  const endIndex = line.indexOf(match[0]);
  if (endIndex === -1) return null;
  const pathPart = line
    .slice(0, endIndex)
    .replace(/^\s*at\s+/, "")
    .replace(/^\s*\(\s*/, "")
    .trim();
  if (!pathPart) return null;
  return { file: basename(pathPart), line: lineNumber };
}

function getCallerInfo(): { file: string; line: string } | null {
  const stack = new Error("caller stack").stack;
  if (!stack) return null;
  const stackLines = stack.split("\n");
  for (let i = 3; i < stackLines.length; i++) {
    const result = parseStackLine(stackLines[i]);
    if (result) return result;
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
  level: "error" | "warn" | "info" | "debug",
  message: string | Error,
  ...args: any[]
): void {
  const callerInfo = getCallerInfo();
  const messageStr = message instanceof Error ? message.message : message;
  const fullMessage =
    args.length > 0 ? `${messageStr} ${args.join(" ")}` : messageStr;

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
