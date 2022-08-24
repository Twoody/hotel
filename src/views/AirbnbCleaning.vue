<template>
	<div class="airbnb-cleaning-wrapper">
		<h1>Airbnb Cleaning</h1>

		<div class="tips-list room-list">
			<h2>Tips</h2>
			<ol>
				<li>
					Load the washing machines first (use both washers and dryers)
				</li>
				<li>
					Start from the top to the bottom: Window sills, picture frames, ledges, fridge...
				</li>
				<li>
					Dust first, Vacuum last
				</li>
				<li>
					<b>Look for hair everywhere</b>
				</li>
				<li>
					Clean washer/dryer when laundry is done
				</li>
				<li>
					<b>If anything is broken, please let us know ASAP</b>
				</li>
				<li>
					<b>If anything is not found whild "checking" for it, please let us know ASAP</b>
				</li>
			</ol>
		</div>

		<QuestionAccordion class="room-list">
			<template #title>
				Bathroom
			</template>
			<template #content>
				<ol>
					<li>
						Top off hand soap and shampoo bottles
					</li>
					<li>
						Resupply "linen closet"
					</li>
					<li>
						Vacuum Drawers
					</li>
					<li>
						Vacuum rugs and under rugs to best of ability
					</li>
				</ol>
				<QuestionAccordion class="nested-list">
					<template #title>
						Clean
					</template>
					<template #content>
						<ol>
							<li>
								Dust lights 
							</li>
							<li>
								Clean window sill
							</li>
							<li>
								Clean counter
							</li>
							<li>
								Clean mirrors
							</li>
							<li>
								Clean shower head
							</li>
							<li>
								Move shower soaps and clean caddy
							</li>
							<li>
								Check the shower curtain for discoloration (we have a spare to just switch out)
							</li>
							<li>
								Clean toilet (tighten screws if needed)
							</li>
							<li>
								Clean toilet bowl - Cleaner and brush should be downstairs
							</li>
						</ol>
					</template>
				</QuestionAccordion>
			</template>
		</QuestionAccordion>

		<QuestionAccordion class="room-list">
			<template #title>
				Bedroom
			</template>
			<template #content>
				<ol>
					<li>
						Look under beds, bedside drawers, in dresser, and in closet
					</li>
					<li>
						Check for Pack-and-Play container in closet
					</li>
					<li>
						Check for hangers	
					</li>
					<li>
						Strip bed, check for stains
					</li>
					<li>
						Wipe down desk
					</li>
					<li>
						Wipe down dresser and drawers
					</li>
					<li>
						Wipe down bedframe
					</li>
					<li>
						Vacuum out drawers and dresser
					</li>
					<li>
						Make bed
					</li>
				</ol>
			</template>
		</QuestionAccordion>

		<QuestionAccordion class="room-list">
			<template #title>
				Dining Room
			</template>
			<template #content>
				<ol>
					<li>
						Dust frames + shelves
					</li>
					<li>
						Check game cabinet for organization and tidiness
					</li>
					<li>
						Check and organize books
					</li>
					<li>
						Check chairs + table legs
					</li>
					<li>
						Check/wipe recycling blue bins (they should have signs on them, too)
					</li>
					<li>
						Clean window sill
					</li>
					<li>
						Clean table + glass 
					</li>
					<li>
						Vacuum
					</li>
				</ol>
			</template>
		</QuestionAccordion>

		<QuestionAccordion class="room-list">
			<template #title>
				Foyer
			</template>
			<template #content>
				<ol>
					<li>
						Fill dog treats (from upstairs)
					</li>
					<li>
						Check for umbrella and poop bags - More poop bags can be brought from upstairs
					</li>
					<li>
						Check for hangers - Take some from the closet if not any
					</li>
					<li>
						Check french doors blinds
					</li>
					<li>
						Wipe top of coat rack
					</li>
					<li>
						Clean window sill
					</li>
					<li>
						Wipe off mirror
					</li>
					<li>
						Wipe off bench
					</li>
					<li>
						Clean mirror and french door glass
					</li>
					<li>
						Vacuum dirt/mud catcher
					</li>
					<li>
						Vacuum under rugs
					</li>
					<li>
						Vacuum French Doors liner
					</li>
				</ol>
			</template>
		</QuestionAccordion>

		<QuestionAccordion class="room-list" has-nested>
			<template #title>
				Kitchen
			</template>
			<template #content>
				<ol>
					<li>
						Bring dishes upstairs if left dirty (clean in upstairs dishwasher)
					</li>
					<li>
						Top off salt, pepper, oil, vinegar (all found in upstairs kitchen)
					</li>
					<li>
						Remove MOST food (this is tricky)
					</li>
					<li>
						Clean window sill
					</li>
					<li>
						Clean top of fridge
					</li>
					<li>
						Check blender lid + pad/mat
					</li>
					<li>
						Clean stove + splash pad
					</li>
					<li>
						Clean fridge
					</li>
					<li>
						Clean counters and shelves
					</li>
					<li>
						Clean + organize drawers
					</li>
					<li>
						Vacuum under island
					</li>
					<li>
						Fill water bowl (unless told otherwise)
					</li>
					<li>
						Check dog food bowl, clean if dirty
					</li>
					<li>
						Ensure two sets of all dishes
					</li>
					<li>
						Take out trash (save for last though)
					</li>
					<li>
						Move trash can and check trash can for spills/messes
					</li>
				</ol>
			</template>
		</QuestionAccordion>

		<QuestionAccordion class="room-list">
			<template #title>
				Living Room
			</template>
			<template #content>
				<ol>
					<li>
						Fold up blankets and place in basket
					</li>
					<li>
						Put dog toys on dog bed
					</li>
					<li>
						Fold down couch
					</li>
					<li>
						Check fireplace control
					</li>
					<li>
						Check TV controls and sign out of Guest Mode
						<br>
						&nbsp;&nbsp;&nbsp;&nbsp;Batteries upstairs in closet next to robot vacuum
					</li>
					<li>
						Clean table stand
					</li>
					<li>
						Vacuum furniture
					</li>
					<li>
						Vacuum rug
					</li>
					<li>
						Vacuum under rug to best of ability
					</li>
					<li>
						Vacuum fan base
					</li>
					<li>
						Check for fan remote and that it works
					</li>
					<li>
						Assist with robot vacuum if unplugged/off base
					</li>
				</ol>
			</template>
		</QuestionAccordion>

		<QuestionAccordion class="room-list">
			<template #title>
				Outside
			</template>
			<template #content>
				<ol>
					<li>
						Wipe off patio set
					</li>
					<li>
						Check for trash
					</li>
				</ol>
			</template>
		</QuestionAccordion>

		<hr>

		<QuestionAccordion class="room-list">
			<template #title>
				Misc
			</template>
			<template #content>
				<ol>
					<li>
						In general, wipe everything down and vacumm
						<br>
						And let us know if things are broken or do not look right.
					</li>
					<li>
						This list is meant as a sanity check and ensure nothing was missed post cleaning.
					</li>
					<li>
						This list can also be used as a means to best understand our expectations.
					</li>
				</ol>
			</template>
		</QuestionAccordion>
	</div>
</template>

<script>
import QuestionAccordion from "components/entities/questions/QuestionAccordion"

export default {
	name: "AirbnbCleaning",
	components:
	{
		QuestionAccordion,
	},
}
</script>

<style lang="less" scoped>
@import "../../assets/styles/styles";

.airbnb-cleaning-wrapper {
	align-content: center;
	align-items: center;
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	padding-bottom: 50px;
	margin-left: 20px;
	margin-right: 20px;
	width: 100%;

	h1 {
		width: 100%;
	}
	hr {
		border-bottom: 2px solid purple;
		width: 150px;
	}

	.room-list {
		max-width: min(98%, 660px);
		width: 100%;
		.nested-list {
			max-width: 100%;
			width: 100%;
		}
	}
	.tips-list {
		padding-bottom: 15px;

		h2 {
			border-bottom: 1px solid @myblack;
			margin: 0;
			margin-bottom: 9px;
			width: 100%;
		}
		ol {
			align-content: left;
			align-items: flex-start;
			border-bottom: 1px solid @myblack;
			display: flex;
			flex-direction: column;
			margin: 0;
			margin-inline-start: -5px;
			text-align: left;

			li {
				margin-bottom: 5px;
			}
		}
	}
}
</style>
