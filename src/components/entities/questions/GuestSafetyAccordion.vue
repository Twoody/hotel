<template>
	<QuestionAccordion
		class="accordion-section"
		has-nested
	>
		<template #title>
			<h2>
				Guest Safety
			</h2>
		</template>
		<template #content>
			<div class="accordion-content">
				We live in the area and are in touch with leading local experts.
				We encourage communication and provide guests with important local information.
			</div>
		</template>
	</QuestionAccordion>
</template>

<script>
import QuestionAccordion from "components/entities/questions/QuestionAccordion"

export default {
	name: "GuestSafetyQuestionAccordion",
	components:
	{
		QuestionAccordion,
	},
}
</script>
