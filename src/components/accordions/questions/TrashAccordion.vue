<template>
	<QuestionAccordion
		class="trash-accordion-section"
		has-nested
	>
		<template #title>
			Trash	+ Recycling + Pets
		</template>
		<template #content>
			<p>
				Trash, recycling, and composte is picked up
				<strong>every Tuesday morning</strong>.
				<ul>
					<li>
						<span style="color:green;">Trash is the green bin.</span>
					</li>
					<li>
						<span style="color:blue;">Recyling is the blue bin.</span>
					</li>
					<li>
						<span style="color:brown;">Composte is the brown bin.</span>
					</li>
					<li>
						<span style="color:grey;">Glass is the grey bin.</span>
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
		</template>
	</QuestionAccordion>
</template>

<script>

export default {
	name: "TashQuestionAccordion",
	components: {},
}
</script>

<style lang="less" scoped>
ul {
	margin-inline-start: -10px;
}
</style>
