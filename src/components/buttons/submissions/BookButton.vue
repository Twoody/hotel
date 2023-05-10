Button to book a stay
<template>
	<MyButton
		class="search-execute"
		:disabled="disabled"
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
				{{ bookingText }}
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
		/** Whether the button is disabled or not */
		disabled: Boolean,

		/** Whether we are in loading state or not */
		isLoading: Boolean,

		/** The total price of the booked stay */
		totalPrice: {
			default: "",
			required: false,
			type: String,
		},
	},
	computed: {
		bookingText ()
		{
			if (!this.totalPrice) 
			{
				return "Book"
			}
			return `Book - $${this.totalPrice}`
		},
	},
}
</script>

<style lang="less" scoped>
@import "../../../../assets/styles/styles";

.search-execute {
	background-color: @color-pastel-blue !important;
	height: 50px;
	margin-bottom: 11px;
	margin-top: 5px;
	max-width: min(98%, 660px);
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
