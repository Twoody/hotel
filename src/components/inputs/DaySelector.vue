Element for handling manual date (no calendar picker) input
<template>
	<div class="date-selector-wrapper">
		<MyDate
			ref="newMonth"
			:date="date"
			is-day
			@focus="$emit('focus', arguments[0])"
			@newValue="updateParent('newMonth', arguments[0])"
		/>

		<MyDate
			ref="newDay"
			:date="date"
			is-month
			@focus="$emit('focus', arguments[0])"
			@newValue="updateParent('newDay', arguments[0])"
		/>

		<MyDate
			ref="newYear"
			:date="date"
			is-year
			@focus="$emit('focus', arguments[0])"
			@newValue="updateParent('newYear', arguments[0])"
		/>
	</div>
</template>

<script>
import {DateTime} from "luxon"

export default
{
	name: "DateSelector",
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
			newDay: "",
			newMonth: "",
			newYear: "",
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
		updateParent: function(name, value)
		{
			this[name] = value

			let date = {
				"day": parseInt(this.day),
				"month": parseInt(this.month),
				"year": parseInt(this.year),
			}

			if (value.length === 2)
			{
				switch (name)
				{
					case "newMonth":
						return this.$refs.newDay.focus()
					case "newDay":
						return this.$refs.newYear.focus()
				}
			}

			let newDate = DateTime.local(date.year, date.month, date.day)

			if (
				newDate.isValid &&
				date.year > 1000
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
	@import "~shared/styles/variables";

	.apply-theme(@palette)
	{
		color: .palette(@palette)[@foreground];
	}

	.date-selector-wrapper {
		.font-regular();
		text-align: left;
		width: 100%;
		display: flex;

		div {
			margin-left: 18px;
			margin-bottom: 10px;
			flex-grow: 1;

			.themed-input {
				margin-bottom: 10px;
				width: 100%;
			}
		}

		div:first-child {
			margin-left: auto;
		}
	}

	@import '~styles/apply-themes';
</style>

