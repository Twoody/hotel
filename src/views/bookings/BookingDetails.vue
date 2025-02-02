<!-- BookingDetails.vue -->
<template>
	<section class="database-details-wrapper">
		<QuestionAccordion>
			<template #title>
				<h3>Nerdy stuff</h3>
			</template>
			<template #content>
				<p><strong>Booking ID:</strong> {{ bookingID }}</p>
				<p><strong>Guest ID:</strong> {{ booking.guestID }}</p>
			</template>
		</QuestionAccordion>
	</section>
</template>

<script>
export default {
	name: "BookingDetails",
	props: {
		booking: {
			required: true,
			type: Object,
		},
	},
	computed: {
		bookingID () 
		{
			return this.booking.id || ""
		},
	},
}
</script>

<style scoped lang="less">
.database-details-wrapper {
	h2, h3 {
		margin: 0;
		padding: 0;
	}
}
</style>
