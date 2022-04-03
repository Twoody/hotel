<template>
	<div class="flex-table-wrapper">
		<div class="category-section">
			<slot name="category"/>
		</div>
		<div class="content-section">
			<slot name="content"/>
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
