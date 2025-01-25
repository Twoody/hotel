<template>
	<div class="finalize-booking-wrapper">
		<h2>Finalize Your Booking</h2>
		<p>
			Please complete any outstanding steps to confirm your booking.
		</p>

		<!-- Example of fields or next actions -->
		<div v-if="booking">
			<p><strong>Booking ID:</strong> {{ booking.id }}</p>
			<p><strong>Guest ID:</strong> {{ booking.guestID }}</p>
			<!-- Perhaps show a form or "Pay Now" button here -->
			
			<button
				class="pay-button"
				@click="onPayNow"
			>
				Pay Now
			</button>
		</div>
	</div>
</template>

<script>
export default {
	name: "FinalizeBooking",
	props: {
		booking: {
			required: true,
			type: Object,
		},
	},
	methods: {
		onPayNow () 
		{
			// TODO: Implement payment flow, or navigate to a payment page
			console.log("User clicked Pay Now for booking:", this.booking.id)
		},
	},
}
</script>

<style scoped lang="less">
@import "../../../assets/styles/styles";

.finalize-booking-wrapper {
	background-color: @color-lavendar;
	border-radius: 7px;
	margin: 7px;
	padding: 20px;

	.pay-button {
		background: @color-purple;
		border: none;
		border-radius: 4px;
		color: white;
		cursor: pointer;
		margin-top: 10px;
		padding: 10px 20px;

		&:hover {
			background: darken(@color-purple, 5%);
		}
	}

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
