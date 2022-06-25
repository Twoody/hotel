TODO: Hover effect
<template>
	<div
		class="accordion-wrapper"
		:class="{'has-nested': hasNested, 'selected': selected}"
	>
		<div
			class="main-bar"
			:class="{'has-nested': hasNested, 'not-selected': !selected}"
			@click="handleClick()"
		>
			<div
				class="title-section"
				:class="{'bigger': hasNested}"
			>
				<slot name="title"/>
			</div>
			<div
				class="chevron-section"
				:class="{'collapsed': !selected}"
			>
				<font-awesome-icon
					:icon="['fa', 'chevron-right']"
				/>
			</div>
		</div>
		<div
			class="content-section"
			:class="{'collapsed': !selected}"
		>
			<slot name="content"/>
		</div>
	</div>
</template>

<script>
export default {
	name: "Accordion",
	data () 
	{
		return {
			selected: false,
		}
	},
	props:
	{
		/** Whether the accordion has a nested accordion inside */
		hasNested: Boolean,
	},
	methods:
	{
		/** @returns {void} Suppress state change during current transition */
		async handleClick ()
		{
			if (this.isClicked)
			{
				// Do nothing and wait for current selection to finish
				return
			}
			this.isClicked = true
			this.selected = !this.selected
			await new Promise((r) => setTimeout(r, 400))
			this.isClicked = false
		},
	},
}
</script>

<style lang="less" scoped>
@import "~styles/styles";

.accordion-wrapper:active, .accordion-wrapper:focus {
	transform: scale(1.03);
}
.accordion-wrapper {
	align-content: center;
	border: 1px solid #dea5ce;
	border-radius: 7px;
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	flex-shrink: 0;
	justify-content: space-between;
	margin: 11px;
	transition: all 0.2s linear;

	&.selected {
		border: 2px solid transparent;
	}
	&.has-nested {
		border: 1px solid @myblack;
	}
	.content-section {
		height: auto;
		max-height: 1000px;
		overflow-y: hidden;
		overflow-x: auto;
		transition: all 0.6s cubic-bezier(0.95, 0.05, 0.05, 0.95);

		&.collapsed {
			max-height: 0px;
		}
	}
	.main-bar {
		align-items: baseline;
		cursor: pointer;
		display: flex;
		flex-grow: 1;
		justify-content: space-between;
		transition: all 0.2s linear;

		&.has-nested {
			border-bottom: 1px solid @myblack;
			&.not-selected {
				border: 2px solid transparent;
			}
		}
		:not(.has-nested) {
			padding: 3px;
		}
		.chevron-section {
			align-self: center;
			margin-right: 15px;
			transition: all 0.4s;
			transform: rotate(-90deg);
			&.collapsed {
				transform: rotate(450deg);
			}
		}
		.title-section {
			flex-grow: 0;
			flex-shrink: 1;
			font-size: 22px;
			font-weight: 500;
			margin-bottom:5px;
			text-align: left;

			&.bigger {
				margin-bottom: 0px;
				margin-top: 0px;
				padding: 7px;
				text-transform: uppercase;
			}
		}
	}
}
@media (hover: hover) {
	.accordion-wrapper:hover {
		transform: scale(1.03);
	}
}
</style>
