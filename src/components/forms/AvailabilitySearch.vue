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
					active-view="month"
					class="vue-cal-container vuecal--rounded-theme vuecal--date-picker"
					:disable-views="['day', 'week']"
					hide-view-selector
					:min-date="minDate"
					:time="false"
					xsmall
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
@import "~styles/styles";

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
			// Todo: actually set a background color
			.vue-cal-container {
				backdrop-filter: sepia(0.4);
				border: none;
				border-radius: 5px;
				box-shadow: none;
				color: @myblack;
				height: 53vw;
				margin: 10px;
				margin-bottom: 15px;
				max-height: @size;
				max-width: 96%;
				width: 100%;

				.vuecal__header {
					.vuecal__title-bar{
						background: none;
						border-bottom: 1px solid gold;
					}
					.vuecal__title {
						button {
							color: @myblack;
							font-size: 15px;
							font-weight: 700;
						}
					}
				}

				.vuecal__cell::before {
					border: none;
				}
				.vuecal__cell-content {
					background: @color-pastel-blue;
					border-radius: 15px;
					margin-bottom: 11px;
					padding: 11px;

					.vuecal__cell-date {
						font-size:15px;
						font-weight: 700;
					}

				}
				.vuecal__cell--disabled {
					.vuecal__cell-content {
						background: lightgray;
					}
				}
				.vuecal__weekdays-headings {
					border-bottom: 2px solid gold;
					padding-bottom: 6px;

					.weekday-label{
						color: @myblack;
						font-size: 25px;
						font-weight: 700;
						padding: 2px;
					}
				}
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
