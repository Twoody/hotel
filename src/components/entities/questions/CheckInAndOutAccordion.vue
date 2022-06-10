<template>
	<QuestionAccordion
		class="accordion-section"
		has-nested
	>
		<template #title>
			<h2>
				Check In / Check Out
			</h2>
		</template>
		<template #content>
			<div class="accordion-content">
				<strong>Check in</strong> by getting the details via airbnb for now.
				<br>
				<strong>Check out</strong> by just sending us a text,
				letting us know when you are gone.
			</div>
		</template>
	</QuestionAccordion>
</template>

<script>
import QuestionAccordion from "components/entities/questions/QuestionAccordion"

export default {
	name: "CheckInAndOutQuestionAccordion",
	components:
	{
		QuestionAccordion,
	},
}
</script>
