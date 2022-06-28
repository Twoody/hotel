Element for handling manual date (no calendar picker) input
<template>
	<div class="date-selector-wrapper">
		<MyDate
			class="date-input"
			:date="date"
			:focused="focusDay"
			is-day
			@newValue="updateParent('day', arguments[0])"
			@focus="focusDay = false"
		/>

		<MyDate
			class="date-input"
			:date="date"
			:focused="focusMonth"
			is-month
			@newValue="updateParent('month', arguments[0])"
			@focus="focusMonth = false"
		/>

		<MyDate
			class="date-input"
			:date="date"
			:focused="focusYear"
			is-year
			@newValue="updateParent('year', arguments[0])"
			@focus="focusYear = false"
		/>
	</div>
</template>

<script>
import {DateTime} from "luxon"
import MyDate from "@/components/inputs/MyDate.vue"

export default
{
	name: "DateSelector",
	components:
	{
		MyDate,
	},
	props:
	{
		date: {
			default: "",
			required: false,
			type: String,
		},
		maxDate:
		{
			default: "",
			required: false,
			type: String,
		},

		minDate:
		{
			default: "",
			required: false,
			type: String,
		},
	},
	data () 
	{
		return {
			day: "",
			month: "",
			year: "",

			focusDay: false,
			focusMonth: false,
			focusYear: false,
		}
	},

	computed:
	{},

	methods:
	{
		/**
		 * Passes the combined date back to the parent
		 *
		 * @param name
		 * @param value
		 */
		updateParent (name, value)
		{
			this[name] = value

			let date = {
				"day": parseInt(this.day),
				"month": parseInt(this.month),
				"year": parseInt(this.year),
			}

			if (value.length === 2)
			{
				if (name === "day")
				{
					this.focusMonth = true
				}
				else if (name === "month")
				{
					this.focusYear = true
				}
			}

			let newDate = DateTime.local(date.year, date.month, date.day)

			if ( newDate.isValid && date.year > 1000
			)
			{
				this.$emit("input", newDate.toFormat("yyyy-MM-dd"))
			}
			else
			{
				this.$emit("input", null)
			}
		},
	},
}
</script>

<style scoped lang="less">
	.date-selector-wrapper {
		text-align: left;
		width: 100%;
		display: flex;

		.date-input {
			margin-left: 8px;
			flex-grow: 1;
		}

		.date-input:first-child {
			margin-left: 0;
		}
	}
</style>

