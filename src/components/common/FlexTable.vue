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

	.category-section {
		border-right: 1px solid black;
		flex-basis: 60px;
		padding-right: 7px;
		width: 100%;
	}
	.content-section {
		flex-basis: 85%;
		text-align: center;
	}
}
</style>
