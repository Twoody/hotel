<template>
	<div class="map-filters-wrapper">
		<Filters
			:filters="filtersInactive"
			inactive
			@click="handleClick($event)"
		/>
		<Filters
			:filters="filtersActive"
			inactive
			@click="handleClick($event)"
		/>
	</div>
</template>

<script>
import {FILTERS} from "constants/misc.js"
import Filters from "components/buttons/filters/Filters"

export default {
	name: "MapFilters",
	components:
	{
		Filters,
	},

	data: function()
	{
		return {
			/** Store a local copy to manage state */
			filters: FILTERS,
		}
	},

	computed:
	{
		/**
		 * @todo Store active filters in localstorage with a "last visited time"
		 * @returns {Array} List of the filters the user has activated since page loaded
		 */
		filtersActive () 
		{
			let active = []
			for (let id in this.filters)
			{
				let filter = this.filters[id]
				filter.id = id * 1
				if (filter.active) 
				{
					active.push(filter)
				}
			}
			return active.sort( (a, b) => this.sortFilter(a, b))
		},

		/**
		 * @returns {Array} List of the filters the user has not activated
		 */
		filtersInactive () 
		{
			let inactive = []

			for (let id in this.filters)
			{
				let filter = this.filters[id]
				filter.id = id * 1
				if (! filter.active) 
				{
					inactive.push(filter)
				}
			}
			return inactive.sort( (a, b) => this.sortFilter(a, b))
		},
	},
	methods: 
	{
		async handleClick (id) 
		{
			const ID = id * 1
			// Await the animation
			await new Promise((resolve) => setTimeout(resolve, 200))
			this.filters[ID].active = !this.filters[ID].active
			this.$emit("updated-active", this.filtersActive)
		},

		/**
		 * @param {object} a - A filter
		 * @param {object} b - A filter
		 * @returns {boolean} Should `a` come after `b` alphabetically?
		 */
		sortFilter (a, b) 
		{
			let at = a.title.toUpperCase()
			let bt = b.title.toUpperCase()
			return (at < bt) ? -1 : (at > bt) ? 1 : 0
		},
	},
}
</script>

<style scoped lang="less">
@import "~styles/styles";

.map-filters-wrapper {
}
</style>

