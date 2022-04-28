<template>
	<div class="maps-page-wrapper">
		<h1>Maps</h1>
		<div class="maps-content">
			<!-- TODO: Probably need some kind of DS for this... -->
			<div
				v-for="(map, index) in MAPS"
				:key="index"
				class="map-card"
			>
				<div class="top-section">
					<div class="row">
						<div class="map-card-title">
							Foo bar
						</div>
						<div class="favorites-star">
							*
						</div>
					</div>
					<div class="row">
						<div class="map-card-subtitle">
							This is a lovely foo bar baz in the best of PDX
						</div>
					</div>
				</div>
				<div class="map-card-map">
					<!-- stuff -->
				</div>
				<div class="map-card-button">
					View Details
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {MAPS} from "constants/misc.js"
// import firebase from "firebase"
import store from "@/store/store.js"

export default {
	name: "Maps",
	components:
	{},

	props: {},
	data: function()
	{
		return {
			MAPS: MAPS,
		}
	},

	computed:
	{
		/**
		 * @returns {boolean} - Whether a user is logged in or not
		 * @since 0.1.0
		 */
		isLoggedIn ()
		{
			return store.state.user.isLoggedIn
		},

		/**
		 * @todo Setup a spinner in template when user is logging in
		 * @returns {boolean} - Whether a user is logging in or not
		 * @since 0.1.0
		 */
		isLoggingIn ()
		{
			return store.state.user.isLoggingIn
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
	{},
}
</script>

<style scoped lang="less">
.maps-page-wrapper {
	height: 100%;
	padding: 10px;
	width: 100%;

	.maps-content {
		align-content: center;
		align-items: center;
		justify-content: center;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;

		.map-card {
			border: 1px solid red;
			border-radius: 7px;
			display: flex;
			flex-direction: column;
			flex-wrap: wrap;
			margin: 10px;
			max-width: 22vw;
			min-width: 130px;

			.top-section {
				display: flex;
				flex-direction: column;
				flex-wrap: no-wrap;
				padding-top: 10px;

				.row {
					align-content: center;
					align-items: center;
					display: flex;
					gap: 1rem;
					flex-grow: 1;
					flex-wrap: nowrap;
					font-size: 4.1vw;
					justify-content: space-between;
						overflow: hidden;

					.map-card-title {
						flex-grow: 1;
						padding-left: 10px;
						overflow: hidden;
					}
					.favorites-star {
						flex-grow: 0;
						flex-shrink: 1;
						padding-right: 10px;
					}
				}
				.map-card-subtitle {
					padding-bottom: 5px;
					padding-left: 10px;
					padding-right: 10px;
					text-align: left;
					font-size: 1.9vw;
				}
			}
			.map-card-map {
				background-image: linear-gradient(to right, red , yellow);
				border-bottom: 1px solid red;
				border-top: 1px solid red;
				height: 100px;
			}
			.map-card-button {
				border: 1px solid black;
				border-radius: 7px;
				font-size: 2.9vw;
				margin: 10px;
				padding: 5px;
				transition: all 0.2s linear;
			}
			.map-card-button:active {
				transform: scale(1.1);
			}
		}

	}
}

@media (hover: hover) {
  .map-card-button:hover{
		cursor: pointer;
		transform: scale(1.1);
  }
}
</style>

