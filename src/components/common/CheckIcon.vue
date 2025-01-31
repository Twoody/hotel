Just a graphic that means success
<template>
	<svg
		class='check-icon-wrapper'
		:height='height'
		viewBox='0 0 26 18'
		:width='width'
		xmlns='http://www.w3.org/2000/svg'
	>
		<circle
			v-if='hasCircle'
			class='check-circle'
			cx='13'
			cy='9'
			:fill='circleColor'
			:fill-opacity='circleOpacity'
			r='12.3'
			:stroke='circleColor'
			stroke-opacity='1'
		/>
		<path
			v-if='isChecked'
			:class="{'check-icon': !hasCircle, 'circled-check': hasCircle}"
			d='M11.029,19.7,1,9.669l2.38-2.38,7.649,7.479L24.8,1l2.38,2.38Z'
			:fill='checkColor'
		/>
	</svg>
</template>

<script>
export default {
	name: 'CheckIcon',
	props:
	{
		checkColor:
		{
			default: '#000',
			required: false,
			type: String,
		},

		circleColor:
		{
			default: '#00B207',
			required: false,
			type: String,
		},

		circleOpacity:
		{
			default: '0.9',
			required: false,
			type: String,
		},

		hasCircle:
		{
			default: false,
			required: false,
			type: Boolean,
		},

		height:
		{
			default: '26',
			required: false,
			type: String,
		},

		isChecked:
		{
			default: true,
			required: false,
			type: Boolean,
		},

		width:
		{
			default: '18',
			required: false,
			type: String,
		},
	},
}
</script>
<style scoped lang="less">
	.check-icon-wrapper {
		.check-circle {
			transition: all 0.5s ease;
		}
		.check-icon {
			transform: translate(-1, -1);
			transition: all 0.5s ease;
		}
		.circled-check {
			transform: scale(0.45, 0.45) translate(14px, 11px);
			transition: all 0.5s ease;
		}
	}
</style>
