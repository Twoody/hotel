<template>
	<div id="app">
		<AppSection dissapears>
			<div id="top-banner" />
		</AppSection>

		<AppSection styles="min-height: 20px">
			<NavBar id="nav-wrapper" />
		</AppSection>

		<AppSection
			styles="flex: 1;"
			ignore-click
		>
			<router-view id="content-wrapper" />
		</AppSection>
		<AppSection dissapears>
			<div id="bottom-banner" />
		</AppSection>
	</div>
</template>

<script>
import AppSection from "components/common/AppSection"
import NavBar from "components/nav/NavBar"

export default {
	name: "App",
	components:
	{
		AppSection,
		NavBar,
	},
}
</script>

<style>

html, body {
	height: 100%;
	margin: 0;
	padding: 0;
	width: 100%;
}

#app {
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	background-color: blue;
	color: #2c3e50;
	display: flex;
	flex-direction: column;
	font-family: Avenir, Helvetica, Arial, sans-serif;
	height: 100%;
	max-height: 100%;
	min-height: 100%;
	text-align: center;
	width: 100%;

}
#bottom-banner {
	background-color: red;
	bottom: 0;
	height: 50px;
	width: 100%;
}
#content-wrapper {
	background-color: yellow;
	flex-grow: 1;
	overflow: scroll;
}

#nav-wrapper {
	background-color: green;
}

#top-banner {
	background-color: red;
	height: 50px;
	padding: 0;
	margin: 0;
	width: 100%;
}
</style>
