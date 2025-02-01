<template>
	<div class="finalize-booking-wrapper">
		<section class="cta-instructions">
			<h2>Finalize Your Booking</h2>
			<p>
				Please complete any outstanding steps to confirm your booking.
			</p>
		</section>

		<div v-if="booking">
			<section class="database-details">
				<QuestionAccordion>
					<template #title>
						<h3>Nerdy stuff</h3>
					</template>
					<template #content>
						<p><strong>Booking ID:</strong> {{ bookingID }}</p>
						<p><strong>Guest ID:</strong> {{ booking.guestID }}</p>
					</template>
				</QuestionAccordion>
			</section>

			<section class="finalize-booking">
				<h3>Booking Details</h3>
				<form @submit.prevent="submitBookingDetails">
					<!-- Checkboxes in Two Columns -->
					<div class="checkbox-grid">
						<div class="checkbox-column">
							<Checkbox v-model="hasCats">
								Cats
							</Checkbox>
							<Checkbox v-model="hasDogs">
								Dogs
							</Checkbox>
							<Checkbox v-model="hasBabies">
								Babies
							</Checkbox>
						</div>
						<div class="checkbox-column">
							<Checkbox v-model="hasToddlers">
								Toddlers
							</Checkbox>
							<Checkbox v-model="hasKids">
								Kids
							</Checkbox>
						</div>
					</div>

					<!-- Total Aults -->
					<label class="user-setting-input-wrapper">
						Total Adults:
						<Validatable
							class="user-setting-input"
							:error="errors.Adults"
						>
							<div class="input-wrapper">
								<input
									type="number"
									v-model="formData.Adults"
									required min="1"
								>
							</div>
						</Validatable>
					</label>

					<!-- Pets -->
					<label class="user-setting-input-wrapper">
						Pets:
						<div class="input-wrapper pets-inputs">
							<!-- Only show the Cats number input if hasCats is true -->
							<label v-if="hasCats">
								<input
									v-model="formData.cats"
									type="number"
									min="0"
									max="10"
								>
								Cats
							</label>
							<!-- Only show the Dogs number input if hasDogs is true -->
							<label v-if="hasDogs">
								<input
									v-model="formData.dogs"
									type="number"
									min="0"
									max="10"
								>
								Dogs
							</label>
						</div>
					</label>

					<!-- Babies, Toddlers, Kids -->
					<!-- Only show the Babies input if hasBabies is true -->
					<label class="user-setting-input-wrapper" v-if="hasBabies">
						Babies (0-2 yrs):
						<Validatable class="user-setting-input">
							<div class="input-wrapper">
								<input
									type="number"
									v-model="formData.babies"
									min="0"
									max="10"
								>
							</div>
						</Validatable>
					</label>

					<!-- Only show the Toddlers input if hasToddlers is true -->
					<label class="user-setting-input-wrapper" v-if="hasToddlers">
						Toddlers (2-5 yrs):
						<Validatable class="user-setting-input">
							<div class="input-wrapper">
								<input
									type="number"
									v-model="formData.toddlers"
									min="0"
									max="10"
								>
							</div>
						</Validatable>
					</label>

					<!-- Only show the Kids input if hasKids is true -->
					<label class="user-setting-input-wrapper" v-if="hasKids">
						Kids (6-12 yrs):
						<Validatable class="user-setting-input">
							<div class="input-wrapper">
								<input
									type="number"
									v-model="formData.kids"
									min="0"
									max="10"
								>
							</div>
						</Validatable>
					</label>

					<!-- Special Requests -->
					<label class="user-setting-input-wrapper">
						Special Requests:
						<Validatable
							class="user-setting-input"
							:error="errors.specialRequests"
						>
							<div class="input-wrapper">
								<textarea v-model="formData.specialRequests"/>
							</div>
						</Validatable>
					</label>

					<!-- Submit Form -->
					<button
						type="submit"
						class="save-button"
					>
						Save Details
					</button>
				</form>

				<!-- Payment Button -->
				<button
					class="pay-button"
					@click="onPayNow"
				>
					Pay Now
				</button>
			</section>
		</div>

		<div v-else>
			Unable to proceed due to no booking provided by user.
		</div>
	</div>
