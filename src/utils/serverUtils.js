import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"

/**
 * Creates a migration log entry
 *
 * @param message
 * @param logFile {string} - The name of the file that is logged to
 */
export function logMessage (message, logFile) 
{
	const __filename = fileURLToPath(import.meta.url) // Get the full path of the current file
	const __dirname = path.dirname(__filename) // Get the directory containing the current file

	const logDir = path.resolve(__dirname, "../../logs")
	if (!fs.existsSync(logDir)) 
	{
		fs.mkdirSync(logDir)
	}

	const logPath = path.join(logDir, logFile)
	const timestamp = new Date().toISOString()
	fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`)
}
