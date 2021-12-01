<template>
	<div
		class="search-wrapper"
	>
		<div
			class="content-section"
		>
			<form class="search-box">
				<AvailabilitySearchBar
					:isLoading="isLoading"
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
export default {
	name: "AvailabilitySearch",
	components:
	{
		AvailabilitySearchBar,
		BookButton,
	},
	data: function()
	{
		return {
			isLoading: false,
			searchQuery: "",
		}
	},
	props:
	{},
	methods:
	{
		/**
		 */
		async handleAvailabilitySearch ()
		{
			this.isLoading = true
			try
			{
				// sleep for .5 seconds
				await new Promise((r) => setTimeout(r, 5000))
				this.isLoading = false
			}
			catch (error)
			{
				this.hasError = true
				this.isLoading = false
			}
		},
	},
}
</script>

<style lang="less" scoped>
.search-wrapper {
	display: relative;
	height: 100%;
	width: 100%;

	.content-section {
		display: relative;
		height: 100%;;
		overflow: hidden;
		width: 100%;

		.search-box {
			align-items: center;
			display: flex;
			flex-direction: column;
			height: 100%;
			margin-top: 20px;
			text-align: center;
			width: 100%;
		}
	}
}
</style>

<docs>
</docs>

