<template>
	<QuestionAccordion
		class="wifi-accordion-section"
		has-nested
	>
		<template #title>
			Wifi
		</template>
		<template #content>
			We have fiber optic internet, with a blazing up and down time.
			<br>
			If it is working from home or streaming, our internet speeds have you covered.
			<br>
			If you have problems with the password, please contact Tanner.
		</template>
	</QuestionAccordion>
</template>

<script>
import QuestionAccordion from "components/accordions/questions/QuestionAccordion.vue"

export default {
	name: "WifiQuestionAccordion",
	components:
	{
		QuestionAccordion,
	},
}
</script>
