A filterable list of things to do
<template>
	<div class="guides-page-wrapper">
		<h1 class="main-title">
			Guides
		</h1>
		<GuideFilters
			@updated-active="updateFilters($event)"
		/>
		<div class="guides-content">
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
import { GUIDES } from "constants/misc.js"
import { LOCAL_ACTIVITIES } from "constants/localActivities.js"
import GuideFilters from "components/buttons/filters/GuideFilters"

export default {
	name: "Guides",
	components: {
		GuideFilters,
	},

	data: function()
	{
		return {
			GUIDES: GUIDES,
			activeFilters: [],
			activities: LOCAL_ACTIVITIES,
			isOnline: this.$store.state.isOnline,
		}
	},

	computed: {
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
			all.sort((a, b) => (a.title > b.title ? 1 : -1))
			return all
		},

		/**
		 * @returns {object[]} - List of cards to be shown after filters are applied; Defaults to all activities.
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
	methods: {
		/**
		 * Redirects the user to the detail page of the selected activity.
		 *
		 * @param {number} id - ID of the Firestore-related activity.
		 * @returns {void}
		 * @since 2.3.0
		 */
		gotoItem (id)
		{
			this.$router.push({
				name: "GuideItem",
				params: {
					id,
				},
			})
		},

		/**
		 * Updates the active filters for the guide
		 *
		 * @param {object[]} newFilters - New filters to replace the old ones.
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

.guides-page-wrapper {
	height: auto;
	padding: 10px;
	width: 100%;

	.guides-content {
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
