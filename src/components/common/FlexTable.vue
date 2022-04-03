<template>
	<div class='flex-table-wrapper'>
		<div class='category-section'>
			<slot name='category'></slot>
		</div>
		<div class='content-section'>
			<slot name='content'></slot>
		</div>
	</div>
</template>

<script>
export default {
	name: "FlexTable",
}
</script>

<style lang="less" scoped>
</style>
