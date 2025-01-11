<template>
	<div class="booking-not-logged-in-wrapper">
		<h2>You are not logged in.</h2>
		<p>
			Please 
			<router-link to="/login">
				log in
			</router-link>
			to view or manage your booking.
		</p>
	</div>
</template>

<script>
export default {
	name: "BookingNotLoggedIn",
}
</script>

<style scoped lang="less">
@import "../../../assets/styles/styles";

.booking-not-logged-in-wrapper {
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
