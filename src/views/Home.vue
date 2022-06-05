<template>
	<div class="home-wrapper">
		<div class="booking-section">
			<AvailabilitySearch />
		</div>
		<div class="accordion-sections">
			<CheckInAndOutAccordion />
			<AccessibilityAccordion />
		</div>
	</div>
</template>

<script>
import AccessibilityAccordion from "@/components/entities/AccessibilityAccordion"
import AvailabilitySearch from "@/components/forms/AvailabilitySearch.vue"
import CheckInAndOutAccordion from "@/components/entities/CheckInAndOutAccordion"

export default {
	name: "Home",
	components:
	{
		AccessibilityAccordion,
		AvailabilitySearch,
		CheckInAndOutAccordion,
	},
}
</script>

<style lang="less">
@import "~styles/styles";
.home-wrapper {
	overflow: scroll;
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
