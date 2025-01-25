<template>
	<div class="completed-booking-wrapper">
		<h2>Booking Completed</h2>
		<p>
			Thank you! Your booking is complete and paid in full.
		</p>

		<!-- Example: Show some summary details -->
		<div v-if="booking">
			<p><strong>Booking ID:</strong> {{ booking.id }}</p>
			<p><strong>Guest ID:</strong> {{ booking.guestID }}</p>
			<p><strong>Start Date:</strong> {{ booking.startDate }}</p>
			<p><strong>End Date:</strong> {{ booking.endDate }}</p>
			<!-- Add other fields as needed -->
		</div>
	</div>
</template>

<script>
export default {
	name: "CompletedBooking",
	props: {
		booking: {
			required: true,
			type: Object,
		},
	},
}
</script>

<style scoped lang="less">
@import "../../../assets/styles/styles";

.completed-booking-wrapper {
	background-color: @color-lavendar;
	border-radius: 7px;
	margin: 7px;
	padding: 20px;

	h2 {
		border-bottom: 1px solid @myblack;
		margin-bottom: 10px;
	}
	p {
		font-size: 18px;
		margin-top: 10px;
	}
}
</style>
