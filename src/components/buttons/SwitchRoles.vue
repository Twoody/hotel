<template>
	<div class="switch-roles-wrapper">
		<MyButton
			pill
			@click="switchView()"
		>
			{{buttonText}}
		</MyButton>
	</div>
</template>

<script>

export default {
	name: "SwitchRoles",
	components: {},

	data: function()
	{
		return {}
	},
	computed:
	{
		buttonText ()
		{
			console.log(window.location.pathname)
			const isAdminPath = window.location.pathname.startsWith("/a")
			const pushTo = isAdminPath ? "User" : "Admin"
			return `Switch to ${pushTo}`
		},
	},
	methods: 
	{
		switchView () 
		{
			// Determine if showing admin or public views and components
			const isAdminPath = window.location.pathname.startsWith("/a")
			const pushTo = isAdminPath ? "/" : "/a/"
			this.$router.push({
				path: pushTo, 
			})
		},
	},
}
</script>

<style scoped lang="less">
@import "../../../assets/styles/styles";
</style>
