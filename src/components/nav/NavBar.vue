The general navbar for our project
<template>
	<div id="nav-wrapper">
		<router-link to="/">
			Home
		</router-link> |
		<router-link to="/about">
			About
		</router-link>
	</div>
</template>

<script>
export default {
	name: "NavBar",
}
</script>

<style lang='less'>
#nav-wrapper {
	@v-padding: 30px;
	padding-bottom: @v-padding;
	padding-top: @v-padding;
	position: relative;
	width: 100%;
}
a {
	font-weight: bold;
	color: #2c3e50;
}
a.router-link-exact-active {
	color: #42b983;
}

</style>

