A detailed description of something to do in the area
<template>
	<div class="map-item-page-wrapper">
		<h1>Manual Item: {{ title }}</h1>
		<p
			v-if="subtitle.length"
			class="subtitle"
		>
			{{ subtitle }}
		</p>
		<p
			v-if="description.length"
			class="description"
		>
			{{ description }}
		</p>
	</div>
</template>

<script>
import {MANUAL} from "constants/manual.js"

export default {
	name: "ManualItem",
	components: {},
	props: {},
	data: function()
	{
		return {
			manual: MANUAL,
		}
	},

	computed:
	{
		/** @returns {string} Description IFF exists; Else an empty string */
		description ()
		{
			return this.entry.description || ""
		},

		/**
		 * @todo start putting and fetching from the store...
		 * @returns {object} Looked up item based off of subdirectory path :id
		 */
		entry ()
		{
			return this.manual[this.$route.params.id]
		},

		/** @returns {string} Subtitle IFF exists; Else an empty string */
		subtitle () 
		{
			return this.entry.subtitle || ""
		},

		/**
		 * @returns {string} Title IFF exists; Else a dash
		 */
		title () 
		{
			return this.entry.title || "-"
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

