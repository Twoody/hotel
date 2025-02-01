Molecule for drawing a single checkbox plus label on an entire row.
Will use the slot as the label.

<template>
	<div
		class="checkbox"
		@click="$emit('update:modelValue', !modelValue)"
	>
		<Toggle :selected="modelValue">
			<slot/>
		</Toggle>
	</div>
</template>

<script>
import Toggle from "@/components/common/Toggle.vue"

export default {
	name: "Checkbox",
	components: {
		Toggle,
	},
	props: {
		modelValue: {
			required: true,
			type: Boolean,
		},
	},
}
</script>
