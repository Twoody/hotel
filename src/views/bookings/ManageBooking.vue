<template>
	<div class="manage-booking-page-wrapper">
		<!-- 1 & 2 & 3)
			If auth is not ready, user is still logging in, or the booking is loading: Show a spinner
		-->
		<div
			v-if="!isAuthReady || isLoggingIn || isLoadingBooking"
			data-testid="conditional-view-manager-loading"
		>
			<Spinner size="x-large" />
		</div>

		<!-- 4) If auth is ready, but user is not logged in -->
		<div
			v-else-if="isAuthReady && !isLoggedIn"
			data-testid="conditional-view-manager-needs-logged-in"
		>
			<BookingNotLoggedIn />
		</div>

		<!-- 5) If booking was not found in Firestore -->
		<div
			v-else-if="bookingNotFound"
			data-testid="conditional-view-manager-booking-404"
		>
			<BookingNotFound />
		</div>

		<!-- 6) If booking is found, but belongs to another user -->
		<div
			v-else-if="!bookingBelongsToUser"
			data-testid="conditional-view-manager-not-right-user"
		>
			<UnauthorizedBooking />
		</div>

		<!-- 7) If booking is complete (fully paid, etc.) -->
		<div
			v-else-if="bookingCompleted"
			data-testid="conditional-view-manager-good-booking"
		>
			<CompletedBooking
				:booking="booking"
			/>
		</div>

		<!-- 8) If booking belongs to the user but is not finalized/paid -->
		<div
			v-else
			data-testid="conditional-view-manager-needs-completed"
		>
			<FinalizeBooking
				:booking="booking"
			/>
		</div>
	</div>
</template>

<script>
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase"

// Example placeholders for each state
import BookingNotLoggedIn from "@/views/bookings/BookingNotLoggedIn.vue"
import BookingNotFound from "@/views/bookings/BookingNotFound.vue"
import CompletedBooking from "@/views/bookings/CompletedBooking.vue"
import FinalizeBooking from "@/views/bookings/FinalizeBooking.vue"
import UnauthorizedBooking from "@/views/bookings/UnauthorizedBooking.vue"

export default {
	name: "ManageBooking",

	data ()
	{
		return {
			/** Will hold the booking object */
			booking: {
				invalid: true,
			},

			/** True if no booking doc in Firestore */
			bookingNotFound: false,

			isLoadingBooking: false,
		}
	},

	computed: {

		/** @returns {boolean} Condition if booking was created by the current user or not */
		bookingBelongsToUser ()
		{
			if (this.booking.guestID === this.currentUser?.uid)
			{
				return true
			}
			return false
		},

		/** @returns {boolean} Condition if booking is “done” and paid for */
		bookingCompleted ()
		{
			return this.booking?.paidAt ? true : false
		},

		currentUser ()
		{
			if (!this.$store?.state?.user?.user)
			{
				return {
					invalid: true,
				}
			}
			return this.$store.state.user.user
		},

		/** @returns {boolean} Track auth states from store */
		isAuthReady ()
		{
			return this.$store.state.user.isAuthReady
		},

		isLoggedIn ()
		{
			return this.$store.state.user.isLoggedIn
		},

		/** @returns {boolean} Track logging in state from store */
		isLoggingIn ()
		{
			return this.$store.state.user.isLoggingIn
		},
	},

	async created ()
	{
		await this.fetchBooking()
	},

	methods: {
		/**
		 * Fetch the booking doc from Firestore based on the route param `:id`.
		 * On success/failure, update local state accordingly.
		 */
		async fetchBooking ()
		{
			this.isLoadingBooking = true
			try
			{
				const bookingId = this.$route.params.id || ""
				const bookingDocRef = doc(db, "bookings", bookingId)
				const bookingSnap = await getDoc(bookingDocRef)

				if (!bookingSnap?.exists())
				{
					this.bookingNotFound = true
					return
				}

				const data = bookingSnap.data()
				this.booking = {
					id: bookingSnap.id,
					...data,
				}
			}
			catch (error)
			{
				console.error("Error fetching booking:", error)
			}
			finally
			{
				this.isLoadingBooking = false
			}
		},
	},

	components: {
		BookingNotFound,
		BookingNotLoggedIn,
		CompletedBooking,
		FinalizeBooking,
		UnauthorizedBooking,
	},
}
</script>

<style scoped lang="less">
@import "../../../assets/styles/styles";

.manage-booking-page-wrapper {
	background-color: @color-purple;
	border-radius: 7px;
	height: auto;
	margin: 7px;
	max-width: min(98%, 660px);
	padding: 9px;
	width: 100%;

	h1 {
		border-bottom: 1px solid @myblack;
		margin-bottom: 5px;
	}
	p {
		font-size: 25px;
	}
}
</style>

