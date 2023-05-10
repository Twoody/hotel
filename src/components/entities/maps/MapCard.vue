<template>
	<div
		class="map-card-wrapper"
		:class="{'hidden': !shown, 'shown': shown}"
	>
		<div class="top-section">
			<div class="row">
				<div class="map-card-title">
					{{ formattedTitle }}
				</div>
				<div class="favorites-star">
					<font-awesome-icon
						:icon="['fa', 'star']"
						inverse
					/>
				</div>
			</div>
			<div class="map-card-subtitle">
				{{ formattedSubtitle }}
			</div>
		</div>
		<div class="map-card-map">
			<img
				height="140"
				:src="url"
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
</template>

<script>

export default {
	name: "MapCard",
	data: function() 
	{
		return {}
	},
	props:
	{
		/** Title, subtitle, addy, phone, etc. object */
		activity: {
			required: true,
			type: Object,
		},

		/** Is the card shown or not */
		shown: Boolean,
	},
	computed:
	{
		formattedSubtitle ()
		{
			return this.activity.subtitle || "-"
		},

		formattedTitle ()
		{
			return this.activity.title || "-"
		},

		url ()
		{
			if (this.$store.state.isOnline)
			{
				return "https://firebasestorage.googleapis.com/v0/b/votel-f1c47.appspot.com/o/cat-with-hammer.png?alt=media&token=e717e395-6406-4a57-83ac-b8c838427d91"
			}
			return "assets/imgs/cat-with-hammer.png"
		},
	},
	methods: {
		/**
		 * @param {string} id - Poorly names object s.t. id is string and not int
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
	},
}
</script>

<style scoped lang="less">
@import "../../../../assets/styles/styles";

@wmax: 288px;
@wtotal: clamp(140px, 25vw, @wmax);
@star: 35px;
@title: calc(@wtotal - @star); 

.map-card-wrapper:active {
}

.map-card-wrapper {
	background: @color-primary-triadic-3;
	border: 1px solid @color-purple;
	border-radius: 7px;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	min-height: clamp(200px, 33vw, 299px);
	justify-content: space-around;
	margin: 10px;
	max-width: @wmax;
	min-width: 140px;
	opacity: 1;
	overflow: hidden;
	transition: all 0.2s linear;
	width: auto;

	.top-section {
		display: flex;
		flex-direction: column;
		padding-top: 5px;
		max-width: 99%;

		.row {
			align-content: center;
			align-items: center;
			display: flex;
			flex-grow: 1;
			flex-wrap: nowrap;
			font-size: clamp(15px, 1.3vw, 22px);
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
				padding-right: calc(1vw / 6);
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
			font-size: clamp(12px, 1.3vw, 17px);
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
			max-width: 160px;
			width: auto;
			height: auto;
		}
	}
	.map-card-button {
		align-self: center;
		border: 1px solid @myblack;
		border-radius: 7px;
		font-size: clamp(15px, 1.3vw, 20px);
		margin-bottom: 7px;
		margin-top: 7px;
		padding: 5px;
		transition: all 0.2s linear;
		width: 86%;
	}
	.map-card-button:active {
		transform: scale(1.07);
	}

	&.hidden {
		border: none;
		margin: 0;
		max-width: 0;
		min-width: 0;
		opacity: 0;
	}
}

@media (hover: hover) {
	.map-card-wrapper:hover {
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
