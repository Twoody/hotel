<template>
	<input
		autocomplete="new-password"
		class="search-query"
		:placeholder="placeholder"
		:maxlength="maxlength"
		ref="myDate"
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

		focused: Boolean,
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

		/** */
		isValid ()
		{
			if (!this.fieldValue)
			{
				return false
			}

			if (this.isDay)
			{
				if (this.fieldValue === 0 || this.fieldValue > 31)
				{
					return false
				}
				return true
			}
			if (this.isMonth)
			{
				if (this.fieldValue === 0 || this.fieldValue > 12)
				{
					return false
				}
				return true
			}
			if (this.isYear)
			{
				if (this.fieldValue === 0 || this.fieldValue > 2023)
				{
					return false
				}
				return true
			}
			return false
		},

		maxlength ()
		{
			if (this.placeholder === "yyyy")
			{
				return 4
			}
			return 2
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
	},
	methods:
	{},
	watch:
	{
		focused (n, o)
		{
			if (n)
			{
				this.$refs.myDate.focus()
			}
		},
	},
}

</script>

<style lang="less" scoped>
@import "~styles/styles";

.search-query {
	border-radius: 10px;
	font-family: monospace;
	font-size: clamp(15px, 3vw, 25px);
	padding: 8px;
	text-align: center;
	transition: all 0.2s;
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

@media (hover: hover) {
	.search-query {
		&:not(.disabled):hover  {
			box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5);
			border: 3px solid @color-pastel-blue;;
			cursor: pointer;
			filter: brightness(102%);
			transform: scale(1.07);
		}

	}
	&.disabled:hover  {
		box-shadow: -1px 1px 1px 0px rgba(0, 0, 0, 0.5);
		filter: brightness(79%);
	}
}

.search-query:focus-visible {
	outline: 4px solid @color-purple !important;
}
</style>
