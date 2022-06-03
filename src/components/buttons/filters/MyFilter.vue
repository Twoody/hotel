<template>
	<button
		class="filter-wrapper"
		:class="{'active': !inactive, 'inactive': inactive}"
		type="button"
		@click="$emit('click')"
	>
		<slot/>
	</button>
</template>

<script>

export default {
	name: "MyFilter",
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
	border: 1px solid @myblack;
	border-radius: 9px;
	color: @myblack;
	flex-grow: 0;
	flex-shrink: 0;
	font-family: monospace;
	margin: 5px;
	padding: 3px;
	padding-left: 7px;
	padding-right: 7px;
	min-width: 69px;
	transition: all 0.2s linear;

	&.active {
		filter: brightness(110%);
	}
	&.inactive {
		filter: brightness(90%);
	}
}

@media (hover: hover) {
	.filter-wrapper:hover {
		box-shadow: 0 10px 6px -6px #777;
		border: 1px solid @color-pastel-blue;;
		cursor: pointer;
		filter: brightness(102%);
		transform: scale(1.07);
	}
}
</style>
