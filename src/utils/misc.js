import { DateTime } from "luxon"

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
