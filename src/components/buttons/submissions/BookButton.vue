Button to book a stay
<template>
	<div
		class="search-execute"
		@click="$emit('click')"
	>
		<transition
			name="fade"
			mode="out-in"
		>
			<span
				v-if="isLoading"
				class="execute-text execute-loading"
				key="loading"
			>
				Loading
			</span>
			<span
				v-else
				class="execute-text execute-clickable"
				key="booking"
			>
				Book
			</span>
		</transition>
	</div>
</template>

<script>
export default {
	name: "BookButton",
	props:
	{
		/**
		 Whether we are in loading state or not
		 */
		isLoading:
		{
			default: false,
			required: false,
			type: Boolean,
		},
	},
}
</script>

<style lang="less" scoped>
.search-execute {
	background-color: black;
	border-radius: 10px;
	color: yellow;
	display: flex;
	height: 50px;
	margin-top: 5px;
	padding: 3px;
	text-align: center;
	vertical-align: middle;
	width: 60%;

	.execute-text {
		margin: auto;
	}
}

.fade-enter-active, .fade-leave-active {
	transition: opacity .2s;
}
.fade-enter, .fade-leave-to {
	opacity: 0;
}

</style>
