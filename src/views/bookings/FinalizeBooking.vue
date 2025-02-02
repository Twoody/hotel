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
				<h3 class="form-header">
					Do you have any ...
				</h3>
				<p/>

				<!-- Checkboxes in Two Columns -->
				<div class="checkbox-grid">
					<div class="checkbox-column">
						<Checkbox v-model="hasBabies">
							Babies (0-2 years old)
						</Checkbox>
						<Checkbox v-model="hasToddlers">
							Toddlers (2-5 years old)
						</Checkbox>
						<Checkbox v-model="hasKids">
							Kids (6-12 years old)
						</Checkbox>
					</div>
					<div class="checkbox-column">
						<Checkbox v-model="hasCats">
							Cats
						</Checkbox>
						<Checkbox v-model="hasDogs">
							Dogs
						</Checkbox>
					</div>
				</div>
				<hr>

				<form
					class="form-wrapper"
					@submit.prevent="submitBookingDetails"
				>
					<!-- Total Aults -->
					<label class="user-setting-input-wrapper">
						<Validatable
							class="user-setting-input"
							:error="errors.adults"
						>
							<div class="input-wrapper">
								<span>Total Adults:</span>
								<input
									v-model="formData.adults"
									type="number"
									required min="1"
								>
							</div>
						</Validatable>
					</label>

					<!-- TODO: Have workflow to include place to upload vet records of pet -->
					<!-- Pets -->
					<label
						v-if="hasCats"
						class="user-setting-input-wrapper"
					>
						<Validatable
							class="user-setting-input"
							:error="errors.adults"
						>
							<div class="input-wrapper pets-inputs" >
								<span>Cats</span>
								<input
									v-model="formData.cats"
									type="number"
									min="0"
									max="10"
								>
							</div>
						</Validatable>
					</label>
					<label
						v-if="hasDogs"
						class="user-setting-input-wrapper"
					>
						<Validatable
							class="user-setting-input"
							:error="errors.adults"
						>
							<div class="input-wrapper pets-inputs">
								<span>Dogs</span>
								<input
									v-model="formData.dogs"
									type="number"
									min="0"
									max="10"
								>
							</div>
						</Validatable>
					</label>

					<label class="user-setting-input-wrapper" v-if="hasBabies">
						<Validatable class="user-setting-input">
							<div class="input-wrapper">
								<span>Babies</span>
								<input
									v-model="formData.babies"
									type="number"
									min="0"
									max="10"
								>
							</div>
						</Validatable>
					</label>

					<label class="user-setting-input-wrapper" v-if="hasToddlers">
						<Validatable class="user-setting-input">
							<div class="input-wrapper">
								<span>Toddlers</span>
								<input
									v-model="formData.toddlers"
									type="number"
									min="0"
									max="10"
								>
							</div>
						</Validatable>
					</label>

					<label class="user-setting-input-wrapper" v-if="hasKids">
						<Validatable class="user-setting-input">
							<div class="input-wrapper">
								<span>Kids</span>
								<input
									v-model="formData.kids"
									type="number"
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
	data () 
	{
		return {
			errors: {},
			formData: {
				adults: 1,
				babies: 0,
				cats: 0,
				dogs: 0,
				kids: 0,
				specialRequests: "",
				toddlers: 0,
			},
			hasBabies: false,
			hasCats: false,
			hasDogs: false,
			hasKids: false,
			hasToddlers: false,
		}
	},
	created () 
	{
		if (this.bookingID) 
		{
			this.loadSavedFormData()
		}
	},
	computed: {
		bookingID () 
		{
			return this.booking.id || ""
		},
		cacheBookingKey () 
		{
			if (!this.bookingID) 
			{
				return ""
			}
			return `bookingFormData-${this.bookingID}`
		},
	},
	methods: {
		/**
		 * @returns {} - Load form data from localStorage
		 */
		loadSavedFormData () 
		{
			const savedData = localStorage.getItem(this.cacheBookingKey)
			if (savedData) 
			{
				this.formData = JSON.parse(savedData)
			}

			// Set checkboxes so data is shown
			if (this.formData.cats > 0)
			{
				this.hasCats = true
			}
			if (this.formData.dogs > 0)
			{
				this.hasDogs = true
			}
			if (this.formData.babies > 0)
			{
				this.hasBabies = true
			}
			if (this.formData.toddlers > 0)
			{
				this.hasToddlers = true
			}
			if (this.formData.kids > 0)
			{
				this.hasKids = true
			}
		},

		/**
		 * @returns {} - Save form data to localStorage
		 */
		saveFormData () 
		{
			localStorage.setItem(this.cacheBookingKey, JSON.stringify(this.formData))
		},

		/**
		 * @returns {} - Validate and submit form
		 */
		submitBookingDetails () 
		{
			this.errors = {}
			if (!this.formData.Adults || this.formData.Adults < 1) 
			{
				this.errors.Adults = "Total adults must be at least 1."
			}

			if (Object.keys(this.errors).length === 0) 
			{
				this.saveFormData()
				alert("Booking details saved successfully!")
			}
		},

		/**
		 * @returns {} - Placeholder for payment integration
		 */
		onPayNow () 
		{
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

	.form-header {

	}
	.form-wrapper {
		display: flex;
		flex-direction: column;
	}

	/* Grid for the checkboxes in two columns */
	.checkbox-grid {
		align-content: center;
		justify-items: center;
		align-items: center;
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
		width: 100%;

		.user-setting-input {
			width: 100%;

			.input-wrapper {
				align-items: center;
				display: flex;
				flex-direction: row;
				margin-top: 5px;
				width: 100%;

				span {
					width: -webkit-fill-available;
				}
			}
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

