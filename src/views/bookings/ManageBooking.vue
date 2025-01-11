<template>
	<div class="manage-booking-page-wrapper">
		<!-- 1 & 2 & 3) If auth is not ready, user is still logging in, or the booking is loading: Show a spinner -->
		<div v-if="!isAuthReady || isLoggingIn || isLoadingBooking">
			<Spinner size="x-large" />
		</div>

		<!-- 4) If auth is ready, but user is not logged in -->
		<div v-else-if="isAuthReady && !isLoggedIn">
			<BookingNotLoggedIn />
		</div>

		<!-- 5) If booking was not found in Firestore -->
		<div v-else-if="bookingNotFound">
			<BookingNotFound />
		</div>

		<!-- 6) If booking is found, but belongs to another user -->
		<div v-else-if="bookingBelongsToOtherUser">
			<UnauthorizedBooking />
		</div>

		<!-- 7) If booking is complete (fully paid, etc.) -->
		<div v-else-if="bookingCompleted">
			<CompletedBooking
				:booking="booking"
			/>
		</div>

		<!-- 8) If booking belongs to the user but is not finalized/paid -->
		<div v-else>
			<FinalizeBooking
				:booking="booking"
			/>
		</div>
	</div>
</template>

<script>
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase"
import store from "@/store/store"

// Example placeholders for each state
import BookingNotLoggedIn from "@/components/bookings/BookingNotLoggedIn.vue"
import BookingNotFound from "@/components/bookings/BookingNotFound.vue"
import CompletedBooking from "@/components/bookings/CompletedBooking.vue"
import FinalizeBooking from "@/components/bookings/FinalizeBooking.vue"
import UnauthorizedBooking from "@/components/bookings/UnauthorizedBooking.vue"

export default {
	name: "ManageBooking",

	data() {
		return {
			isLoadingBooking: false,

			/** Will hold the booking object */
			booking: null,

			/** True if no booking doc in Firestore */
			bookingNotFound: false,

			bookingBelongsToOtherUser: false,

			/** Example condition if booking is “done” */
			bookingCompleted: false,
		}
	},

	computed: {
		currentUser() {
			return store.state.user.user
		},

		/** @returns {boolean} Track auth states from store */
		isAuthReady() {
			return store.state.user.isAuthReady
		},

		/** @returns {boolean} Track logging in state from store */
		isLoggingIn() {
			return store.state.user.isLoggingIn
		},

		isLoggedIn() {
			return store.state.user.isLoggedIn
		},
	},

	async created() {
		await this.fetchBooking()
	},

	methods: {
		/**
		 * Fetch the booking doc from Firestore based on the route param `:id`.
		 * On success/failure, update local state accordingly.
		 */
		async fetchBooking() {
			this.isLoadingBooking = true
			try {
				const bookingId = this.$route.params.id || ""
				const bookingDocRef = doc(db, "bookings", bookingId)
				const bookingSnap = await getDoc(bookingDocRef)

				if (!bookingSnap.exists()) {
					this.bookingNotFound = true
					return
				}

				const data = bookingSnap.data()
				this.booking = { id: bookingSnap.id, ...data }

				// For example, check if booking belongs to current user:
				if (this.booking.guestID !== this.currentUser?.uid) {
					this.bookingBelongsToOtherUser = true
				}
				else {
					// Example of how to track a “completed” booking:
					// If your Firestore doc has a `paidAt` or `status` field, you can check it.
					if (data?.paidAt) {
						this.bookingCompleted = true
					}
				}
			} catch (error) {
				console.error("Error fetching booking:", error)
			} finally {
				this.isLoadingBooking = false
			}
		},
	},

	components: {
		BookingNotLoggedIn,
		BookingNotFound,
		BookingUnauthorized,
		BookingCompleted,
		BookingFinalize,
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

