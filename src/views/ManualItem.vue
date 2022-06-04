A detailed description of something to do in the area
<template>
	<div class="map-item-page-wrapper">
		<h1>Manual Item: {{ title }}</h1>
		<p>
			Work in Progress... Check back later
		</p>
	</div>
</template>

<script>

export default {
	name: "ManualItem",
	components: {},
	props: {},
	data: function()
	{
		return {}
	},

	computed:
	{
		/**
		 * @todo start putting and fetching from the store...
		 * @returns {void} wip
		 */
		title () 
		{
			return "WIP"
		},
	},
	methods: 
	{},
}
</script>

<style scoped lang="less">
@import "~styles/styles";

.map-item-page-wrapper {
	height: auto;
	padding: 10px;
	width: 100%;

	p {
		font-size: 25px;
	}
}
</style>

