<template>
	<input
		autocomplete='new-password'
		class='themed-input'
		:placeholder='placeholder'
		type='tel'
		:value="fieldValue"
		@focus="$emit('focus', $event.target)"
		@input="$emit('newValue', $event.target.value)"
	/>
</template>

<script>
export default {
	name: "MyDate",
	data: function()
	{
		return {
		}
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
		dateField()
		{
			switch(this.placeholder)
			{
				case 'DD':
					return 'day'

				case 'MM':
					return 'month'

				case 'YYYY':
					return 'year'

				default:
					return ''
			}
		},

		/** @returns {Number} Get the day/month/year from provided date */
		fieldValue()
		{
			return DateTime.fromISO(this.date)[this.dateField] || ''
		},

		placeholder()
		{
			if (this.isDay)
			{
				return 'DD'
			}
			if (this.isMonth)
			{
				return 'MM'
			}
			if (this.isYear)
			{
				return 'YYYY'
			}
			return ''
		},

	},
	methods:
	{
	},
}

</script>
