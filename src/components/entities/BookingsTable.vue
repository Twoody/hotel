<template>
	<div class="bookings-table-wrapper">
		<h2>Your Bookings</h2>

		<!-- Loading indicator while fetching data -->
		<div v-if="isLoading">
			<Spinner size="x-large" />
		</div>

		<!-- If finished loading and no bookings found -->
		<div v-else-if="!isLoading && sortedBookings.length === 0">
			<p>No bookings found.</p>
		</div>

		<table
			v-else
			class="bookings-table"
		>
			<thead>
				<tr>
					<!-- TODO: Show amount paid -->
					<th @click="setSort('startDate')">
						Start Date
						<span v-if="sortKey === 'startDate'">
							{{ sortOrder === 'asc' ? '↑' : '↓' }}
						</span>
					</th>
					<th @click="setSort('endDate')">
						End Date
						<span v-if="sortKey === 'endDate'">
							{{ sortOrder === 'asc' ? '↑' : '↓' }}
						</span>
					</th>
					<th @click="setSort('paidAt')">
						Paid?
						<span v-if="sortKey === 'paidAt'">
							{{ sortOrder === 'asc' ? '↑' : '↓' }}
						</span>
					</th>
					<th @click="setSort('status')">
						Status
						<span v-if="sortKey === 'status'">
							{{ sortOrder === 'asc' ? '↑' : '↓' }}
						</span>
					</th>
					<th>View</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="(booking, index) in sortedBookings"
					:key="booking.id"
				>
					<td>{{ booking.startDate || "N/A" }}</td>
					<td>{{ booking.endDate || "N/A" }}</td>
					<td>{{ bookingIsPaid(booking) ? "Yes" : "No" }}</td>
					<td>{{ getBookingStatus(booking) }}</td>
					<td>
						<router-link :to="`/booking/${booking.id}`">
							View
						</router-link>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import store from "@/store/store"
import { DateTime } from "luxon"

export default {
	name: "BookingsTable",

	data ()
	{
		return {
			isLoading: false,
			userBookings: [],
			sortKey: "",
			sortOrder: "asc",
		}
	},

	created ()
	{
		this.fetchUserBookings()
	},

	computed: {
		/**
		 * @since 2.3.0
		 */
		sortedBookings ()
		{
			if (!this.sortKey || this.userBookings.length === 0)
			{
				return this.userBookings
			}
			const sorted = [
				...this.userBookings,
			]
			sorted.sort((a, b) =>
			{
				let aVal = a[this.sortKey]
				let bVal = b[this.sortKey]

				// If sorting by date field
				if (this.sortKey === "startDate" || this.sortKey === "endDate")
				{
					aVal = aVal ? new Date(aVal).getTime() : 0
					bVal = bVal ? new Date(bVal).getTime() : 0
				}

				if (aVal < bVal)
				{
					return this.sortOrder === "asc" ? -1 : 1
				}
				if (aVal > bVal)
				{
					return this.sortOrder === "asc" ? 1 : -1
				}
				return 0
			})
			return sorted
		},
	},

	methods: {
		/**
		 * Fetch all bookings for the currently logged-in user
		 *
		 * @todo Probably move this to the store and do in the background when the app is loaded
		 * @since 2.3.0
		 */
		async fetchUserBookings ()
		{
			this.isLoading = true
			try
			{
				const currentUser = store.state.user.user
				if (!currentUser?.uid)
				{
					// If no logged-in user, skip the query or handle appropriately
					this.userBookings = []
					return
				}

				const q = query(
					collection(db, "bookings"),
					where("guestID", "==", currentUser.uid)
				)
				const querySnapshot = await getDocs(q)
				const bookings = []
				querySnapshot.forEach((docSnap) =>
				{
					const data = docSnap.data()
					bookings.push({
						id: docSnap.id,
						...data,
					})
				})
				this.userBookings = bookings
			}
			catch (error)
			{
				console.error("Error fetching user bookings:", error)
			}
			finally
			{
				this.isLoading = false
			}
		},

		/**
		 * Returns true if booking is fully paid, false otherwise.
		 * (Assumes there's a paidAt field, or a status check, etc.)
		 *
		 * @param booking
		 * @returns {boolean}
		 * @since 2.3.0
		 */
		bookingIsPaid (booking)
		{
			return !!booking?.paidAt // Example logic
		},

		/**
		 * Determines if a booking is in the past, present, or future,
		 * based on the current date and the start/end dates.
		 *
		 * @param booking
		 * @returns {string} Booking status of past, present, future, or unknown
		 * @since 2.3.0
		 */
		getBookingStatus (booking)
		{
			// Current time using luxon
			const now = DateTime.now()

			// Convert booking start/end to luxon DateTime objects if they exist
			const startTime = booking?.startDate
				? DateTime.fromISO(booking.startDate)
				: null

			const endTime = booking?.endDate
				? DateTime.fromISO(booking.endDate)
				: null

			// If either date is missing or invalid, return 'Unknown'
			if (!startTime || !endTime || !startTime.isValid || !endTime.isValid) 
			{
				return "Unknown"
			}

			// Extend the end date by 1 day to account for overlapping time
			// (the user is still considered present through the following day).
			const extendedEndTime = endTime.plus({
				days: 1, 
			})

			// Compare DateTime objects directly
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
		},

		/**
		 * @param key
		 * @since 2.3.0
		 */
		setSort (key)
		{
			if (this.sortKey === key)
			{
				this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc"
			}
			else
			{
				this.sortKey = key
				this.sortOrder = "asc"
			}
		},
	},
}
</script>

<style scoped lang="less">
@import "../../../assets/styles/styles";

.bookings-table-wrapper {
	background-color: @color-lavendar;
	border-radius: 7px;
	margin: 7px;
	padding: 20px;

	h2 {
		border-bottom: 1px solid @myblack;
		margin-bottom: 10px;
	}

	.bookings-table {
		border-collapse: collapse;
		width: 100%;
		margin-top: 15px;

		th, td {
			border: 1px solid @myblack;
			padding: 8px;
			text-align: left;
		}
		th {
			background-color: @color-purple;
			color: white;
		}
	}
}
</style>
