Button to book a stay
<template>
	<MyButton
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
	</MyButton>
</template>

<script>
import MyButton from "@/components/buttons/MyButton.vue"

export default {
	name: "BookButton",
	components: 
	{
		MyButton,
	},
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
@import "~styles/styles";

.search-execute {
	background-color: @color-pastel-blue !important;
	filter: sepia(0.5) !important;
	height: 50px;
	margin-bottom: 11px;
	margin-top: 5px;
	max-width: 50vw;
	padding: 3px;

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
