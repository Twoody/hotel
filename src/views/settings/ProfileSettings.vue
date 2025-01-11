<template>
	<div>
		<h2>Profile Tab</h2>
		<p>
			Here you could add user profile form fields,
			upload avatars, social links, etc.
		</p>

		<BookingsTable />
	</div>
</template>

<script>
import BookingsTable from "@/components/entities/BookingsTable.vue"

export default {
	name: "ProfileSettings",
	components: {
		BookingsTable,
	},
}
</script>

<style scoped lang="less">
/* Insert Profile-specific styles if you need them */
</style>
