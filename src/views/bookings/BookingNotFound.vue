<template>
	<div class="booking-not-found-wrapper">
		<h2>Booking Not Found</h2>
		<p>
			The requested booking could not be located. 
			It might have been removed or never existed.
		</p>
	</div>
</template>

<script>
export default {
	name: "BookingNotFound",
}
</script>

<style scoped lang="less">
@import "../../../assets/styles/styles";

.booking-not-found-wrapper {
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
