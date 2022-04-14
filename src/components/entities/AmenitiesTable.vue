<template>
	<div class="amenities-table-wrapper">
		<AmenitiesSection
			v-for="key in keys"
			:key="key"
			:amenities="AMENITIES[key]"
		>
			<template #title>
				{{ formatTitle(key) }}
			</template>
		</AmenitiesSection>
	</div>
</template>

<script>
import {AMENITIES} from "src/constants.js"
import AmenitiesSection from "components/entities/AmenitiesSection"

export default {
	name: "AmenitiesTable",
	components:
	{
		AmenitiesSection,
	},
	data () 
	{
		return {
			AMENITIES: AMENITIES,
		}
	},
	computed:
	{
		/**
		 * @example
		 * // return ['LIVING_ROOM', 'KITCHEN']
		 * @returns {Array} Basically a list of room in a house which categorizes amenities
		 */
		keys ()
		{
			return Object.keys(AMENITIES)
		},
	},
	methods:
	{
		/**
		 * @param {string} key - A MACRO_CASE key for key-value data
		 * @returns {string} Formatted title string from a hashmap key
		 */
		formatTitle (key)
		{
			let title = key
			title = title.replace(/_/g, " ")
			return title
		},
	},
}
</script>

<style lang="less" scoped>
.amenities-table-wrapper {
	align-content: center;
	align-items: center;
	display: flex;
	flex-direction: column;
	width: 99%;
}
</style>
