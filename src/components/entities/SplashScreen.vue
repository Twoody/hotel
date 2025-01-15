<template>
	<div class="splash-screen">
		<h2>Loading...</h2>
		<Spinner size="x-large" />
	</div>
</template>

<script>
export default {
	name: "SplashScreen",
}
</script>

<style scoped lang="less">
.splash-screen {
	align-items: center;
	color: #000;
	display: flex;
	flex-direction: column;
	font-size: 2em;
	height: 100vh;
	justify-content: center;
	width: 100%;
}
</style>

