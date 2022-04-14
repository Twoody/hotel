<template>
	<div class="amenities-section">
		<h2>
			<slot name="title" />
		</h2>
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
				<FlexTable>
					<template #category>
						Year
					</template>
					<template #content>
						{{ amenitie.year }}
					</template>
				</FlexTable>
				<FlexTable>
					<template #category>
						Brand
					</template>
					<template #content>
						{{ amenitie.brand }}
					</template>
				</FlexTable>
				<FlexTable>
					<template #category>
						Model
					</template>
					<template #content>
						{{ amenitie.model }}
					</template>
				</FlexTable>
			</template>
		</Accordion>
	</div>
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
				A.title.localeCompare(B.title)
			})
		},
	},
	methods:
	{},
}
</script>

<style lang="less" scoped>
.amenities-section {
	border: 1px solid black;
	border-radius: 7px;
	margin-left: 11px;
	margin-right: 11px;
	margin-bottom: 11px;
	max-width: 500px;
	width: 100%;

	h2 {
		border-bottom: 1px solid black;
		margin-bottom: 0px;
		margin-top: 0px;
		padding: 7px;
		text-transform: uppercase;
	}
	p {
		text-align: left;
		width: 100%;
	}
}
</style>
