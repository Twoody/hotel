A filterable list of things to do
<template>
	<div class="maps-page-wrapper">
		<h1 class="main-title">
			Maps
		</h1>
		<MapFilters
			@updated-active="updateFilters($event)"
		/>
		<div class="maps-content">
			<MapCard
				v-for="(activity, index) in shownActivies"
				:key="index"
				:activity="activity"
				:shown="activity.shown"
			/>
		</div>
	</div>
</template>

<script>
import {MAPS} from "constants/misc.js"
import {LOCAL_ACTIVITIES} from "constants/localActivities.js"
import MapFilters from "components/buttons/filters/MapFilters"

export default {
	name: "Maps",
	components:
	{
		MapFilters,
	},

	data: function()
	{
		return {
			MAPS: MAPS,
			activeFilters: [],
			activities: LOCAL_ACTIVITIES,
		}
	},

	computed:
	{
		allActivies ()
		{
			let all = []
			let keys = Object.keys(this.activities)
			for (let i = 0; i < keys.length; i += 1)
			{
				let activity = this.activities[keys[i]]
				activity.shown = true
				all.push(activity)
			}

			// Sort alphabetically
			all.sort((a, b) => (a.title > b.title) ? 1 : -1)
			return all
		},

		/**
		 * @returns {object} - List of cards to be shown after filters applied; Defaults to all
		 */
		shownActivies () 
		{
			let ret = []

			for (let index in this.allActivies)
			{
				let activity = this.allActivies[index]
				let filters = activity.tags

				// Reset local value
				activity.shown = true
				if (this.activeFilters && !filters.length)
				{
					activity.shown = false
				}
				else if (this.activeFilters.length && filters.length)
				{
					for (let j = 0; j < this.activeFilters.length; j += 1)
					{
						if (!filters.includes(this.activeFilters[j].id))
						{
							activity.shown = false
							break
						}
					}
				}
				else if (!this.activeFilters.length)
				{
				// If no filters are selected, show everything
					activity.shown = true
				}
				ret.push(activity)
			}

			return ret 
		},
	},
	methods: 
	{
		/**
		 * @param {object} newFilters - new filters to replace the old
		 * @returns {void}
		 */
		updateFilters (newFilters) 
		{
			this.activeFilters = newFilters
		},
	},
}
</script>

<style scoped lang="less">
@import "../../assets/styles/styles";

.maps-page-wrapper {
	height: auto;
	padding: 10px;
	width: 100%;

	.maps-content {
		align-content: center;
		align-items: center;
		justify-content: center;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		transition: all 0.2s ease;
	}
}
</style>
