A detailed description of something to do in the area
<template>
	<div class="map-item-page-wrapper">
		<div v-if="hasContent">
			<h1>Map Item: {{ title }}</h1>
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
						<span>Maps</span>
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
			<h1>Map Item Not Found</h1>
			<p>
				Oops, looks like the url is off
			</p>
		</div>
	</div>
</template>

<script>
import {LOCAL_ACTIVITIES} from "constants/localActivities.js"

export default {
	name: "MapItem",
	props: {},
	data: function()
	{
		return {
			activites: LOCAL_ACTIVITIES,
		}
	},

	computed:
	{
		activity () 
		{
			return this.activites[this.$route.params.id] || {}
		},

		/** */
		address ()
		{
			return this.activity.address || ""
		},

		/** */
		email ()
		{
			return this.activity.email || ""
		},

		/** @returns {boolean} Whether the activity was found and content is available */
		hasContent ()
		{
			return this.activity.title
		},

		/** */
		href ()
		{
			return this.activity.href || ""
		},

		/** */
		phone ()
		{
			return this.activity.phone || ""
		},

		title () 
		{
			return this.activity.title
		},
	},
	methods: 
	{},
}
</script>

<style scoped lang="less">
@import "../../assets/styles/styles";

.map-item-page-wrapper {
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

