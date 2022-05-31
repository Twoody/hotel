<template>
	<div class="maps-page-wrapper">
		<h1>Maps</h1>
		<div class="filters inactive">
			<button
				v-for="(filter, index) in filtersInactive"
				:key="index"
				class="filter inactive"
				type="button"
				@click="filters[filter.id].active = true"
			>
				{{ filter.title }}
			</button>
		</div>
		<div class="filters active">
			<button
				v-for="(filter, index) in filtersActive"
				:key="index"
				class="filter active"
				type="button"
				@click="filters[filter.id].active = false"
			>
				{{ filter.title }}
			</button>
		</div>
		<div class="maps-content">
			<!-- TODO: Probably need some kind of DS for this... -->
			<div
				v-for="(activity, index) in LOCAL_ACTIVITIES"
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
						This is a lovely foo bar baz in the best of PDX
					</div>
				</div>
				<div class="map-card-map">
					<!-- stuff -->
				</div>
				<button class="map-card-button">
					View Details
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import {FILTERS} from "constants/misc.js"
import {MAPS} from "constants/misc.js"
import {LOCAL_ACTIVITIES} from "constants/localActivities.js"

export default {
	name: "Maps",
	components:
	{},

	props: {},
	data: function()
	{
		return {
			LOCAL_ACTIVITIES: LOCAL_ACTIVITIES,
			MAPS: MAPS,
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
				filter.id = id
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
				filter.id = id
				if (! filter.active) 
				{
					inactive.push(filter)
				}
			}
			return inactive.sort( (a, b) => this.sortFilter(a, b))
		},

		/**
		 * @todo Figure out data structure for showing all of the different maps
		 * @returns {object} Some form of data structure with the goods we need
		 */
		mapCards () 
		{
			return {}
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
.maps-page-wrapper {
	height: auto;
	padding: 10px;
	width: 100%;

	.filters {
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

		.filter {
			background: @color-pastel-blue;
			border: 1px solid #01016E;
			border-radius: 9px;
			color: #01016E;
			flex-grow: 0;
			flex-shrink: 0;
			font-family: monospace;
			margin: 5px;
			padding: 3px;
			padding-left: 7px;
			padding-right: 7px;
			min-width: 69px;

			&.active {
				filter: brightness(110%);
			}
			&.inactive {
				filter: brightness(90%);
			}
		}
	}
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
			border: 1px solid #dea5ce;
			border-radius: 7px;
			display: flex;
			flex-direction: column;
			flex-wrap: wrap;
			height: clamp(140px, auto, 255px);
			margin: 10px;
			max-width: 240px;
			min-width: 140px;
			overflow: hidden;
			transition: all 0.2s linear;
			width: clamp(140px, 33vw, 255px);

			.top-section {
				display: flex;
				flex-direction: column;
				padding-top: 10px;

				.row {
					align-content: center;
					align-items: center;
					display: flex;
					gap: 0.1rem;
					flex-grow: 1;
					flex-wrap: nowrap;
					font-size: max(2.1vw, 20px);
					justify-content: space-between;
					white-space: nowrap;

					.map-card-title {
						text-align: left;
						flex-grow: 1;
						overflow: hidden;
						padding-left: 5px;
						width: 100px;
					}
					.favorites-star {
						flex-grow: 0;
						flex-shrink: 1;
						padding-right: 5px;
						transition: all 0.2s linear;
					}
					.favorites-star:active {
						stroke: gold;
						stroke-width: 50px;
						transform: scale(1.27);
					}
				}
				.map-card-subtitle {
					flex-wrap: wrap;
					white-space: wrap;
					padding-bottom: 5px;
					padding-left: 10px;
					padding-right: 10px;
					font-size: max(1.7vw, 13px);
					text-align: left;
				}
			}
			.map-card-map {
				background-image: linear-gradient(to right, red , yellow);
				border-bottom: 1px solid red;
				border-top: 1px solid red;
				cursor: pointer;
				min-height: 100px;
			}
			.map-card-button {
				border: 1px solid black;
				border-radius: 7px;
				font-size: max(2.0vw, 17px);
				margin: 10px;
				padding: 5px;
				transition: all 0.2s linear;
				flex-shrink: 1;
				flex-grow: 0;
				width: auto;
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
			inset 0 -3em 3em rgba(0, 0, 0, 0.1),
			0 0  0 2px rgb(222, 165, 206),
			0.3em 0.3em 1em rgba(2, 1, 2, 0.3);
	}
  .map-card-button:hover{
		cursor: pointer;
		transform: scale(1.07);
  }
	.favorites-star:hover {
		cursor: pointer;
		stroke: gold;
		stroke-width: 50px;
		transform: scale(1.27);
	}
}
</style>

