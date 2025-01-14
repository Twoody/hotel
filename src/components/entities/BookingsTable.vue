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
					<!-- NEW COLUMN: Actions -->
					<th>
						Actions
					</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="(booking) in sortedBookings"
					:key="booking.id"
				>
					<td>{{ booking.startDate || "N/A" }}</td>
					<td>{{ booking.endDate || "N/A" }}</td>
					<td>{{ booking.isPaid ? "Yes" : "No" }}</td>
					<td>{{ booking.status }}</td>
					<!-- Booking "View" link and delete icon if unpaid -->
					<!-- TODO: finish making a global css for this class -->
					<td class="space-evenly action-column">
						<router-link :to="`/booking/${booking.id}`">
							View
						</router-link>
						
						<!-- Show trash icon only if booking is unpaid -->
						<font-awesome-icon
							v-if="!booking.isPaid"
							icon="trash"
							class="delete-icon"
							@click="deleteBooking(booking.id)"
						/>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore"
import { db } from "@/firebase"
import store from "@/store/store"
import { DateTime } from "luxon"

export default {
	name: "BookingsTable",

	data ()
	{
		return {
			isLoading: false,
			sortKey: "",
			sortOrder: "asc",
			userBookings: [],
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
		 * Returns true if booking is fully paid, false otherwise.
		 * (Assumes there's a paidAt field, or a status check, etc.)
		 *
		 * @param booking
		 * @returns {boolean}
		 * @since 2.3.0
		 */
		bookingIsPaid (booking)
		{
			return !!booking?.paidAt
		},

		/**
		 * Delete the booking from Firestore and remove it from the list
		 *
		 * @param {string} bookingId - the Firestore document ID
		 * @since 2.3.0
		 */
		async deleteBooking (bookingId)
		{
			try
			{
				// Remove from firestore
				await deleteDoc(doc(db, "bookings", bookingId))

				// Remove from local state
				this.userBookings = this.userBookings.filter(
					(booking) => booking.id !== bookingId
				)
			}
			catch (error)
			{
				console.error("Error deleting booking:", error)
			}
		},

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
					// If no logged-in user, skip the query
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
						isPaid: this.bookingIsPaid(data),
						status: this.getBookingStatus(data),

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
		 * Determines if a booking is in the past, present, or future,
		 * based on the current date and the start/end dates.
		 *
		 * @param booking
		 * @returns {string} Booking status of "Past", "Present", "Future", or "Unknown"
		 * @since 2.3.0
		 */
		getBookingStatus (booking)
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
		},

		/**
		 * Handle sorting when header is clicked
		 *
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
	.action-column {
		align-items: center;
		min-width: 75px;
	}
	.delete-icon {
		margin-left: 10px;
		cursor: pointer;
		color: @myblack;

		&:hover {
			color: red;
		}
	}
}
.space-between {
	display: flex;
	justify-content: space-between;
}
.space-evenly {
	display: flex;
	justify-content: space-evenly;
}
</style>
