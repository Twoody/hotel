<template>
	<button
		class="filter-wrapper"
		type="button"
		@click="$emit(&quot;click&quot;)"
	>
		<slot/>
	</button>
</template>

<script>

export default {
	name: "Filter",
	props: {
		/** Is current filter being applied */
		inactive: Boolean,
	},
}
</script>

<style scoped lang="less">
@import "~styles/styles";
.filter-wrapper {
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

	:not(.inactive) {
		filter: brightness(110%);
	}
	&.inactive {
		filter: brightness(90%);
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

