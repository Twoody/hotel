<template>
	<div class="filters-wrapper">
		<Filter
			v-for="(filter, index) in filters"
			:key="index"
			class="filter"
			:inactive="filter.active || true"
			type="button"
			@click="$emit('click', filter.id)"
		>
			{{ filter.title }}
		</Filter>
	</div>
</template>

<script>
import Filter from "components/buttons/filters/Filter"

export default {
	name: "Filters",
	components:
	{
		Filter,
	},
	props:
	{
		filters: {
			required: true,
			type: Object,
		},
	},
}
</script>

<style scoped lang="less">
@import "~styles/styles";
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
	width: auto;
	scroll-snap-type: x mandatory;
	scrollbar-width: none;  /* Firefox scrollbar */

	/* Hide scrollbar for Chrome, Safari and Opera */
	overflow-x: auto;
	&::-webkit-scrollbar {
		display: none;
	}
}
</style>

