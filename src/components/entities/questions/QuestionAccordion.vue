<template>
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
</template>

<script>
import Accordion from "components/common/Accordion"

export default {
	name: "QuestionAccordion",
	components:
	{
		Accordion,
	},
}
</script>
