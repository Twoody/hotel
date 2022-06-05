<template>
	<Accordion
		class="accordion-section"
		has-nested
	>
		<template #title>
			<h2>
				Accessibility
			</h2>
		</template>
		<template #content>
			<div class="accordion-content">
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
			</div>
		</template>
	</Accordion>
</template>

<script>
import Accordion from "components/common/Accordion"

export default {
	name: "AccessibilityAccordion",
	components:
	{
		Accordion,
	},
}
</script>
