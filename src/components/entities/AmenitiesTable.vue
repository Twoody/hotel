<template>
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
