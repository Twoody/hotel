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
					Load the dishwasher (if needed) upstairs, second
				</li>
				<li>
					Start from top-to-bottom: Window sills, picture frames, ledges, fridge...
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
					<b>If anything is not found while "checking" for it, please let us know ASAP</b>
				</li>
			</ol>
		</div>

		<QuestionAccordion
			v-if="hasDog"
			class="room-list"
		>
			<template #title>
				Special Notes: Living Room
			</template>
			<template #content>
				<ol>
					<li>
						Replace grey/fuzzy comforter with white/gery comforter by laundry machine
					</li>
					<li>
						Move fuzzy pillows out of the airbnb and into our laundry room
					</li>
					<li>
						Move holiday pillow out of the airbnb and into our laundry room
					</li>
					<li>
						Move white-fur throw out of the airbnb and into our laundry room
					</li>
				</ol>
			</template>
		</QuestionAccordion>

		<QuestionAccordion class="room-list">
			<template #title>
				Bathroom
			</template>
			<template #content>
				<ol>
					<li>
						Check the shower curtain for discoloration
						(Spare to just switch out in our laundry room)
					</li>
					<li>
						Check drain for hair/draining
					</li>
					<li>
						Take out trash
					</li>
					<li>
						Restock: Top off hand soap and shower bottles
					</li>
					<li>
						Restock: "linen closet"
						<ul>
							<li>
								Ensure ONLY two towels/washclothes of each size
							</li>
							<li>
								Restock: 2 - 3 toilet paper rolls if needed
							</li>
							<li>
								Restock: Soaps, shampoo, conditioner if needed
							</li>
							<li>
								Restock: Laundry detergent
							</li>
						</ul>
					</li>
					<li>
						Vacuum drawers
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
								Clean sink
							</li>
							<li>
								Clean glass from splash marks
							</li>
							<li>
								Move shower soaps and clean caddy
							</li>
							<li>
								Clean toilet (tighten screws if needed)
							</li>
							<li>
								Clean toilet bowl - Cleaner and brush should be downstairs
							</li>
							<li>
								Shower walls
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
						Strip bed, check for stains
					</li>
					<li>
						Look under bed, bedside drawers, in dresser, and in closet for personal items
					</li>
					<li>
						Check for Pack-and-Play container in closet
					</li>
					<li>
						Check for hangers	
					</li>
					<li>
						Make bed
					</li>
					<li>
						Vacuum out drawers and dresser
					</li>
				</ol>
				<QuestionAccordion class="nested-list">
					<template #title>
						Clean
					</template>
					<template #content>
						<ol>
							<li>
								Wipe down desk
							</li>
							<li>
								Wipe down dresser and drawers
							</li>
							<li>
								Wipe down bedframe
							</li>
						</ol>
					</template>
				</QuestionAccordion>

			</template>
		</QuestionAccordion>

		<QuestionAccordion class="room-list">
			<template #title>
				Dining Room
			</template>
			<template #content>
				<ol>
					<li v-if="hasFlowers">
						Change the water to the flowers; Trim flowers if necessary
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
						Vacuum
					</li>
				</ol>
				<QuestionAccordion class="nested-list">
					<template #title>
						Clean
					</template>
					<template #content>
						<ol>
							<li>
								Check/wipe recycling blue bins (they should have signs on them, too)
							</li>
							<li>
								Dust frames + shelves
							</li>
							<li>
								Clean window sill
							</li>
							<li>
								Clean table + glass 
							</li>
						</ol>
					</template>
				</QuestionAccordion>

			</template>
		</QuestionAccordion>

		<QuestionAccordion class="room-list">
			<template #title>
				Foyer
			</template>
			<template #content>
				<ol>
					<li>
						Check for umbrella hanging on hooks
					</li>
					<li>
						Check for hangers - Take some from the closet if not any
					</li>
					<li>
						Check french doors blinds by sliding open-and-shut.
					</li>
					<li v-if="hasDog">
						Restock:
						<ul>
							<li>
								Poop bags - More in upstairs mudroom by window
							</li>
							<li>
								Dog treats (from upstairs)
							</li>
						</ul>
					</li>
					<li>
						Vacuum:
						<ul>
							<li>
								Dirt/mud catcher
							</li>
							<li>
								Under rugs
							</li>
							<li>
								French Doors liner
							</li>
						</ul>
					</li>
				</ol>
				<QuestionAccordion class="nested-list">
					<template #title>
						Clean
					</template>
					<template #content>
						<ol>
							<li>
								Clean window sill
							</li>
							<li>
								Wipe top of coat rack
							</li>
							<li>
								Clean mirror
							</li>
							<li>
								Clean off bench
							</li>
							<li>
								Clean mirror and french door glass
							</li>
						</ol>
					</template>
				</QuestionAccordion>
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
						Remove MOST food (this is tricky)
					</li>
					<li>
						Restock:
						<ul>
							<li>Top off salt, pepper, oil, vinegar (all found in upstairs kitchen)</li>
							<li>
								Paper towel roll on the kitchen shelf by window
							</li>
							<li>
								Blue kitchen sponge with brand new one
								(sponges in laundry room box with shampoo)
							</li>
							<li>
								Ensure two sets of all dishes
							</li>
						</ul>
					</li>
					<li>
						Take out trash (save for last though)
					</li>
					<li>
						Move trash can and check trash can for spills/messes
					</li>
					<li>
						Vacuum:
						<ul>
							<li>
								Drawers
							</li>
							<li>
								Coffee grinder
							</li>
							<li>
								Inside garbage container if applicable
							</li>
							<li>
								Under island
							</li>
						</ul>
					</li>
				</ol>
				<QuestionAccordion class="nested-list">
					<template #title>
						Clean
					</template>
					<template #content>
						<ol>
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
								Clean coffee machine (pot and inside for used coffee grinds)
							</li>
							<li>
								Clean sink
							</li>
							<li>
								Clean stove + splash pad (aka grease guard)
							</li>
							<li>
								Clean fridge and freezer
							</li>
							<li>
								Clean counters and shelves
							</li>
							<li>
								Clean + organize drawers
							</li>
							<li v-if="hasDog">
								Check dog food bowl, clean if dirty
							</li>
						</ol>
					</template>
				</QuestionAccordion>
				<h3 v-if="hasDog">
					Place dog bowls under counter
				</h3>
			</template>
		</QuestionAccordion>

		<QuestionAccordion class="room-list">
			<template #title>
				Living Room
			</template>
			<template #content>
				<ol>
					<li>
						Check blankets for hair and odor; Wash if found
					</li>
					<li>
						Fold up blankets and place in basket
					</li>
					<li>
						Check for fan remote and that it works
					</li>
					<li>
						Assist with robot vacuum if unplugged/off base
					</li>
					<li>
						Empty robot vacuum dust bin
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
						Check ottoman mattress and inside ottoman
					</li>
					<li>
						Vacuum:
						<ul>
							<li>
								Furniture
							</li>
							<li>
								Rug
							</li>
							<li>
								Under rug to best of ability
							</li>
							<li>
								Fan base
							</li>
							<li>
								Couch (Fold down)
							</li>
							<li>
								Chair pad
							</li>
						</ul>
					</li>
					<li v-if="hasDog">
						Put dog bed by heater (<b>not blocking heater</b>)
					</li>
					<li v-if="hasDog">
						Put dog toys on dog bed
					</li>
					<li v-if="hasDog">
						Put dog pillow on dog bed
					</li>
				</ol>
				<QuestionAccordion class="nested-list">
					<template #title>
						Clean
					</template>
					<template #content>
						<ol>
							<li>
								Clean table stand
							</li>
							<li>
								Clean chair
							</li>
							<li>
								Clean couch
							</li>
							<li>
								Clean ottoman
							</li>
							<li>
								Clean firplace mantle
							</li>
						</ol>
					</template>
				</QuestionAccordion>

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
					<li>
						Gate is latched from the street
					</li>
					<li>
						Gate is unlatched from the inside
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
						In general, wipe everything down and vacuum
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

export default {
	name: "AirbnbCleaning",
	components: {},
	data () 
	{
		return {
			hasDog: true,
			hasFlowers: true,
		}
	},
	methods: 
	{},
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

	.foobar {
		max-width: @maxwidth;
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
