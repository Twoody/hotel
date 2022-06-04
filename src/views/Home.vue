<template>
	<div class="home-wrapper">
		<AvailabilitySearch />
	</div>
</template>

<script>
import AvailabilitySearch from "@/components/forms/AvailabilitySearch.vue"

export default {
	name: "Home",
	components:
	{
		AvailabilitySearch,
	},
	created: function()
	{
	},
}
</script>

<style scoped lang="less">
.home-wrapper {
	overflow: scroll;
	width: 100%;
}
</style>
