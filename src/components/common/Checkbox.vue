Molecule for drawing a single checkbox plus label on an entire row.
Will use the slot as the label.

<template>
	<div
		class='checkbox'
		@click="$emit('input', !value)"
	>
		<Toggle :selected='value'>
			<slot></slot>
		</Toggle>
	</div>
</template>

<script>
import Toggle from '@/components/common/Toggle.vue'

export default {
	name: 'Checkbox',
	components: {
		Toggle,
	},
	props:
	{
		value: Boolean,
	},
}
</script>
