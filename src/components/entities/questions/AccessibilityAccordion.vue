<template>
	<QuestionAccordion
		class="accordion-section"
		has-nested
	>
		<template #title>
			Accessibility
		</template>
		<template #content>
			<p>
				We believe that anyone can belong anywhere, 
				and we want to make it easier for people with disabilities and
				other accessibility needs to travel.
			</p>
			<p>
				Please reach out,
				and we will do everything in our capabilities to make your stay a success.
				Wheelchair accessibility is our biggest "next step" for our space.
				We appologize for that inconvenience.
			</p>
		</template>
	</QuestionAccordion>
</template>

<script>
import QuestionAccordion from "components/entities/questions/QuestionAccordion"

export default {
	name: "AccessibilityQuestionAccordion",
	components:
	{
		QuestionAccordion,
	},
}
</script>
