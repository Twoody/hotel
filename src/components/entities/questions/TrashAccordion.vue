<template>
	<QuestionAccordion
		class="accordion-section"
		has-nested
	>
		<template #title>
			<h2>
				Trash	+ Recycling + Pets
			</h2>
		</template>
		<template #content>
			<div class="accordion-content">
				<p>
					Trash, recycling, and composte is picked up
					<strong>every Tuesday morning</strong>.
					<ul style="text-align:center">
						<li>
							<span style="color:green;">Trash is the green bin.</span>
						</li>
						<li>
							<span style="color:blue;">Recyling is the blue bin.</span>
						</li>
						<li>
							<span style="color:brown;">Composte is the brown bin.</span>
						</li>
					</ul>
				</p>
				<p>
					You can either <strong>contact Tanner</strong> or
					<strong>carry the trash up yourself</strong>
					(through the stairs, gate, and breezeway)
				</p>
				<p>
					You can also just throw your trash away in
					<strong>the dog poop trash</strong>,
					which is right past the gate into the backyard.
				</p>
			</div>
		</template>
	</QuestionAccordion>
</template>

<script>
import QuestionAccordion from "components/entities/questions/QuestionAccordion"

export default {
	name: "TashQuestionAccordion",
	components:
	{
		QuestionAccordion,
	},
}
</script>
