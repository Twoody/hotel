<template>
	<div class="map-item-page-wrapper">
		<h1>Map Item: {{ title }}</h1>
		<p>
			Work in Progress... Check back later
		</p>
	</div>
</template>

<script>
import {LOCAL_ACTIVITIES} from "constants/localActivities.js"

export default {
	name: "MapItem",
	components: {},
	props: {},
	data: function()
	{
		return {
			activites: LOCAL_ACTIVITIES,
		}
	},

	computed:
	{
		activity () 
		{
			return this.activites[this.$route.params.id]
		},
		title () 
		{
			return this.activity.title
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

