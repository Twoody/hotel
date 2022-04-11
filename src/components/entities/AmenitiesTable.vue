<template>
	<div class='amenities-table-wrapper'>
		<div class="amenities-section">
			<!-- TODO: Componentize -->
			<h2>Kitchen</h2>
			<!-- TODO: Pull items from a database -->
			<Accordion>
				<template #title>
					Blender
				</template>
				<template #content>
					<FlexTable>
						<template #category>
							Year
						</template>
						<template #content>
							2021
						</template>
					</FlexTable>
					<FlexTable>
						<template #category>
							Brand
						</template>
						<template #content>
							Vitamix
						</template>
					</FlexTable>
					<FlexTable>
						<template #category>
							Model
						</template>
						<template #content>
							Explorian E310
						</template>
					</FlexTable>

				</template>
			</Accordion>
		</div>
	</div>
</template>

<script>
import {AMENITIES} from "src/constants.js"
import Accordion from "components/common/Accordion"
import FlexTable from "components/common/FlexTable"

export default {
	name: "AmenitiesTable",
	components:
	{
		Accordion,
		FlexTable,
	},
	computed:
	{
		/**
		 * @returns {Array} The different amenities located and associated with the kitchen
		 */
		kitchen () 
		{
			return AMENITIES.KITCHEN
		},
	},
}
</script>

<style lang="less" scoped>
	.amenities-section {
		max-width: 500px;
		width: 100%;

		p {
			text-align: left;
			width: 100%;
		}
	}

</style>
