Element for handling manual date (no calendar picker) input
<template>
	<div class="date-selector-wrapper">
		<MyDate
			class="date-input"
			:value="day"
			:focused="focusDay"
			:isLoading="isLoading"
			is-day
			@newValue="updateParent('day', $event)"
			@focus="focusDay = false"
		/>

		<MyDate
			class="date-input"
			:value="month"
			:focused="focusMonth"
			:isLoading="isLoading"
			is-month
			@newValue="updateParent('month', $event)"
			@focus="focusMonth = false"
		/>

		<MyDate
			class="date-input"
			:value="year"
			:focused="focusYear"
			:isLoading="isLoading"
			is-year
			@newValue="updateParent('year', $event)"
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
		isLoading: Boolean,

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

		value:
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
	{
		isSelectedValid ()
		{
			let d = DateTime.fromISO(
				`${this.year}-${this.month}-${this.day}`
			)
			if (! d.invalid)
			{
				return true
			}
			return false
		},

		selectedDate ()
		{
			let d = DateTime.fromISO(
				`${this.year}-${this.month}-${this.day}`
			)
			if (! d.invalid)
			{
				return d.toFormat("yyyy-MM-dd")
			}
			return ""
		},
	},

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

			if (this.isSelectedValid)
			{
				this.$emit("newDate", this.selectedDate)
			}
			else
			{
				this.$emit("newDate", "")
			}
		},
	},
	watch:
	{
		value (n, o)
		{
			let newDate = DateTime.fromISO(n)
			if (!n)
			{
				this.day = ''
				this.month = ''
				this.year = ''
			}
			if (! newDate.invalid)
			{
				this.day = newDate.toFormat("dd")
				this.month = newDate.toFormat("MM")
				this.year = newDate.toFormat("yyyy")
			}
		},
	},
}
</script>

<style scoped lang="less">
	.date-selector-wrapper {
		display: flex;
		align-content: center;
		align-items: center;
		flex-shrink: 0;
		flex-grow: 1;
		justify-content: space-evenly;
		width: 100%;

		.date-input {
		}
	}
</style>

