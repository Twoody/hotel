Atomic representation of a value that can be true or false
<template>
	<div
		v-if='!inProgress'
		class='toggle'
	>
		<div class='icon'>
			<CheckIcon
				check-color='#5FED64'
				:circle-opacity="selected ? '0.85' : '0.3'"
				class='check-icon'
				has-circle
				:height='checkboxSize'
				:is-checked='selected'
				:width='checkboxSize'
			/>
		</div>
		<div
			class='label'
			:class="{'is-highlighting': isHighlighting && selected}"
		>
			<label><slot></slot></label>
		</div>
	</div>
	<div v-else>
		<LoadingToggle />
	</div>
</template>

<script>
import CheckIcon from '@/components/common/CheckIcon'
import LoadingToggle from '@/components/common/LoadingToggle'

export default {
	name: 'Toggle',
	components:
	{
		CheckIcon,
		LoadingToggle,
	},
	props:
	{
		inProgress:
		{
			default: false,
			required: false,
			type: Boolean,
		},

		isHighlighting:
		{
			default: false,
			required: false,
			type: Boolean,
		},

		selected:
		{
			default: false,
			required: false,
			type: Boolean,
		},
	},
	data: function()
	{
		return {
			checkboxSize: '32',
		}
	},
}
</script>

<style scoped lang="less">
@checkbox-size: 32px;

.toggle {
	margin-bottom: 20px;

	display: flex;
	align-items: center;
	width: 100%;

	.is-highlighting {
		color: #13B306 !important;
	}

	.icon {
		position: relative;
		display: block;
		width: @checkbox-size;
		height: @checkbox-size;

		.check-icon {
			position: absolute;
			top: 0px;
			left: 0px;
			width: @checkbox-size;
			height: @checkbox-size;
		}
	}

	/* Use flex and line-height so single-line labels are centered,
		and multi-line labels line up with the top of the checkbox */
	.label {
		margin-left: 13px;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: center;
		user-select: none;

		width: calc(100% - @checkbox-size);
		user-select: none;

		label {
			flex-grow: 0;

			text-align: left;
			line-height: 22px;

			font-size: 18px;
		}
	}
}

.warn .toggle .label {
	color: orange;
}

</style>
