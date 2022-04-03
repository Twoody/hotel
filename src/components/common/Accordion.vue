<template>
	<div class="amenities-item-wrapper">
		<div
			class="main-bar"
			@click="selected = !selected"
		>
			<div class="title-section">
				<slot name="title"/>
			</div>
			<div
				class="chevron"
				:class="{'collapsed': selected}"
			/>
		</div>
		<div class="content-section">
			<slot name="content"/>
		</div>
	</div>
</template>

<script>
export default {
	name: "Accordion",
	data () 
	{
		return {
			selected: false,
		}
	},
}
</script>

<style lang="less" scoped>
</style>
