A detailed description of something to do in the area
<template>
	<div class="guide-item-page-wrapper">
		<div v-if="hasContent">
			<h1>Guide Item: {{ title }}</h1>
			<div class="contact-toolbar">
				<MyButton class="button-phone">
					<a
						class="linked"
						:href="phone"
					>
						<!-- TODO svg -->
						<span>Phone</span>
					</a>
				</MyButton>
				<MyButton class="button-directions">
					<a
						class="linked"
						:href="address"
					>
						<!-- TODO svg -->
						<span>Guides</span>
					</a>
				</MyButton>
				<MyButton class="button-email">
					<a
						class="linked"
						:href="email"
					>
						<!-- TODO svg -->
						<span>Email</span>
					</a>
				</MyButton>
			</div>
			<div class="description">
				<p>
					Work in Progress... Check back later
				</p>
			</div>
		</div>
		<div v-else>
			<h1>Guide Item Not Found</h1>
			<p>
				Oops, looks like the url is off
			</p>
		</div>
	</div>
</template>

<script>
import { LOCAL_ACTIVITIES } from "constants/localActivities.js"

export default {
	name: "GuideItem",
	props: {},
	data: function()
	{
		return {
			activities: LOCAL_ACTIVITIES,
		}
	},

	computed: {
		/**
		 * Retrieves the activity data for the given ID from the route parameters.
		 *
		 * @returns {object} The activity data object or an empty object if not found.
		 */
		activity ()
		{
			return this.activities[this.$route.params.id] || {}
		},

		/**
		 * Retrieves the address for the activity.
		 *
		 * @returns {string} The address of the activity, or an empty string if not available.
		 */
		address ()
		{
			return this.activity.address || ""
		},

		/**
		 * Retrieves the email address for the activity.
		 *
		 * @returns {string} The email address of the activity, or an empty string if not available.
		 */
		email ()
		{
			return this.activity.email || ""
		},

		/**
		 * Checks whether the activity has content (e.g., a title).
		 *
		 * @returns {boolean} True if the activity has a title; false otherwise.
		 */
		hasContent ()
		{
			return !!this.activity.title
		},

		/**
		 * Retrieves the external link for the activity.
		 *
		 * @returns {string} The external link (href) of the activity, or an empty string if not available.
		 */
		href ()
		{
			return this.activity.href || ""
		},

		/**
		 * Retrieves the phone number for the activity.
		 *
		 * @returns {string} The phone number of the activity, or an empty string if not available.
		 */
		phone ()
		{
			return this.activity.phone || ""
		},

		/**
		 * Retrieves the title of the activity.
		 *
		 * @returns {string} The title of the activity, or an empty string if not available.
		 */
		title ()
		{
			return this.activity.title || ""
		},
	},
	methods: {},
}
</script>

<style scoped lang="less">
@import "../../assets/styles/styles";

.guide-item-page-wrapper {
	background-color: @color-purple !important;
	border-radius: 7px;
	height: auto;
	margin-top: 7px;
	width: 100%;
	max-width: min(98%, 660px);

	h1 {
		border-bottom: 1px solid @myblack;
	}

	p {
		font-size: 25px;
	}

	.contact-toolbar {
		align-items: center;
		display: flex;
		justify-content: center;
		flex-grow: 0;
		width: auto;

		.my-button-wrapper {
			margin-left: 10px;
			margin-right: 10px;
			max-width: 200px;
			min-width: 100px;
			width: auto;
		}
	}
}
</style>

