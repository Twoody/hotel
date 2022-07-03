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
@import "../../../assets/styles/styles";

.flex-table-wrapper {
	align-items: center;
	border: 1px solid @myblack;
	border-radius: 4px;
	display: flex;
	flex-direction: row;
	padding-left: 10px;
	padding-right: 10px;

	.category-section {
		flex-basis: 98px;
		padding-right: 7px;
		width: 100%;
	}
	.content-section {
		border-left: 1px solid @myblack;
		flex-basis: 85%;
		text-align: center;
	}
}
</style>
