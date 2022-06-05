<template>
	<div class="home-wrapper">
		<div class="booking-section">
			<h2>
				Book with Us
			</h2>
			<AvailabilitySearch />
		</div>
		<div class="accordion-sections">
			<h2>
				Most Asked Questions
			</h2>
			<CheckInAndOutAccordion />
			<WifiAccordion />
			<TrashAccordion />
			<ParkingAccordion />
			<AccessibilityAccordion />
			<GuestSafetyAccordion />
		</div>
	</div>
</template>

<script>
import AccessibilityAccordion from "@/components/entities/questions/AccessibilityAccordion"
import AvailabilitySearch from "@/components/forms/AvailabilitySearch.vue"
import CheckInAndOutAccordion from "@/components/entities/questions/CheckInAndOutAccordion"
import GuestSafetyAccordion from "@/components/entities/questions/GuestSafetyAccordion"
import ParkingAccordion from "@/components/entities/questions/ParkingAccordion"
import TrashAccordion from "@/components/entities/questions/TrashAccordion"
import WifiAccordion from "@/components/entities/questions/WifiAccordion"

export default {
	name: "Home",
	components:
	{
		AccessibilityAccordion,
		AvailabilitySearch,
		CheckInAndOutAccordion,
		GuestSafetyAccordion,
		ParkingAccordion,
		TrashAccordion,
		WifiAccordion,
	},
}
</script>

<style lang="less">
@import "~styles/styles";
.home-wrapper {
	display: flex;
	flex-direction: column;
	width: 100%;

	h2 {
		font-size: 25px;
		margin-bottom: 0px;
		margin-top: 0px;
	}

	.booking-section {
		background: @color-lavendar;
	}

	.accordion-sections {
		background: @color-purple;
		color: #3D373C;
		flex-grow: 1;
		padding-bottom: 50px;
		padding-left: 30px;
		padding-right: 30px;
		padding-top: 20px;
		width: fit-content;;

		.accordion-section {

			.accordion-content {
				text-align: left;
				padding-left: 17px;
				padding-right: 17px;
			}
		}
	}
}
</style>
