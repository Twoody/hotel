<script setup>
import { defineEmits } from "vue"
const emit = defineEmits([
	"update",
])
const update = (id) => 
{
	emit("update", id)
}
</script>

<template>
	<div class="filters-wrapper">
		<MyFilter
			v-for="(filter) in filters"
			:key="filter.id"
			:inactive="! filter.active"
			type="button"
			@mouseup="update(filter.id)"
			@touchend="update(filter.id)"
		>
			{{ formatTitle(filter) }}
		</MyFilter>
	</div>
</template>

<script>
import MyFilter from "components/buttons/filters/MyFilter"

export default {
	name: "Filters",
	components:
	{
		MyFilter,
	},
	props:
	{
		/** An array of filters to be applied to some selection */
		filters: {
			required: true,
			type: Array,
		},
	},
	methods:
	{
		/**
		 * @param {object} filter - A self made filter object
		 * @returns {string} A formatted title
		 */
		formatTitle (filter) 
		{
			return filter.title
		},
	},
}
</script>

<style scoped lang="less">
@import "../../../../assets/styles/styles";
.filters-wrapper {
	-ms-overflow-style: none;  /* IE and Edge scrollbar */
	align-content: center;
	align-items: center;
	justify-content: flex-start;
	display: flex;
	flex-direction: row;
	flex-grow: 1;
	flex-shrink: 0;
	margin-left: 20px;
	margin-right: 20px;
	scroll-snap-type: x mandatory;
	scrollbar-width: none;  /* Firefox scrollbar */

	/* Hide scrollbar for Chrome, Safari and Opera */
	overflow-x: auto;
	&::-webkit-scrollbar {
		display: none;
	}
}
</style>
