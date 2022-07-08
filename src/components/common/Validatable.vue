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
			color: #F5AF11;
			font-weight: 900;
			position: relative;
			opacity: 1;
			text-align: left;
			top: -4px;
		}

		.pull-up-enter-active {
			transition: opacity .5s, top .5s;
		}

		.pull-up-enter {
			opacity: 0;
			top: 10px;
		}
	}
</style>
