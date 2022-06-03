<template>
	<div class="maps-page-wrapper">
		<h1>Maps</h1>
		<MapFilters
			@updated-active="updateFilters($event)"
		/>
		<div class="maps-content">
			<!-- TODO: Probably need some kind of DS for this... -->
			<div
				v-for="(activity, index) in shownActivies"
				:key="index"
				class="map-card"
			>
				<div class="top-section">
					<div class="row">
						<div class="map-card-title">
							{{ formatTitle(activity) }}
						</div>
						<div class="favorites-star">
							<font-awesome-icon
								:icon="['fa', 'star']"
								inverse
							/>
						</div>
					</div>
					<div class="map-card-subtitle">
						{{ activity.subtitle || '-' }}
					</div>
				</div>
				<div class="map-card-map">
					<img
						height="140"
						src="http://i.stack.imgur.com/aEEkn.png"
						width="140"
					>
				</div>
				<button
					class="map-card-button"
					@click="gotoItem(activity.id)"
				>
					View Details
				</button>
			</div>
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

	props: {},
	data: function()
	{
		return {
			MAPS: MAPS,
			activeFilters: [],
			activites: LOCAL_ACTIVITIES,
		}
	},

	computed:
	{
		/**
		 * @todo Figure out data structure for showing all of the different maps
		 * @returns {object} Some form of data structure with the goods we need
		 */
		mapCards () 
		{
			return {}
		},

		shownActivies () 
		{
			let shown = {}
			let index = 0
			let keys = Object.keys(this.activites)

			if (this.activeFilters.length)
			{
				for (let i = 0; i < keys.length; i += 1)
				{
					let activity = this.activites[keys[i]]
					let filters = activity.tags
					let isShowing = true
					if (this.activeFilters && !filters.length)
					{
						isShowing = false
					}
					else if (this.activeFilters.length && filters.length)
					{
						for (let j = 0; j < this.activeFilters.length; j += 1)
						{
							console.log(this.activeFilters[j])
							if (!filters.includes(this.activeFilters[j].id))
							{
								isShowing = false
								break
							}
						}
					}
					if (isShowing)
					{
						shown[index] = activity
						index += 1
					}
				}
				return shown
			}
			else
			{
				// If no filters are selected, show everything
				return this.activites
			}
		},
	},
	methods: 
	{
		/**
		 * @param {object} activity - Object of all the info
		 * @returns {string} - A title if exists, else dash
		 */
		formatTitle (activity) 
		{
			let ret = activity.title || "-"
			return ret
		},

		/**
		 * @param {string} id - Poorly names object s.t. id is string and not int
		 */
		gotoItem (id) 
		{
			this.$router.push({
				path: `maps/${id}`, 
			})
		},

		updateFilters (newFilters) 
		{
			this.activeFilters = newFilters
		},
	},
}
</script>

<style scoped lang="less">
@import "~styles/styles";

@wtotal: clamp(140px, 25vw, 240px);
@star: 35px;
@title: calc(@wtotal - @star); 

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

		.map-card:active {
		}

		.map-card {
			background: @color-primary-triadic-3;
			border: 1px solid @color-purple;
			border-radius: 7px;
			display: flex;
			flex-direction: column;
			flex-wrap: wrap;
			min-height: clamp(200px, 33vw, 299px);
			justify-content: space-around;
			margin: 10px;
			max-width: 240px;
			min-width: 140px;
			overflow: hidden;
			transition: all 0.2s linear;
			width: clamp(140px, 33vw, 288px);

			.top-section {
				display: flex;
				flex-direction: column;
				padding-top: 5px;

				.row {
					align-content: center;
					align-items: center;
					display: flex;
					flex-grow: 1;
					flex-wrap: nowrap;
					font-size: max(2.1vw, 15px);
					justify-content: space-between;

					.map-card-title {
						font-weight: 600;
						overflow: hidden;
						padding-left: 3px;
						text-align: left;
						white-space: nowrap;
						width: @title;
					}
					.favorites-star {
						flex-basis: @star;
						padding-right: 9px;
						transition: all 0.2s linear;
						width: @star;
					}
					.favorites-star:active {
						stroke: gold;
						stroke-width: 50px;
						transform: scale(1.27);
					}
				}
				.map-card-subtitle {
					font-style: italic;
					font-size: max(1.3vw, 12px);
					font-weight: 400;
					overflow: hidden;
					padding-bottom: 5px;
					padding-left: 3px;
					text-align: left;
					white-space: nowrap;
					width: @wtotal;
				}
			}
			.map-card-map {
				align-content: center;
				align-items: center;
				background: @color-purple;
				border-bottom: 1px solid @myblack;
				border-top: 1px solid @myblack;
				cursor: pointer;
				display: flex;
				justify-content: center;
				min-height: 100px;

				img {
					display: block;
					max-height: 200px;
					max-width: 170px;
					width: auto;
					height: auto;
				}
			}
			.map-card-button {
				border: 1px solid @myblack;
				border-radius: 7px;
				font-size: max(2.0vw, 17px);
				margin: 10px;
				max-width: 220px;
				min-width: 140px;
				padding: 5px;
				transition: all 0.2s linear;
				width: clamp(140px, 30vw, 220px);
			}
			.map-card-button:active {
				transform: scale(1.07);
			}
		}

	}
}

@media (hover: hover) {
	.map-card:hover {
		box-shadow:
			inset 0 -3vw 3vw rgba(0, 0, 0, 0.1),
			0 0  0 3px @color-purple,
			0.3em 0.3em 1em rgba(2, 1, 2, 0.3);
	}
  .map-card-button:hover{
		cursor: pointer;
		transform: scale(1.07);
  }
	.favorites-star:hover {
		cursor: pointer;
		stroke: gold;
		stroke-width: 70px;
		transform: scale(1.57);
	}
}
</style>

