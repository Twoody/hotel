<template>
	<QuestionAccordion
		class="accordion-section"
		has-nested
	>
		<template #title>
			Check In / Check Out
		</template>
		<template #content>
			<strong>Check in</strong> by getting the details via airbnb for now.
			<br>
			<strong>Check out</strong> by just sending us a text,
			letting us know when you are gone.
		</template>
	</QuestionAccordion>
</template>

<script>

export default {
	name: "CheckInAndOutAccordion",
	components: {},
}
</script>
