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

		<!-- Scrollable table -->
		<div
			v-else
			class="table-scroll-wrapper"
		>
			<table class="bookings-table">
				<thead>
					<tr>
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
						<th class="action-column">
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
						<td class="space-evenly action-column">
							<router-link :to="`/booking/${booking.id}`">
								View
							</router-link>
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
	</div>
</template>

<script>
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore"
import { db } from "@/firebase"
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
		 * Sorts the user's bookings based on the selected sort key and order.
		 *
		 * @returns {Array<object>} The sorted list of bookings.
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
		 * Determines whether the booking is fully paid.
		 *
		 * @param {object} booking - The booking object to check.
		 * @returns {boolean} True if the booking is paid, false otherwise.
		 * @since 2.3.0
		 */
		bookingIsPaid (booking)
		{
			return !!booking?.paidAt
		},

		/**
		 * Deletes a booking from Firestore and updates the local state.
		 *
		 * @param {string} bookingId - The Firestore document ID of the booking to delete.
		 * @returns {Promise<void>}
		 * @since 2.3.0
		 */
		async deleteBooking (bookingId)
		{
			try
			{
				// Remove from Firestore
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
		 * Fetches all bookings for the currently logged-in user.
		 *
		 * @todo Move this to the store for background fetching.
		 * @returns {Promise<void>}
		 * @since 2.3.0
		 */
		async fetchUserBookings ()
		{
			this.isLoading = true
			try
			{
				const currentUser = this.$store.state.user.user
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
				querySnapshot?.forEach((docSnap) =>
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
		 * Determines the booking status (Past, Present, Future, or Unknown).
		 *
		 * @param {object} booking - The booking object containing start and end dates.
		 * @returns {string} The status of the booking.
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
		 * Updates the sorting key and order when a header is clicked.
		 *
		 * @param {string} key - The key to sort by.
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

	.table-scroll-wrapper {
		overflow-x: auto; /* Enable horizontal scrolling */
		margin-top: 15px;
	}

	.bookings-table {
		border-collapse: collapse;
		width: 100%; /* Allows the table to shrink to fit its content */

		th,
		td {
			border: 1px solid @myblack;
			padding: 8px;
			text-align: left;
		}

		th {
			text-align: center;
			background-color: @color-purple;
			color: white;
		}
	}

	.action-column {
		min-width: 95px;
		text-align: center;
	}

	.space-evenly {
		display: flex;
		justify-content: space-evenly;
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
</style>
