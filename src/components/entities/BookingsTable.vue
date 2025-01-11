<template>
	<div class="bookings-table-wrapper">
		<h2>Your Bookings</h2>
		<!-- Spinner or loading indicator while fetching data -->
		<div v-if="isLoading">
			<Spinner size="x-large" />
		</div>

		<!-- If finished loading and no bookings found -->
		<div v-else-if="!isLoading && userBookings.length === 0">
			<p>No bookings found.</p>
		</div>

		<!-- Otherwise, show table of bookings -->
		<table
			v-else
			class="bookings-table"
		>
			<thead>
				<tr>
					<th>Start Date</th>
					<th>End Date</th>
					<th>Paid?</th>
					<th>Status</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="(booking, index) in userBookings"
					:key="booking.id"
				>
					<td>{{ booking.startDate || "N/A" }}</td>
					<td>{{ booking.endDate || "N/A" }}</td>
					<td>{{ bookingIsPaid(booking) ? "Yes" : "No" }}</td>
					<td>{{ getBookingStatus(booking) }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import {collection, query, where, getDocs} from "firebase/firestore"
import { db } from "@/firebase"
import store from "@/store/store"

export default {
	name: "BookingsTable",

	data () 
	{
		return {
			isLoading: false,
			userBookings: [],
		}
	},

	created () 
	{
		this.fetchUserBookings()
	},

	methods: {
		/**
		 * Fetch all bookings for the currently logged-in user
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
		 */
		bookingIsPaid (booking) 
		{
			return !!booking?.paidAt // or whatever logic you use
		},

		/**
		 * Determines if a booking is in the past, present, or future,
		 * based on the current date and the start/end dates.
		 *
		 * @param booking
		 */
		getBookingStatus (booking) 
		{
			const now = new Date().getTime()
			const startTime = booking?.startDate
				? new Date(booking.startDate).getTime()
				: null
			const endTime = booking?.endDate
				? new Date(booking.endDate).getTime()
				: null

			if (!startTime || !endTime) 
			{
				return "Unknown"
			}

			// If now is before the start date
			if (now < startTime) 
			{
				return "Future"
			}
			// If now is after the end date
			else if (now > endTime) 
			{
				return "Past"
			}
			// Otherwise, we are within the stay window
			return "Present"
		},
	},

	components: {
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
