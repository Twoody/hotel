<template>
	<QuestionAccordion
		class="parking-accordion-section"
		has-nested
	>
		<template #title>
			Parking
		</template>
		<template #content>
			Street parking is available outside of the entrance to the studio.
			<br>
			We keep an orange cone out for multiple functions.
			<ul>
				<li>
					Feel free to keep the door open as need be with it. 
				</li>
				<li>
					Place it behind your car if you are worried about the corner.
				</li>
				<li>
					Use it as a sign you are at the right place.
				</li>
			</ul>
		</template>
	</QuestionAccordion>
</template>

<script>

export default {
	name: "ParkingQuestionAccordion",
	components: {},
}
</script>
