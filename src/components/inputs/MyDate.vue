<template>
	<input
		autocomplete="new-password"
		class="search-query"
		:placeholder="placeholder"
		:maxlength='maxlength'
		type="tel"
		:value="fieldValue"
		@input="$emit('newValue', $event.target.value)"
	>
</template>

<script>
import {DateTime} from "luxon"

export default {
	name: "MyDate",
	data: function()
	{
		return {}
	},
	props:
	{
		date:
		{
			required: true,
			type: String,
		},

		isDay: Boolean,
		isMonth: Boolean,
		isYear: Boolean,
	},
	computed:
	{
		dateField ()
		{
			switch (this.placeholder)
			{
				case "dd":
					return "day"

				case "mm":
					return "month"

				case "yyyy":
					return "year"

				default:
					return ""
			}
		},

		/** @returns {number} Get the day/month/year from provided date */
		fieldValue ()
		{
			return DateTime.fromISO(this.date)[this.dateField] || ""
		},

		placeholder ()
		{
			if (this.isDay)
			{
				return "dd"
			}
			if (this.isMonth)
			{
				return "mm"
			}
			if (this.isYear)
			{
				return "yyyy"
			}
			return ""
		},

		maxlength()
		{
			if (this.placeholder === 'yyyy')
			{
				return 4
			}
			return 2
		},
	},
	methods:
	{},
}

</script>

<style lang="less" scoped>
@import "~styles/styles";

.search-query {
	border-radius: 10px;
	font-family: monospace;
	font-size: clamp(15px, 3vw, 25px);
	height: 50px;
	text-align: center;
	width: 100%;

	&:not(.loading) {
		border: 3px solid @color-lavendar;
	}
	&.loading {
		background: @color-purple;
		color: rgba(254,232,185,255);
		padding-top: 11px;
	}
}

</style>
