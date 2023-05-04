<template>
	<div class="question-accordion-wrapper">
		<Accordion
			class="accordion-section"
			has-nested
		>
			<template #title>
				<h2>
					<slot name="title"/>
				</h2>
			</template>
			<template #content>
				<div class="accordion-content">
					<slot name="content"/>
				</div>
			</template>
		</Accordion>
	</div>
</template>

<script>

export default {
	name: "QuestionAccordion",
}
</script>

<style lang="less">
@import "../../../../assets/styles/styles";
@size: max(65vw, 300px);

.question-accordion-wrapper {
	margin: 0;
	max-width: @size;
	padding: 0;

	.accordion-section {
		margin-bottom: 7px;
		margin-top: 7px;

		h2 {
			font-size: clamp(15px, 1em, 25px);
			margin-bottom: 0px;
			margin-top: 0px;
		}
		.accordion-content {
			text-align: left;
			padding-bottom: 7px;
			padding-left: 17px;
			padding-right: 17px;
			padding-top: 7px;
		}
	}
}
</style>
