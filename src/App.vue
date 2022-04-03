<template>
	<div id="app">
		<!-- TODO: Tie into vue comps -->
		<AppSection
			:isShowing="$store.state.layout.isShowingBanner"
			@click="$store.commit('setIsShowingBanner', false)"
		>
			<div id="top-banner" />
		</AppSection>

		<!-- Handle appSection click for navbar on chevron and ations instead.. -->
		<AppSection
			class="nav-section"
			:isCollapsed="true"
			is-showing
		>
			<NavBar id="nav-wrapper" />
		</AppSection>

		<AppSection
			centered
			class="main-section"
			is-showing
		>
			<router-view id="content-wrapper" />
		</AppSection>
		<AppSection
			:isShowing="$store.state.layout.isShowingFooter"
			@click="$store.commit('setIsShowingFooter', false)"
		>
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
	data: function()
	{
		return {
			isNavCollapsed: true,
		}
	},
	computed:
	{},
	created: function()
	{
		// console.log(this.$store.state.layout.isShowingBanner)
	},
}
</script>

<style lang='less'>
@import "~styles/styles";

html, body {
	height: 100%;
	margin: 0;
	padding: 0;
	width: 100%;
}

#app {
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	background-color: @color-primary-triadic-1;
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
	background-color: @color-primary-triadic-3;
	bottom: 0;
	height: 50px;
	width: 100%;
}
#content-wrapper {
	background-color: @color-primary-triadic-1;
	overflow: scroll;
}

.main-section {
	flex: 1;
	max-height: 4000px !important;
}
.nav-section {
	min-height: 70px;
}

#nav-wrapper {
	background-color: @color-primary-triadic-2;
}

#top-banner {
	background-color: @color-primary-triadic-3;
	height: 50px;
	padding: 0;
	margin: 0;
	width: 100%;
}
</style>
