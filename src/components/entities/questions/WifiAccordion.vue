<template>
	<QuestionAccordion
		class="accordion-section"
		has-nested
	>
		<template #title>
			<h2>
				Wifi
			</h2>
		</template>
		<template #content>
			<div class="accordion-content">
				We have fiber optic internet, with a blazing up and down time.
				<br>
				If it is working from home or streaming, our internet speeds have you covered.
				<br>
				If you have problems with the password, please contact Tanner.
			</div>
		</template>
	</QuestionAccordion>
</template>

<script>
import QuestionAccordion from "components/entities/questions/QuestionAccordion"

export default {
	name: "WifiQuestionAccordion",
	components:
	{
		QuestionAccordion,
	},
}
</script>
