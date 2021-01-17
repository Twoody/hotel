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
		/**
		 * Sets the button font color
		 */
		color: {
			type: String,
			default: "black",
		},
		/** Sets background color of the button
		 * @since 1.2.0
		 */
		background: {
			type: String,
			default: "white",
		},
		/** @deprecated Use color instead */
		oldColor: String,
	},
	computed: {
		styles () {
			return {
				"font-size": this.size,
				color: this.color,
				background: this.background,
			}
		},
	},
	methods: {
		handleClick (e) {
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
