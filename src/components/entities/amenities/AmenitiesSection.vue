<template>
	<Accordion
		class="amenities-section"
		has-nested
	>
		<template #title>
			<h2>
				<slot name="title" />
			</h2>
		</template>
		<template #content>
			<Accordion
				v-for="amenitie in sortedAmenities"
				:key="amenitie.id"
			>
				<template #title>
					<div class="shown-title">
						{{ amenitie.title }}
					</div>
				</template>
				<template #content>
					<!-- Show these ones first -->
					<FlexTable v-if="amenitie.year">
						<template #category>
							Year
						</template>
						<template #content>
							{{ amenitie.year }}
						</template>
					</FlexTable>
					<FlexTable v-if="amenitie.brand">
						<template #category>
							Brand
						</template>
						<template #content>
							{{ amenitie.brand }}
						</template>
					</FlexTable>
					<FlexTable v-if="amenitie.model">
						<template #category>
							Model
						</template>
						<template #content>
							{{ amenitie.model }}
						</template>
					</FlexTable>

					<!-- All of the other details if other details exist -->
					<FlexTable
						v-for="(detail, index) in getDetails(amenitie)"
						:key="index"
					>
						<template #category>
							{{ formatTitle(detail) }}
						</template>
						<template #content>
							{{ amenitie[detail] || '-' }}
						</template>
					</FlexTable>
				</template>
			</Accordion>
		</template>
	</Accordion>
</template>

<script>
import Accordion from "components/common/Accordion"
import FlexTable from "components/common/FlexTable"

export default {
	name: "AmenitiesSection",
	components:
	{
		Accordion,
		FlexTable,
	},
	props:
	{
		/** Different kind of amenities; E.g. washer, dryer, tea kettle */
		amenities: {
			default: () => [],
			required: true,
			type: Array,
		},
	},
	computed:
	{
		/**
		 * @example
		 * // returns [{title: 'Axe body spray'}, {title: 'Baby Wipes'} }]
		 * @returns {Array} Sorted by amenitie title
		 */
		sortedAmenities ()
		{
			let sortThis = this.amenities || []
			return sortThis.sort( (a, b) => 
			{
				const A = a.title || ""
				const B = b.title || ""
				A.localeCompare(B)
			})
		},
	},
	methods:
	{
		/**
		 * @param {string} detail - Json key associated with 
		 * @returns {string} Properly formatted title
		 */
		formatTitle (detail) 
		{
			// Replace underscores and make all lowercase
			let title = detail.replace(/_/g, " ").toLowerCase()

			// Capitalize the first letter
			title = title.charAt(0).toUpperCase() + title.slice(1)
			return title
		},

		/**
		 * @param {object} amenitieObj - Amenitie object via json data
		 * @returns {Array} List of the custom amenities for said object
		 */
		getDetails (amenitieObj) 
		{
			// These are handled elsewhere 
			const EXCLUDED = [
				"id",
				"title",
				"year",
				"model",
				"brand",
			]
			return Object.keys(amenitieObj).filter((detail) => 
			{
				return ! EXCLUDED.includes(detail.toLowerCase())
			})
		},
	},
}
</script>

<style lang="less" scoped>
@import "../../../../assets/styles/styles";

.amenities-section {
	border: 1px solid @myblack;
	border-radius: 7px;
	max-width: 500px;
	width: 96%;

	h2 {
		font-size: 25px;
		margin-bottom: 0px;
		margin-top: 0px;
	}
}
</style>
