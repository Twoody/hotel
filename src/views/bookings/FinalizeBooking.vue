<template>
	<div class="finalize-booking-wrapper">
		<section class="cta-instructions">
			<h2>Finalize Your Booking</h2>
			<p>
				Please complete any outstanding steps to confirm your booking.
			</p>
		</section>

		<div v-if="booking">
			<section class="database-details">
				<h3>Nerdy stuff</h3>
				<p><strong>Booking ID:</strong> {{ booking.id }}</p>
				<p><strong>Guest ID:</strong> {{ booking.guestID }}</p>
			</section>
			<section class="finalize-booking">
				<!-- TODO: show a form with relevant information to finalize the booking -->
				<!-- E.g. total guests, special requests, cats/dogs, babies, toddlers, kids, etc. -->
				<!-- Ensure styles match form and input found in AccountSettings -->
				<!-- Ensure required inputs and errors using `Validatble` -->
				<!-- Ensure data is stored locally to autofill in case of navigating away from page -->
				
				<!-- TODO: Hook this up to stripe once stripe is setup... -->
				<button
					class="pay-button"
					@click="onPayNow"
				>
					Pay Now
				</button>
			</section>
		</div>
		<!-- This should never happen and should be taken care of by 404 page -->
		<div v-else>
			Unable to proceed due to no booking provided by user.
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
			// TODO: Implement payment flow, preferably a payment page
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

	section {
		border-bottom: 1px solid black;
	}

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
		margin-bottom: 10px;
	}
	p {
		font-size: 18px;
		margin-top: 10px;
	}
}
</style>
