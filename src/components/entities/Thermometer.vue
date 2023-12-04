<template>
	<div class="thermometer flex-box">
		<div>
			<div class="tube">
				<!-- Main ten percent notches -->
				<div
					class="notches flex-box"
					v-for="n in 9"
					:key="n"
				>
					<div
						class="notch"
						:style="{ bottom: (n * 10) + '%' }"
					/>
					<span
						class="notch-label"
						:style="{ bottom: ((n * 10) - 2) + '%', left: '58px' }"
					>
						{{n * 10}}
					</span>
				</div>

				<!-- Secondary 5 percent notches -->
				<div
					v-for="n in 19"
					:key="n"
				>
					<div
						v-if="n % 2 !== 0"
						class="notches flex-box"
					>
						<div
							class="notch small-notch"
							:style="{ bottom: (n * 5) + '%', right:'40px' }"
						/>
						<span
							class="notch-label"
							:style="{ bottom: ((n * 5) - 2) + '%', right: '58px' }"
						>
							{{n * 5}}
						</span>
					</div>
				</div>

				<div
					class="mercury"
					:style="{ height: currentPercent + '%' }"
				/>
			</div>
		</div>
		<span v-text="currentPercent + '%'" />
	</div>
</template>

<script>
export default {
	name: "Thermometer",
	props:
	{
		currentAmount:
		{
			default: 0,
			required: false,
			type: Number,
		},
		maxAmount:
		{
			default: 0,
			required: false,
			type: Number,
		},
	},
	computed:
	{
		/** @returns {number} */
		currentPercent ()
		{
			if (!this.currentAmount || !this.maxAmount)
			{
				return 0
			}
			if (this.currentAmount > this.maxAmount)
			{
				return 100
			}
			const percent = this.currentAmount/this.maxAmount*100
			return percent.toFixed(2)
		},
	},
}
</script>

<style>
.thermometer {
  /* Style for thermometer container */
	width: 100px; /* Adjusted to give space for notches */
	display: flex;
	justify-content: center;

	.tube {
		/* Style for the tube of the thermometer */
		background-color: #eee;
		border: 1px black solid;
		border-radius: 110px;
		height: 600px;
		position: relative;
		width: 50px;
	}

	.mercury {
		/* Style for the mercury inside the thermometer */
		background-color: red; /* Mercury color */
		border-bottom-right-radius: 30px;
		border-bottom-left-radius: 30px;
		bottom: 0;
		position: absolute;
		width: 100%;
		z-index: 1;
	}

	.notches {
		.notch {
			/* Style for the notches */
			border-top: 1px solid black; /* Example notch style */
			position: absolute;
			width: 100%;
			z-index: 2;
			&.small-notch {
				width: 20%;
			}
		}
		.notch-label {
			z-index: 2;
			position: absolute;
		}
	}

}
</style>
