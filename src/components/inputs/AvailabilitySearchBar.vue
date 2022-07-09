<template>
	<div class="availability-search-bar-wrapper">
		<transition
			name="fade"
			mode="out-in"
		>
			<div class="date-container">
				<div class="flex-box">
					<span class="label">
						Start Date
					</span>
					<DateSelector
						v-model="startDate"
						:isLoading="isLoading"
						:max="maxDate"
						:min="today"
					/>
				</div>
				<div class="flex-box">
					<span class="label">
						End Date
					</span>
					<DateSelector
						v-model="endDate"
						:isLoading="isLoading"
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
		end:
		{
			default: '',
			required: false,
			type: String,
		},

		/** Whether we are in loading state or not */
		isLoading: Boolean,

		start:
		{
			default: '',
			required: false,
			type: String,
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
	watch:
	{
		end(n, o)
		{
			console.log(`caught: ${n}`)
			this.endDate = n
		},

		start(n, o)
		{
			console.log(`caught: ${n}`)
			this.startDate = n
		},
	},
}
</script>

<style lang="less" scoped>
@import "../../../assets/styles/styles";

.availability-search-bar-wrapper {
	width: 100%;

	.date-container {
		align-content: center;
		display: flex;
		gap: 10px;
		justify-content: center;
		width: 100%;

		.flex-box {
			background: @color-focus;
			border: 1px solid @color-purple;
			border-radius: 5px;
			padding: 7px;
			align-content: center;
			align-items: center;
			display: flex;
			flex-direction: column;
			justify-content: center;
			width: 100%;

			.label {
				font-weight: 700;
				margin-bottom: 2px;
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
