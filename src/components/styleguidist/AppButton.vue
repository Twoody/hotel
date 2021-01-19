<template>
	<button :style="styles" @click="handleClick">
		<!-- @slot Use this slot to place the button content -->
		<slot/>
	</button>
</template>

<script>
import sizeMixin from "./sizeMixin"
export default {
	name: "AppButton",
	mixins: [
		sizeMixin,
	],
	props: {
		/** Sets background color of the button
		 * @since 1.2.0
		 */
		background: {
			default: "white",
			type: String,
		},
		/**
		 * Sets the button font color
		 */
		color: {
			default: "black",
			type: String,
		},
		/** @deprecated Use color instead */
		oldColor: String,
	},
	computed: {
		styles () 
		{
			return {
				background: this.background,
				color: this.color,
				"font-size": this.size,
			}
		},
	},
	methods: {
		handleClick (e) 
		{
			/** Triggered when button is clicked
			 * @event click
			 * @type {Event}
			 */
			this.$emit("click", e)

			/** Event for Alligator's example
			 * @event gator
			 * @type {Event}
			 */
			this.$emit("gator", e)
		},
	},
}
</script>

<docs>
This button is amazing, use it responsibly.

## Examples

Orange button:

```jsx
<AppButton color="orange">Push Me</AppButton>
```

Ugly button with pink font and blue background:

```jsx
<AppButton color="pink" background="blue">
  Ugly button
</AppButton>
```

Button containing custom tags:

```jsx
<AppButton>
  Text with <b>bold</b>
</AppButton>
```
</docs>
