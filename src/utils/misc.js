import { DateTime } from "luxon"
import { fs } from "fs"

/**
 * Adds a specified number of days to a given date string.
 * Returns an empty string if the input date is invalid
 *
 * @param {string} dateString - The input date in 'YYYY-MM-DD' format.
 * @param {number} days - The number of days to add.
 * @returns {string} - The date in 'YYYY-MM-DD' format; Else an empty string if invalid input
 * @example
 * addDays('2025-02-04', 10); // Returns '2025-02-14'
 * addDays('invalid date', 10); // Returns ''
 */
export function addDays (dateString, days) 
{
	const date = DateTime.fromISO(dateString)
	if (!date.isValid) 
	{
		return ""
	}

	return date.plus({
		days, 
	}).toFormat("yyyy-MM-dd")

}

/**
 * Determines the booking status (Past, Present, Future, or Unknown).
 *
 * @param {object} booking - The booking object containing start and end dates.
 * @returns {string} The status of the booking.
 * @since 2.3.0
 */
export function getBookingStatus (booking)
{
	// Current time using luxon
	const now = DateTime.now()

	// Convert booking start/end to luxon DateTime objects if valid
	const startTime = booking?.startDate
		? DateTime.fromISO(booking.startDate)
		: null
	const endTime = booking?.endDate
		? DateTime.fromISO(booking.endDate)
		: null

	if (!startTime || !endTime || !startTime.isValid || !endTime.isValid)
	{
		return "Unknown"
	}

	// Extend the end date by 1 day to account for overlapping time
	const extendedEndTime = endTime.plus({
		days: 1,
	})

	if (now < startTime)
	{
		return "Future"
	}
	else if (now > extendedEndTime)
	{
		return "Past"
	}
	else
	{
		return "Present"
	}
}

/**
 * Creates a migration log entry
 *
 * @param message
 * @param type
 */
export function logMessage (message, type = "info") 
{
	const logDir = path.resolve(__dirname, "../../logs")
	if (!fs.existsSync(logDir)) 
	{
		fs.mkdirSync(logDir)
	}

	const logFile = type === "error" ? "migrations_errors.log" : "migrations.log"
	const logPath = path.join(logDir, logFile)

	const timestamp = new Date().toISOString()
	fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`)
}

export const TRUTHYS = [
	"true",
	"True",
	"TRUE",
	"1",
	1,
]
