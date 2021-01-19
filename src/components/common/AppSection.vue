<template>
	<div
		class="content-section"
		:class="getClasses()"
		:style="styles"
		@click="isShowing = ignoreClick? isShowing : !isShowing"
	>
		<!-- @slot Use this slot to place the button content -->
		<slot />
	</div>
</template>

<script>
export default {
	name: "AppSection",
	data: function()
	{
		return {
			isShowing: true,
		}
	},
	props:
	{
		/**
		 * When clicked, does the whole component dissapear or just collapse?
		 * Collapse is default.
		 * @since 0.1.0
		 */
		dissapears:
		{
			default: false,
			required: false,
			type: Boolean,
		},
		/**
		 * Whether we are ignoring the click or not
		 * @since 0.1.0
		 */
		ignoreClick:
		{
			default: false,
			required: false,
			type: Boolean,
		},
		/**
		 * String of styles to be applied to main wrapper;
		 * @todo Arrange into props and make computed
		 * @since 0.1.0
		 */
		styles:
		{
			default: "",
			required: false,
			type: String,
		},
	},
	methods:
	{
		/**
		 * Styles to be applied when in different states; Handled as object;
		 * @return object
		 * @since 0.1.0
		 * @public
		 */
		getClasses ()
		{
			return {
				"is-collapsed": !this.isShowing && !this.dissapears,
				"is-hidden": !this.isShowing && this.dissapears,
				"is-showing": this.isShowing,
			}
		},
	},
}
</script>

<style lang="less">
.content-section {
	display: flex;
	height: auto;
	overflow: hidden;
	width: 100%;

	&.is-collapsed {
		max-height: 10px;
		transition: all 0.7s ease;
	}
	&.is-hidden {
		max-height: 0px;
		transition: all 0.7s ease;
	}
	&.is-showing {
		max-height: 4000px;
		transition: all 0.7s ease;
	}
}
</style>

<docs>
Flex box inspired item to use as a `decorator` and wrapper around content;
Support fully disspearing items, ignored clicks, and extra styles.
All transitions done via:
- `max-height`, 
- `height:auto`,
- `transition: all 0.7s ease`
css properties.

## Examples

Non clickable container

```jsx
<AppSection ignore-click>
	<div style="height: 50; background-color: red;"/>
</AppSection>
```

Dissapearing container

```jsx
<AppSection dissapears>
	<div style="height: 50; background-color: red;"/>
</AppSection>
```
</docs>
