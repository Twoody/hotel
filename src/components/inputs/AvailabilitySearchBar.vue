<template>
	<div class="availability-search-bar-wrapper">
		<transition
			name="fade"
			mode="out-in"
		>
			<div
				v-if="isLoading"
				class="date-container"
				key="loading"
			>
				<div class="search-query loading">
					Loading...
				</div>
			</div>
			<div
				v-else
				class="date-container"
			>
				<input
					v-model="startDate"
					class="search-query"
					:max="maxDate"
					:min="today"
					placeholder="mm/dd/yyyy"
					type="date"
				>
				<input
					v-model="endDate"
					class="search-query"
					:max="maxDate"
					:min="minDateEnd"
					placeholder="mm/dd/yyyy"
					type="date"
				>
			</div>
		</transition>
	</div>
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
	computed:
	{
		maxDate () 
		{
			return "2023-11-11"
		},

		minDateEnd () 
		{
			return this.today
		},

		today ()
		{
			return "2022-06-25"
		},
	},
}
</script>

<style lang="less" scoped>
@import "~styles/styles";

.availability-search-bar-wrapper {
	max-width: 666px;
	width: 80%;

	.date-container {
		align-content: center;
		display: flex;
		gap: 10px;
		justify-content: center;
		margin-bottom: 10px;
		width: 100%;

		.search-query {
			border-radius: 10px;
			font-size: clamp(15px, 3vw, 25px);
			height: 50px;
			padding-right: 5px;
			text-align: center;
			width: 100%;

			&:not(.loading) {
				border: 3px solid rgba(254,232,185,255);
			}
			&.loading {
				background: @color-purple;
				color: rgba(254,232,185,255);
				padding-top: 11px;
			}
		}
	}

	.fade-enter-active, .fade-leave-active {
		transition: opacity .2s;
	}
	.fade-enter, .fade-leave-to {
		opacity: 0;
	}
}
</style>
