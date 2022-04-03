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
.flex-table-wrapper {
	align-items: flex-start;
	border: 1px solid black;
	border-radius: 4px;
	display: flex;
	flex-direction: row;
	padding-left: 10px;
	padding-right: 10px;
	width: 100%;

	.category-section {
		border-right: 1px solid black;
		flex-grow: 0;
		flex-shrink: 1;
		padding-right: 7px;
		width: auto;
	}
	.content-section {
		flex-grow: 1;
		flex-shrink: 0;
		text-align: center;
		width: 100%;
	}
}
</style>
