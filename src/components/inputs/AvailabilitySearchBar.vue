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
				<div class='flex-box'>
					<span class='label'>
						Start Date
					</span>
					<DateSelector
						v-model="startDate"
						:max="maxDate"
						:min="today"
					/>
				</div>
				<div class='flex-box'>
					<span class='label'>
						End Date
					</span>
					<DateSelector
						v-model="endDate"
						:max="maxDate"
						:min="minDateEnd"
					/>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import {DateTime} from "luxon"
import DateSelector from "@/components/inputs/DateSelector"

export default {
	name: "AvailabilitySearchBar",
	components:
	{
		DateSelector,
	},
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

		.flex-box {
			background: @color-purple;
			border-radius: 7px;
			padding: 7px;
			align-content: center;
			align-items: center;
			display: flex;
			flex-direction: column;
			justify-content: center;
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
