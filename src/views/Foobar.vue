A testing page for showing the general layout
<template>
	<div class="page-wrapper">
		<h1>Testing Page</h1>
		<hr >
		<h3>Vuex: Layout</h3>
		<div class="section-content">
			<div
				class="button"
				@click="$store.commit('setIsShowingBanner', true)"
			>
				Show the top banner
			</div>
			<div
				class="button"
				@click="$store.commit('setIsShowingFooter', true)"
			>
				Show the footer
			</div>
		</div>
		<div class="section-content">
			<div class="section-header">
				Spinner
			</div>
			<div class="section-content">
				<Spinner />
			</div>
		</div>
	</div>
</template>

<script>
import Spinner from "@/components/common/loading/Spinner"

export default {
	name: "Foobar",
	components: 
	{
		Spinner,
	},
	props: {},
	data: function()
	{
		return {
			email: "",
			password: "",
		}
	},
	computed:
	{},
	methods: 
	{},
}
</script>

<style scoped lang="less">
@import "../../assets/styles/styles";

.page-wrapper {
	display: relative;
	height: 100%;
	padding: 10px;
	width: 100%;
	
	.section-content {
		display: flex;
		border-bottom: 2px solid @myblack;
		flex-direction: column;
		height: auto;
		width: 100%;
		.button {
			background-color: green;
			border-radius: 10px;
			flex: 1;
			color: white;
			margin: auto;
			margin-bottom: 3px;
			padding-bottom: 3px;
			padding-top: 3px;
			positions: relative;
			width: 70%;
		}
	}
}
</style>

