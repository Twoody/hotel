<template>
	<div class="home-wrapper">
		<div class="booking-section">
			<h2>
				Book with Us
			</h2>
			<AvailabilitySearch
				hideDateBar
				:cleaningFee="totalBookingFees"
				:dailyRate="$store.state.hotel.dailyRate"
				:disabled="isBookingDisabled"
				:hideSubmitButton="currentUser?.uid ? false : true"
				:isProcessing="isProcessing"
				:isLoading="!isAuthReady"
				@booking-request="processBookingRequest"
			/>
			<!-- Full-width login button, displayed when no user is found -->
			<MyButton
				v-if="!currentUser?.uid"
				class="login-button"
				@click="$router.push('/login')"
			>
				Log in to Book
			</MyButton>
		</div>
		<div class="accordion-sections">
			<h2>
				Most Asked Questions
			</h2>
			<div class="flex-box">
				<CheckInAndOutAccordion class="flex-item" />
				<WifiAccordion class="flex-item" />
				<TrashAccordion class="flex-item" />
				<ParkingAccordion class="flex-item" />
				<AccessibilityAccordion class="flex-item" />
				<GuestSafetyAccordion class="flex-item" />
			</div>
		</div>
	</div>
</template>

<script>
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/firebase" // <-- import your firebase db instance

import AccessibilityAccordion from "@/components/accordions/questions/AccessibilityAccordion"
import CheckInAndOutAccordion from "@/components/accordions/questions/CheckInAndOutAccordion"
import GuestSafetyAccordion from "@/components/accordions/questions/GuestSafetyAccordion"
import ParkingAccordion from "@/components/accordions/questions/ParkingAccordion"
import TrashAccordion from "@/components/accordions/questions/TrashAccordion"
import WifiAccordion from "@/components/accordions/questions/WifiAccordion"
import { addDays } from "@/utils/misc.js"

export default {
	name: "Home",
	components: {
		AccessibilityAccordion,
		CheckInAndOutAccordion,
		GuestSafetyAccordion,
		ParkingAccordion,
		TrashAccordion,
		WifiAccordion,
	},
	data ()
	{
		return {
			isProcessing: false, // Make sure this is here!
		}
	},

	methods: {
		/**
		 * @returns {void} Get
		 * @since 2.3.0
		 */
		getBookedDays ()
		{
			// TODO: Store dates in firestore
			//			Get disabled dates from firestore
			//			Utilize `disableDays` via Vue Cal (e.g. 2020-09-18)
		},

		/**
		 * Handles the booking request by creating a booking document in Firestore.
		 * Redirects the user to the manage booking page upon success.
		 *
		 * @param {object} bookingData - The data related to the booking.
		 * @param {string} [bookingData.startDate] - The start date of the booking.
		 * @param {string} [bookingData.endDate] - The end date of the booking.
		 * @returns {Promise<void>} Resolves when the booking request is processed.
		 * @since 2.3.0
		 */
		async processBookingRequest (bookingData = {})
		{
			// Do not allow multiple processes on the same selection
			if (this.isProcessing)
			{
				return
			}

			// Handle state management
			this.isProcessing = true

			try
			{
				// Create a new document in the bookings collection
				const timestamp = serverTimestamp()
				const bookingsRef = await collection(db, "bookings")
				const newBookingRef = doc(bookingsRef)
				// If user only selected one date, properly configure their input to include an endDate
				let storedEndDate = bookingData.endDate
				if (bookingData.startDate === bookingData.endDate)
				{
					storedEndDate = addDays(bookingData.startDate, 1)
				}
				await setDoc(
					newBookingRef,
					{
						bookedAt: null,
						countChildren: null,
						countGuests: null,
						countPets: null,
						createdAt: timestamp,
						// endDate is always the checkout date
						endDate: storedEndDate,
						guestID: this.currentUser.uid,
						hostID: 1,
						startDate: bookingData.startDate || null,
						updatedAt: timestamp,
					}
				)

				this.$router.push({
					name: "manageBooking",
					params: {
						id: newBookingRef.id,
					},
				})
			}
			catch (err)
			{
				console.error("Error creating booking document: ", err)
			}
			finally
			{
				this.isProcessing = false
			}
		},
	},
	computed: {
		currentUser ()
		{
			return this.$store.state.user.user
		},

		/**
		 * @returns {boolean} - Whether auth state has finished checking
		 */
		isAuthReady ()
		{
			return this.$store.state.user.isAuthReady
		},

		// TODO - this is broken and needs fixed
		isBookingDisabled ()
		{
			return this.isProcessing || !this.currentUser?.uid || !this.$store.state.hotel.isLoaded
		},

		totalBookingFees ()
		{
			return this.$store.state.hotel.cleaningFee
		},
	},
}
</script>

<style lang="less">
@import "../../assets/styles/styles";
.home-wrapper {
	display: flex;
	flex-direction: column;
	padding-top: 34px;
	width: 100%;

	h2 {
		font-size: clamp(25px, 3vw, 35px);
		margin-bottom: 0px;
		margin-top: 0px;
	}

	.booking-section {
		align-items: center;
		background: @color-lavendar;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		min-height: fit-content;
		overflow: visible;
		padding: 20px;

		.availability-search-wrapper {
			align-items: center;
			display: flex;
			flex-direction: column;
			flex-grow: 1;
			height: fit-content;
			.content-section {
				overflow: visible;
			}
		}

	}
	/* Style for the login button */
	.login-button {
		width: 100%;
		max-width: 400px;
		background-color: @color-primary-monochromatic-2;
		color: white;
		border: none;
		padding: 12px;
		font-size: 18px;
		font-weight: bold;
		cursor: pointer;
		margin-top: 15px;
		border-radius: 5px;
		text-align: center;
	}

	.login-button:hover {
		background-color: darken(@color-primary-monochromatic-2, 10%);
	}

	.accordion-sections {
		align-items: center;
		align-content: center;
		background: @color-purple;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		justify-content: center;
		padding-bottom: 50px;
		padding-top: 20px;
		width: 100%;

		.flex-box {
			align-items: center;
			align-content: center;
			display: flex;
			flex-direction: column;
			justify-content: center;
			max-width: min(98%, 660px);
			padding-top: 20px;

			.flex-item {
				flex-grow: 1;
				width: 100%;

			}
			.accordion-wrapper {
				margin: 7px;
			}
			.question-accordion-wrapper {
				max-width: 100%;
			}
		}
	}
}
</style>

