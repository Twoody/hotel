<template>
	<div
		class="validatable"
		:class="{warn: error}"
	>
		<slot/>
		<transition name="pull-up">
			<div
				v-if="error"
				class="error-message"
			>
				^ {{ error }}
			</div>
		</transition>
	</div>
</template>

<script>

export default
{
	name: "Validatable",
	props:
	{
		error:
		{
			required: true,
			type: String,
		},
	},
}

</script>

<style scoped lang="less">

	.validatable {
		.error-message {
			position: relative;
			top: -10px;
			opacity: 1;
			text-align: left;
			color: red;
		}

		.pull-up-enter-active {
			transition: opacity .5s, top .5s;
		}

		.pull-up-enter {
			top: 10px;
			opacity: 0;
		}
	}
</style>
