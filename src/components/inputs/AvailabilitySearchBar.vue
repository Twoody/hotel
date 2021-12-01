<template>
	<transition
		name="fade"
		mode="out-in"
	>
		<div
			v-if="isLoading"
			class="search-query loading"
			key="loading"
		>
			loading...
		</div>
		<div
			v-else
			class="date-container"
		>
			<input
				v-model="startDate"
				class="search-query"
				type="date"
			>
			<input
				v-model="endDate"
				class="search-query"
				type="date"
			>
		</div>
	</transition>
</template>

<script>
export default {
	name: "AvailabilitySearchBar",
	data: function()
	{
		return {
			// TODO: Sync to parent/update parent...
			endDate: "",
			startDate: "",
		}
	},
	props:
	{
		/** Whether we are in loading state or not */
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
.date-container {
	align-content: center;
	display: flex;
	gap: 10px;
	justify-content: center;
	margin-bottom: 10px;

	.search-query {
		border-radius: 10px;
		/*TODO: get a better color palette*/
		border: 1px solid gold;
		height: 50px;
		text-align: center;
		width: 40%;
		&.loading {
			width: 80%;
		}
	}
}

.fade-enter-active, .fade-leave-active {
	transition: opacity .2s;
}
.fade-enter, .fade-leave-to {
	opacity: 0;
}
</style>
