<template>
	<div class="home-wrapper">
		<AvailabilitySearch />
		<div class="accordion-sections">
			<CheckInAndOutAccordion />
		</div>
	</div>
</template>

<script>
import AvailabilitySearch from "@/components/forms/AvailabilitySearch.vue"
import CheckInAndOutAccordion from "@/components/entities/CheckInAndOutAccordion"

export default {
	name: "Home",
	components:
	{
		AvailabilitySearch,
		CheckInAndOutAccordion,
	},
}
</script>

<style lang="less">
.home-wrapper {
	padding-bottom: 50px;
	overflow: scroll;
	width: 100%;

	h2 {
		font-size: 25px;
		margin-bottom: 0px;
		margin-top: 0px;
	}

	.accordion-sections {
		margin-left: 30px;
		margin-right: 30px;

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
