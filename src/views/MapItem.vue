A detailed description of something to do in the area
<template>
	<div class="map-item-page-wrapper">
		<div v-if='hasContent'>
			<h1>Map Item: {{ title }}</h1>
			<p>
				Work in Progress... Check back later
			</p>
		</div>
		<div v-else>
			<h1>Map Item Not Found</h1>
			<p>
				Oops, looks like the url is off
			</p>
		</div>
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

		/** @returns {boolean} Whether the activity was found and content is available */
		hasContent ()
		{
			return this.activity.title
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
@import "../../assets/styles/styles";

.map-item-page-wrapper {
	height: auto;
	padding: 10px;
	width: 100%;

	p {
		font-size: 25px;
	}
}
</style>

