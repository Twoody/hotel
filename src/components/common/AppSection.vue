<template>
	<div
		class="app-section-wrapper"
		:class="getClasses()"
		:style="styles"
		@click="$emit('click')"
	>
		<!-- @slot Use this slot to place the full section content -->
		<slot />
	</div>
</template>

<script>
export default {
	name: "AppSection",
	props:
	{
		/**
		 * Whether justified center
		 *
		 * @since 0.1.0
		 */
		centered: Boolean,

		/**
		 * Whether the section is showing in a collapsed state or not
		 *
		 * @since 0.1.0
		 */
		isCollapsed: Boolean,

		/**
		 * Whether the section is showing at all or not
		 *
		 * @since 0.1.0
		 */
		isShowing: Boolean,

		/**
		 * String of styles to be applied to main wrapper;
		 *
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
		 *
		 * @returns {object} Styles to be applied when in different states;
		 * @since 0.1.0
		 * @public
		 */
		getClasses ()
		{
			return {
				"centered": this.isShowing && this.centered,
				"is-collapsed": this.isShowing && this.isCollapsed,
				"is-hidden": !this.isShowing,
				"is-showing": this.isShowing && !this.isCollapsed,
			}
		},
	},
}
</script>

<style lang="less">
.app-section-wrapper {
	display: flex;
	overflow: hidden;
	width: 100%;

	&.centered {
		justify-content: center;
	}
	&.is-collapsed {
		height: auto;
		max-height: 10px;
		transition: all 0.7s ease-out;
	}
	&.is-hidden {
		max-height: 0px;
		transition: all 0.7s ease-out;
	}
	&.is-showing {
		height: auto;
		max-height: 200px;
		transition: all 0.7s ease-out;
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

Container that is showing

```jsx
<AppSection is-showing>
	<div style="height: 50; background-color: red;"/>
</AppSection>
```
</docs>
