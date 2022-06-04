<template>
	<div class="manual-page-wrapper">
		<h1>House Manuel</h1>
		<div class="manual-content">
			<ManualCard
				v-for="(activity, index) in allActivities"
				:key="index"
				:activity="activity"
				:shown="activity.shown"
			/>
		</div>
	</div>
</template>

<script>
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
			activities: {
				1: {
					subtitle: "",
					title: "Trash",
				},
				2: {
					subtitle: "",
					title: "Parking",
				},
				3: {
					subtitle: "",
					title: "Electronics",
				},
				4: {
					subtitle: "",
					title: "Maintenance",
				},
				5: {
					subtitle: "",
					title: "Cleaning Supplies",
				},
				6: {
					subtitle: "",
					title: "Guests",
				},
				7: {
					subtitle: "",
					title: "Lease Agreement",
				},
				8: {
					subtitle: "",
					title: "Heating",
				},
				9: {
					subtitle: "",
					title: "Air Conditioning",
				},
				10: {
					subtitle: "",
					title: "Wifi Password",
				},
				11: {
					subtitle: "",
					title: "Furniture",
				},
				12: {
					subtitle: "",
					title: "Accessibility",
				},
				13: {
					subtitle: "",
					title: "Guest Safety",
				},
				14: {
					subtitle: "",
					title: "Checkin",
				},
				15: {
					subtitle: "",
					title: "Checkout",
				},
			},
		}
	},

	computed:
	{
		allActivities ()
		{
			let all = []
			let keys = Object.keys(this.activities)
			for (let i = 0; i < keys.length; i += 1)
			{
				let activity = this.activities[keys[i]]
				activity.id = keys[i]
				activity.shown = true
				all.push(activity)
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
@import "~styles/styles";

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