</template>

<script>
import Checkbox from "@/components/common/Checkbox.vue"

export default {
	name: "FinalizeBooking",
	components: {
		Checkbox,
	},
	props: {
		booking: {
			required: true,
			type: Object,
		},
	},
	data () {
		return {
			hasCats: false,
			hasDogs: false,
			hasBabies: false,
			hasToddlers: false,
			hasKids: false,
			formData: {
				Adults: 1,
				specialRequests: "",
				cats: 0,
				dogs: 0,
				babies: 0,
				toddlers: 0,
				kids: 0,
			},
			errors: {},
		}
	},
	created () {
		if (this.bookingID) {
			this.loadSavedFormData()
		}
	},
	computed: {
		bookingID () {
			return this.booking.id || ""
		},
		cacheBookingKey () {
			if (!this.bookingID) {
				return ""
			}
			return `bookingFormData-${this.bookingID}`
		},
	},
	methods: {
		/**
		 * @returns {} - Load form data from localStorage
		 */
		loadSavedFormData () {
			const savedData = localStorage.getItem(this.cacheBookingKey)
			if (savedData) {
				this.formData = JSON.parse(savedData)
			}
		},

		/**
		 * @returns {} - Save form data to localStorage
		 */
		saveFormData () {
			localStorage.setItem(this.cacheBookingKey, JSON.stringify(this.formData))
		},

		/**
		 * @returns {} - Validate and submit form
		 */
		submitBookingDetails () {
			this.errors = {}
			if (!this.formData.Adults || this.formData.Adults < 1) {
				this.errors.Adults = "Total adults must be at least 1."
			}

			if (Object.keys(this.errors).length === 0) {
				this.saveFormData()
				alert("Booking details saved successfully!")
			}
		},

		/**
		 * @returns {} - Placeholder for payment integration
		 */
		onPayNow () {
			console.log("User clicked Pay Now for booking:", this.bookingID)
			alert("Redirecting to payment page... (Stripe integration pending)")
		},
	},
}
</script>

<style scoped lang="less">
@import "../../../assets/styles/styles";

.finalize-booking-wrapper {
	background-color: @color-lavendar;
	border-radius: 7px;
	margin: 7px;
	padding: 20px;

	section {
		border-bottom: 1px solid black;
		margin-bottom: 15px;
		padding-bottom: 10px;
	}

	h2, h3 {
		margin: 0;
		padding: 0;
	}
	p {
		font-size: 18px;
		margin-top: 10px;
	}

	/* Grid for the checkboxes in two columns */
	.checkbox-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 10px;
		margin-bottom: 20px;
	}

	.user-setting-input-wrapper {
		display: flex;
		flex-direction: column;
		margin-top: 10px;
		font-weight: bold;

		.input-wrapper {
			margin-top: 5px;
		}

		input, textarea {
			width: 100%;
			padding: 8px;
			border: 1px solid #ccc;
			border-radius: 5px;
		}

		textarea {
			height: 80px;
			resize: none;
		}
	}

	.save-button {
		background: @color-pastel-green;
		border: none;
		border-radius: 4px;
		color: black;
		cursor: pointer;
		margin-top: 10px;
		padding: 10px 20px;
		font-weight: bold;

		&:hover {
			background: darken(@color-pastel-green, 5%);
		}
	}

	.pay-button {
		background: @color-purple;
		border: none;
		border-radius: 4px;
		color: white;
		cursor: pointer;
		margin-top: 10px;
		padding: 10px 20px;
		font-weight: bold;

		&:hover {
			background: darken(@color-purple, 5%);
		}
	}
}
</style>

