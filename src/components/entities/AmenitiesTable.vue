<template>
	<div class="amenities-table-wrapper">
		<AmenitiesSection
			v-for="key in keys"
			:key="key"
			:amenities="AMENITIES[key]"
		>
			<template #title>
				{{ key }}
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

		/** @returns {Array} The different amenities located and associated with the kitchen */
		kitchen () 
		{
			return AMENITIES.KITCHEN
		},
	},
}
</script>

<style lang="less" scoped>
.amenities-table-wrapper {
	width: 100%;
}
</style>
