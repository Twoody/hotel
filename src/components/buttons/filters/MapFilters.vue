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
			filtersAll: {},
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
			for (let id in this.filtersAll)
			{
				let filter = this.filtersAll[id]
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

			for (let id in this.filtersAll)
			{
				let filter = this.filtersAll[id]
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
		buildFilters () 
		{
			let ret = {}
			for (let id in this.filters)
			{
				ret[id] = {
					active: false,
					id: id,
					title: this.filters[id],
				}
			}
			return ret
		},

		handleClick (id) 
		{
			// Clear blue on next element in list
			document.activeElement?.blur && document.activeElement.blur()

			const ID = id * 1
			// Await the animation
			this.filtersAll[ID].active = !this.filtersAll[ID].active
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
	created () 
	{
		this.filtersAll = this.buildFilters()
	},
}
</script>

<style scoped lang="less">
@import "../../../../assets/styles/styles";

.map-filters-wrapper {
}
</style>

