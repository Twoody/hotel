<template>
	<div class="my-date-wrapper">
		<input
			v-model="localValue"
			v-if="!isLoading"
			autocomplete="new-password"
			class="search-query"
			:placeholder="placeholder"
			:maxlength="maxlength"
			ref="myDate"
			type="tel"
			@input="updateParent()"
			@keypress="isNumber($event)"
		>
		<LoadingBar
			v-else
			class="search-query loading"
			size="small"
		/>
	</div>
</template>

<script>
import LoadingBar from "@/components/common/loading/LoadingBar"

export default {
	name: "MyDate",
	components:
	{
		LoadingBar,
	},
	data: function()
	{
		return {
			localValue: "",
		}
	},
	props:
	{
		focused: Boolean,
		isDay: Boolean,
		isLoading: Boolean,
		isMonth: Boolean,
		isYear: Boolean,
		value:
		{
			default: "",
			required: false,
			type: String,
		},
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

		/** */
		isValid ()
		{
			if (!this.localValue)
			{
				return false
			}

			if (this.isDay)
			{
				if (this.localValue === 0 || this.localValue > 31)
				{
					return false
				}
				return true
			}
			if (this.isMonth)
			{
				if (this.localValue === 0 || this.localValue > 12)
				{
					return false
				}
				return true
			}
			if (this.isYear)
			{
				if (this.localValue === 0 || this.localValue > 2023)
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
	{
		isNumber (evt)
		{
			evt = (evt) ? evt : window.event
			var charCode = (evt.which) ? evt.which : evt.keyCode

			if ((charCode > 31 && (charCode < 48 || charCode > 57)) &&
				charCode !== 46)
			{
				evt.preventDefault()
			}
			else
			{
				return true
			}
		},

		/** */
		updateParent ()
		{
			this.$emit(
				"newValue",
				this.isValid ? this.localValue : ""
			)
		},
	},
	watch:
	{
		/**
		 * @param n
		 */
		focused (n)
		{
			if (n)
			{
				this.$refs.myDate.focus()
				this.$emit("focus", true)
			}
		},

		value (n)
		{
			this.localValue = n
		},
	},
}

</script>

<style lang="less" scoped>
@import "../../../assets/styles/styles";

.my-date-wrapper {
	margin: 0;
	padding: 0;

	.search-query {
		border-radius: 10px;
		font-family: monospace;
		font-size: clamp(15px, 3vw, 25px);
		padding: 6px;
		padding-left: 2px;
		padding-right: 2px;
		text-align: center;
		transition: all 0.2s;
		width: 82%;

		&:not(.loading) {
			border: 3px solid @color-lavendar;
		}
		&.loading {
			padding: 15px;
			width: min(55px, 7vw);
		}
	}
}

@media (hover: hover) {
	.search-query {
		&:not(.loading):hover  {
			box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5);
			border: 3px solid @color-pastel-blue;;
			cursor: pointer;
			filter: brightness(102%);
			transform: scale(1.07);
		}

	}
	&.loading:hover  {
	}
}

.my-date-wrapper {
	.search-query:focus-visible {
		outline: 4px solid @color-purple !important;
	}
}
</style>
