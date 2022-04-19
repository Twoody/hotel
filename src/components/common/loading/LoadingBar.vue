<template>
	<div
		class="loading-bar-wrapper"
		:class="classes"
	/>
</template>

<script>

export default
{
	name: "LoadingBar",
	props:
	{
		/** Width of the bar */
		size:
		{
			default: "medium",
			required: false,
			type: String,
		},

		/** Height of the bar */
		tall:
		{
			required: false,
			type: Boolean,
		},
	},
	computed:
	{
		/**
		 * @returns {object} CSS classes for applying/customizing width and height of bar
		 */
		classes ()
		{
			let classArray = []

			classArray.push(this.tall ? "loading-bar-tall" : "loading-bar-short")
			classArray.push(this.sizeClass)

			return classArray
		},

		/**
		 * @returns {string} A css class for loading bar length
		 */
		sizeClass ()
		{
			let prefix = "loading-bar-"

			switch (this.size)
			{
				case "small":
					return prefix + "sm"

				case "medium":
					return prefix + "md"

				case "large":
					return prefix + "lg"

				default:
					return prefix + "md"
			}
		},
	},
}

</script>

<style scoped lang="less">
	@bar-h-short: 10px;
	@bar-h-tall: @bar-h-short * 2;

	.loading-bar-wrapper {
		background-color: #DDDBDD;
		display: inline-block;
		position: relative;
		overflow: hidden;

		&::after {
			animation: shimmer 2s infinite;
			background-image: linear-gradient(
				90deg,
				rgba(#fff, 0) 0,
				rgba(#fff, 0.2) 20%,
				rgba(#fff, 0.5) 60%,
				rgba(#fff, 0)
			);
			bottom: 0;
			content: '';
			left: 0;
			position: absolute;
			right: 0;
			top: 0;
			transform: translateX(-100%);
		}

		@keyframes shimmer {
			100% {
				transform: translateX(100%);
			}
		}

		&.loading-bar-sm {
			width: 50px;
		}
		&.loading-bar-md {
			width: 100px;
		}
		&.loading-bar-lg {
			width: 150px;
		}
		&.loading-bar-short {
			height: @bar-h-short;
		}
		&.loading-bar-tall {
			height: @bar-h-tall;
		}
	}
</style>
