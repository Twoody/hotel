<template>
	<div class="home-wrapper">
		<div class="booking-section">
			<h2>
				Book with Us
			</h2>
			<AvailabilitySearch
				hideDateBar
				:isProcessing="isProcessing"
				@booking-request="processBookingRequest"
			/>
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
import AccessibilityAccordion from "@/components/accordions/questions/AccessibilityAccordion"
import CheckInAndOutAccordion from "@/components/accordions/questions/CheckInAndOutAccordion"
import GuestSafetyAccordion from "@/components/accordions/questions/GuestSafetyAccordion"
import ParkingAccordion from "@/components/accordions/questions/ParkingAccordion"
import TrashAccordion from "@/components/accordions/questions/TrashAccordion"
import WifiAccordion from "@/components/accordions/questions/WifiAccordion"

export default {
	name: "Home",
	components:
	{
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

	methods: 
	{
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
		 * @since 2.3.0
		 */
		async processBookingRequest () 
		{
			this.isProcessing = true
			await new Promise((r) => setTimeout(r, 2000))
			this.isProcessing = false 
			console.log("done processing")
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
		background: @color-lavendar;
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
