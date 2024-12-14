A page for users to better customize their experiences
and for users to see data regarding their account.
<template>
	<div class="setting-page-wrapper">
		<h1>Settings</h1>
		<div class="foo">
			<p>
				Work in Progress... Check back later
			</p>
		</div>
	</div>
</template>

<script>

export default {
	name: "Settings",
	props: {},
	data: function()
	{
		return {
		}
	},

	computed:
	{
	},
	methods: 
	{},
}
</script>

<style scoped lang="less">
@import "../../assets/styles/styles";

.setting-page-wrapper {
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
}
</style>

