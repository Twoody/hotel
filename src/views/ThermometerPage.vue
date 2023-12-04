<template>
	<div class="thermometer-wrapper">
		<h1>Thermometer</h1>
		<div class="thermometer-section">
			<h2>Debt Thermometer</h2>
		</div>
	</div>
</template>

<script>
export default {
	name: "Thermometer",
	components:
	{},
	created: function()
	{
	},
}
</script>

<style lang="less" scoped>
/* TODO: Make max-width scroll window scroll into margins */
.thermometer-wrapper {
	align-content: center;
	align-items: center;
	display: flex;
	flex-direction: column;
	padding-bottom: 50px;
	margin-left: 20px;
	margin-right: 20px;
	width: 100%;

	h1 {
		flex-grow:1;
		width: 100%;
	}
	.thermometer-section {
		max-width: 500px;
		width: 100%;

		p {
			text-align: left;
			width: 100%;
		}
		.statistics-section {
			align-items: center;
			align-content: center;
			justify-content: space-between;
			display: flex;
			flex-grow: 1;
			width: 100%;

			.statistic {
				align-items: center;
				align-content: center;
				border: 1px solid;
				border-radius: 7px;
				display: flex;
				flex-direction: column;
				flex-grow: 1;
				justify-content: center;
				margin: 5px;
				width: 100%;

				.description {
					height: 50px;
					width: 100%;
				}
				.value {
					border-top: 1px solid;
				}
			}
		}

	}
}
</style>
