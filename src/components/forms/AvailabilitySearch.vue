TODO: Error handling
TODO: PRobably plugin inputs... :eye_roll:
<template>
	<div class="availability-search-wrapper">
		<div class="content-section">
			<form
				class="search-box"
				:class="{'is-loading': isLoading}"
			>
				<AvailabilitySearchBar
					class="inputs-container"
					:isLoading="isLoading"
				/>
				<VueCal
					class="vue-cal-container"
					hide-view-selector
					active-view="month"
					:time="false"
					:min-date="minDate"
				/>
				<BookButton
					:isLoading="isLoading"
					@click="handleAvailabilitySearch"
				/>
			</form>
		</div>
	</div>
</template>

<script>
import AvailabilitySearchBar from "@/components/inputs/AvailabilitySearchBar"
import BookButton from "@/components/buttons/submissions/BookButton.vue"
import VueCal from "vue-cal"
import "vue-cal/dist/vuecal.css"

export default {
	name: "AvailabilitySearch",
	components:
	{
		AvailabilitySearchBar,
		BookButton,
		VueCal,
	},
	data: function()
	{
		return {
			hasError: false,
			isLoading: false,
			searchQuery: "",
		}
	},
	props:
	{},
	computed: 
	{
		minDate () 
		{
			return new Date().addDays(1)
		},
	},
	methods:
	{
		/**
		 * @todo docblock
		 * @todo acutally send this request to firebase 
		 */
		async handleAvailabilitySearch ()
		{
			this.hasError = false
			this.isLoading = true
			try
			{
				// sleep for .5 seconds for faux https mgmt
				await new Promise((r) => setTimeout(r, 5000))
			}
			catch (error)
			{
				this.hasError = true
			}
			this.isLoading = false
		},
	},
}
</script>

<style lang="less">

@size: min(55vw, 55vh);

.availability-search-wrapper {
	align-items: center;
	align-content: center;
	display: flex;
	flex-shrink: 0;
	justify-content: center;
	padding-bottom: 15px;
	height: auto;
	width: 100%;

	.content-section {
		display: relative;
		height: 100%;;
		overflow: hidden;
		width: 100%;;

		.search-box {
			align-items: center;
			display: flex;
			flex-direction: column;
			height: 100%;
			margin-top: 20px;
			text-align: center;
			width: 100%;

			.inputs-container {
				padding-bottom: 15px;
			}
			.vue-cal-container {
				height: 53vw;
				margin: 10px;
				margin-bottom: 15px;
				max-height: @size;
				max-width: @size;
				width: 53vw;

			}
		}
	}
}
.vuecal__cell--disabled {text-decoration: line-through !important;}
.vuecal__cell--before-min {color: #b6d6c7;}
.vuecal__cell--after-max {color: #008b8b;}
</style>

<docs>
</docs>
