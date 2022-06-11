<template>
	<button
		class="my-button-wrapper"
		:class="classes"
		:disabled="inProgress"
		:type="typeButton? 'button' : 'submit'"
		@animationend="onShakeEnd()"
		@click.stop="onClick()"
	>
		<div
			v-if="badgeContent"
			class="badge"
		>
			{{ badgeContent }}
		</div>

		<div :class="fill">
			<Spinner v-if="inProgress" />
			<font-awesome-icon
				v-if="success"
				check-color="white"
				class="check-icon"
				:icon="['fa', 'check']"
			/>
		</div>

		<div class="fill">
			<slot/>
		</div>

	</button>
</template>

<script>
import Spinner from "@/components/common/loading/Spinner"

export default
{
	name: "MyButton",
	components: {
		Spinner,
	},
	props:
	{
		active: Boolean,
		badgeContent: String,
		disabled: Boolean,
		inProgress: Boolean,
		noShrink: Boolean,
		success: Boolean,
		type: String,
		// To be read as, "This buttons type is 'button' (vs submit or reset)"
		typeButton: Boolean,
		wire: Boolean,
	},
	data ()
	{
		return {
			// Is the button currently in the shake animation?
			shaking: false,
		}
	},
	computed:
	{
		/**
		 * @returns {object} classes -- Object of applied css classes and rules
		 */
		classes ()
		{
			const classes = {
				button: true,
			}
			classes.active = this.active
			classes.disabled = this.disabled
			classes.progress = this.inProgress
			classes.success = this.success
			classes.shake = this.shaking
			classes.wire = this.wire
			classes["btn-" + (this.type || "primary")] = true

			return classes
		},

		/** @returns {string} CSS class to determine size of button and filler space */
		fill ()
		{
			if (!this.isButtonText || this.noShrink)
			{
				return "fill"
			}
			return "shrink"

		},

		/** @returns {boolean} True if there is content in the slot */
		isButtonText ()
		{
			return !!this.$slots.default
		},
	},
	methods:
	{
		// Begin the shaking animaion
		beginShake ()
		{
			this.shaking = true
		},

		// The user wants to click the button. Propogate event if button is not disabled.
		onClick ()
		{
			if (this.disabled)
			{
				// Button is disabled: play animation and send event
				this.beginShake()
				event.preventDefault()
				this.$emit("click-prevented")
			}
			else
			{
				// Send click event as normal
				this.$emit("click")
			}
		},

		// Reset the shake class so the button can shake again
		onShakeEnd ()
		{
			this.shaking = false
		},
	},
}
</script>

<style scoped lang="less">
.my-button-wrapper {
	position: relative;
	border: none;
	outline: none;
	cursor: pointer;
	border-radius: 12px;
	width: 100%;
	min-height: 52px;
	font-size: 18px;
	user-select: none;

	.badge {
		@diameter: 22px;
		@radius: calc(@diameter / 2);
		align-items: center;
		background: red;
		border: none;
		border-radius: 50%;
		color: #FFFFFF;
		display: flex;
		font-size: 12px;
		height: @diameter;
		justify-content: center;
		position: absolute;
		right: calc(@radius * -1);
		top: calc(@radius * -1);
		transition: all .3s;
		width: @diameter;
		z-index: 100; 
	}

	/* Hide over on the left */
	.shrink {
		position: absolute;
		left: 30px;
		top: 50%;
		transform: translateY(-50%);
	}

	/* Display in the center */
	.fill {
		width: 100%;
		text-align: center;
	}

	&.wire {
		border-radius: 8px;
	}

	&.success
	{
		line-height: 20px;
	}

	&.progress {
		text-align: center;
		cursor: wait;
	}

	&.disabled {
		cursor: not-allowed;
	}
}

.shake {
	animation: shake 1s;
}

@keyframes shake {
	10%, 90% {
		transform: translate3d(-1px, 0, 0);
	}

	20%, 80% {
		transform: translate3d(2px, 0, 0);
	}

	30%, 50%, 70% {
		transform: translate3d(-4px, 0, 0);
	}

	40%, 60% {
		transform: translate3d(4px, 0, 0);
	}
}
</style>

