<template>
	<div class="amenities-section">
		<h2>
			<slot name="title" />
		</h2>
		<Accordion
			v-for="amenitie in amenities"
			:key="amenitie.id"
		>
			<template #title>
				{{ amenitie.title }}
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
}
</script>

<style lang="less" scoped>
	.amenities-section {
		max-width: 500px;
		width: 100%;

		h2 {
			text-transform: uppercase;
		}
		p {
			text-align: left;
			width: 100%;
		}
	}

<
