<template>
	<div class="unauthorized-booking-wrapper">
		<h2>Access Denied</h2>
		<p>
			This booking does not belong to you, 
			or you do not have permission to view it.
		</p>
	</div>
</template>

<script>
export default {
	name: "UnauthorizedBooking",
}
</script>

<style scoped lang="less">
@import "../../../assets/styles/styles";

.unauthorized-booking-wrapper {
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
