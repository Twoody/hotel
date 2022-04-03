<template>
	<div class="amenities-wrapper">
		<h1>Amenities</h1>
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
							Ventura 800	
						</template>
					</FlexTable>

				</template>
			</Accordion>
		</div>
	</div>
</template>

<script>
import Accordion from "components/common/Accordion"
import FlexTable from "components/common/FlexTable"

export default {
	name: "Amenities",
	components:
	{
		Accordion,
		FlexTable,
	},
	created: function()
	{
	},
}
</script>

<style lang="less" scoped>
/* TODO: Make max-width scroll window scroll into margins */
.amenities-wrapper {
	align-content: center;
	align-items: center;
	display: flex;
	flex-direction: column;
	padding-bottom: 50px;
	margin-left: 20px;
	margin-right: 20px;
	width: 100%;

	h1 {
		width: 100%;
	}
	.amenities-section {
		max-width: 500px;
		width: 100%;

		p {
			text-align: left;
			width: 100%;
		}
	}
}
</style>
