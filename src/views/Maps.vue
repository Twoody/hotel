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
				:imageURL="activity.thumbnail || 'assets/imgs/cat-with-hammer.png'"
				:isOnline="isOnline"
				:shown="activity.shown"
				@click="gotoItem(activity.id)"
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
			isOnline: this.$store.state.isOnline,
		}
	},

	computed:
	{
		allActivities ()
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
			/**
			 * Firestore url for cat w/ hammer:
			 *  https://firebasestorage.googleapis.com/v0/b/votel-f1c47.appspot.com/o/cat-with-hammer.png?alt=media&token=e717e395-6406-4a57-83ac-b8c838427d91
			 */
			let ret = []

			for (let index in this.allActivities)
			{
				let activity = this.allActivities[index]
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
		 * @param {integer} id - ID of the firestore related activity
		 * @returns {void}
		 * @since 2.3.0
		 */
		gotoItem (id)
		{
			this.$router.push({
				name: "mapItem",
				params: {
					id,
				},
			})
		},

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
