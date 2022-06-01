<template>
	<div class="amenities-wrapper">
		<h1>Amenities</h1>
		<AmenitiesTable />
	</div>
</template>

<script>
import AmenitiesTable from "components/entities/amenities/AmenitiesTable"

export default {
	name: "Amenities",
	components:
	{
		AmenitiesTable,
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
}
</style>
