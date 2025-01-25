<template>
	<div class="thermometer-wrapper">
		<h1>Thermometer</h1>
		<div class="thermometer-section">
			<h2>Debt Thermometer</h2>
			<Thermometer
				class=""
				:currentAmount="debtPaid"
				:maxAmount="debt.originalOwed"
			/>
		</div>
	</div>
</template>

<script>
import Thermometer from "@/components/entities/Thermometer"
export default {
	name: "ThermometerPage",
	components:
	{
		Thermometer,
	},
	data ()
	{
		return {
			debt: {
				originalOwed:718902.00,
			},
		}
	},
	computed:
	{
		currentBalance ()
		{
			const homeLoan = 400000
			const tannerStudentLoans = 65000
			const betsyStudenLoans = 35000

			return 603745.39 // 2025-01-11 -- Probably a few years old from this date
		},

		debtPaid ()
		{
			return this.debt.originalOwed - this.debt.currentBalance
		},
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
		width: 100%;
	}
	.thermometer-section {
		display: flex;
		align-items: center;
		flex-direction: column;
		max-width: 500px;
		width: 100%;
	}
}
</style>
