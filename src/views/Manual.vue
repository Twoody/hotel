<template>
	<div class="manual-page-wrapper">
		<h1>House Manuel</h1>
		<div class="manual-content">
			<ManualCard
				v-for="(entry, index) in allEntries"
				:key="index"
				:entry="entry"
				:shown="entry.shown"
			/>
		</div>
	</div>
</template>

<script>
import {MANUAL} from "constants/manual.js"
import ManualCard from "components/entities/manual/ManualCard"

export default {
	name: "Manual",
	components:
	{
		ManualCard,
	},

	data: function()
	{
		return {
			manual: MANUAL,
		}
	},

	computed:
	{
		allEntries ()
		{
			let all = []
			let keys = Object.keys(this.manual)
			for (let i = 0; i < keys.length; i += 1)
			{
				let entry = this.manual[keys[i]]
				entry.id = keys[i]
				entry.shown = true
				all.push(entry)
			}

			// Sort alphabetically
			all.sort((a, b) => (a.title > b.title) ? 1 : -1)
			return all
		},
	},
	methods: 
	{},
}
</script>

<style scoped lang="less">
@import "../../assets/styles/styles";

.manual-page-wrapper {
	height: auto;
	padding: 10px;
	width: 100%;

	.manual-content {
		align-content: center;
		align-items: center;
		justify-content: center;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		transition: all 0.2s ease;
	}
}
</style>
