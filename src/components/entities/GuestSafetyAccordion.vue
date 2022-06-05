<template>
	<Accordion
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
	</Accordion>
</template>

<script>
import Accordion from "components/common/Accordion"

export default {
	name: "GuestSafetyAccordion",
	components:
	{
		Accordion,
	},
}
</script>
