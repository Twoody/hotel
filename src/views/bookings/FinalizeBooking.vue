<template>
	<div class="finalize-booking-wrapper">
		<section class="cta-instructions">
			<h2>Finalize Your Booking</h2>
			<p>
				Please complete any outstanding steps to confirm your booking.
			</p>
		</section>

		<div v-if="booking">
			<BookingDetails
				:booking="booking"
			/>

			<section class="finalize-booking">
				<h3 class="form-header">
					Do you have any ...
				</h3>

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
						<span class="input-label">Total Adults:</span>
						<Validatable
							class="user-setting-input"
							:error="displayedErrors.adults || ''"
						>
							<div class="input-wrapper">
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
						<span class="input-label">Cats</span>
						<Validatable
							class="user-setting-input"
							:error="displayedErrors.cats || ''"
						>
							<div class="input-wrapper pets-inputs" >
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
						<span class="input-label">Dogs</span>
						<Validatable
							class="user-setting-input"
							:error="displayedErrors.dogs || ''"
						>
							<div class="input-wrapper pets-inputs">
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
						<span class="input-label">Babies</span>
						<Validatable
							class="user-setting-input"
							:error="displayedErrors.babies || ''"
						>
							<div class="input-wrapper">
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
						<span class="input-label">Toddlers</span>
						<Validatable
							class="user-setting-input"
							:error="displayedErrors.toddlers || ''"
						>
							<div class="input-wrapper">
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
						<span class="input-label">Kids</span>
						<Validatable
							class="user-setting-input"
							:error="displayedErrors.kids || ''"
						>
							<div class="input-wrapper">
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
						<span class="input-label">Special Requests:</span>
						<Validatable
							class="user-setting-input"
							:error="displayedErrors.specialRequests || ''"
						>
							<div class="input-wrapper">
								<textarea v-model="formData.specialRequests"/>
							</div>
						</Validatable>
					</label>

					<div class="booking-summary">
						<div class="labels col">
							<div class="row">
								Check-in Date:
							</div>
							<div class="row">
								Check-out Date:
							</div>
							<div class="row">
								Daily Rate:
							</div>
							<div
								v-if="hasDogs || hasCats"
								class="row"
							>
								Pet fees
							</div>
							<div class="row">
								Cleaning fees:
							</div>
							<div class="row bold">
								Total:
							</div>
						</div>
						<div class="data col">
							<div class="row">
								{{ booking.startDate }}
							</div>
							<div class="row">
								{{ checkOutDate }}
							</div>
							<div class="row">
								{{ dailyRate }}
							</div>
							<div
								v-if="hasDogs || hasCats"
								class="row"
							>
								{{ petFee }}
							</div>
							<div class="row">
								{{ cleaningFee }}
							</div>
							<div class="row bold">
								{{ bookingCost }}
							</div>
						</div>
					</div>

					<!-- Payment Button -->
					<MyButton
						class="pay-button"
						:disabled="isSubmitDisabled"
						:inProgress="isProcessingRequest"
						:sucess="false"
						submit
					>
						Pay Now
					</MyButton>
				</form>
			</section>
		</div>
		<!-- End if booking was found -->

		<div v-else>
			Unable to proceed due to no booking provided by user.
		</div>
	</div>
</template>

<script>
import BookingDetails from "@/views/bookings/BookingDetails.vue"
import Checkbox from "@/components/common/Checkbox.vue"
import { DateTime } from "luxon"

export default {
	name: "FinalizeBooking",
	components: {
		BookingDetails,
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
			isProcessingRequest: false,
			isShowingErrors: false,
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

		/**
		 * Calculate the total booking cost based on nightly rate, cleaning fee, and pet fees.
		 *
		 * @returns {string} Total cost formatted as currency.
		 */
		bookingCost () 
		{
			const nightlyRate = this.$store.state.hotel.dailyRate
			const cleaningFee = this.$store.state.hotel.cleaningFee
			const petFee = this.hasDogs || this.hasCats ? this.$store.state.hotel.petFee : 0
			const daysCost = this.totalNights * nightlyRate

			const totalCost = daysCost + cleaningFee + petFee
			return `$${totalCost}`
		},

		cacheBookingKey () 
		{
			if (!this.bookingID) 
			{
				return ""
			}
			return `bookingFormData-${this.bookingID}`
		},

		/**
		 * Calculate and display the check-out date as the day after the booking's end date.
		 *
		 * @returns {string} Formatted check-out date.
		 */
		checkOutDate () 
		{
			return DateTime.fromISO(this.booking.endDate).plus({
				days: 1, 
			}).toFormat("yyyy-MM-dd")
		},

		cleaningFee () 
		{
			return `$${this.$store.state.hotel.cleaningFee}`
		},

		dailyRate () 
		{
			return `$${this.$store.state.hotel.dailyRate}`
		},

		displayedErrors () 
		{
			if (this.isShowingErrors) 
			{
				return this.errors
			}
			return {}
		},

		errors () 
		{
			let ret = {}

			if (this.formData.adults > 10) 
			{
				ret.adults = "Cannot be larger than 10"
			}
			if (this.formData.adults <= 0) 
			{
				ret.adults = "Cannot be zero"
			}
			if (this.hasCats && (this.formData.cats > 10 || this.formData.cats < 0)) 
			{
				ret.cats = "Must be between 0 and 10"
			}
			if (this.hasDogs && (this.formData.dogs > 10 || this.formData.dogs < 0)) 
			{
				ret.dogs = "Must be between 0 and 10"
			}
			if (this.hasBabies && (this.formData.babies > 10 || this.formData.babies < 0)) 
			{
				ret.babies = "Must be between 0 and 10"
			}
			if (this.hasToddlers && (this.formData.toddlers > 10 || this.formData.toddlers < 0)) 
			{
				ret.toddlers = "Must be between 0 and 10"
			}
			if (this.hasKids && (this.formData.kids > 10 || this.formData.kids < 0)) 
			{
				ret.kids = "Must be between 0 and 10"
			}

			return ret
		},

		isFormValid () 
		{
			return Object.keys(this.errors).length === 0
		},

		isSubmitDisabled () 
		{
			// Only allow one submit at a time
			if (this.isProcessingRequest) 
			{
				return true
			}
			// Allow first click to activate disabled state IFF errors
			if (!this.isShowingErrors) 
			{
				return false
			}
			// Disabled button if form is invalid
			return !this.isFormValid
		},

		petFee () 
		{
			return `$${this.$store.state.hotel.petFee}`
		},

		/**
		 * Calculate the total number of nights between check-in and check-out.
		 *
		 * @returns {number} Total nights of the booking.
		 */
		totalNights () 
		{
			const start = DateTime.fromISO(this.booking.startDate)
			const end = DateTime.fromISO(this.booking.endDate)
			return Math.max(1, end.diff(start, "days").days) // Ensure at least 1 night
		},
	},
	watch: {
		/** Watch for any changes in formData and immediately update local storage. */
		formData: {
			deep: true,
			handler () 
			{
				this.saveFormData()
			},
		},
	},
	methods: {
		/**
		 * Load form data from localStorage.
		 */
		loadSavedFormData () 
		{
			const savedData = localStorage.getItem(this.cacheBookingKey)
			if (savedData) 
			{
				this.formData = JSON.parse(savedData)
			}

			// Set checkboxes so data is shown
			this.hasCats = this.formData.cats > 0
			this.hasDogs = this.formData.dogs > 0
			this.hasBabies = this.formData.babies > 0
			this.hasToddlers = this.formData.toddlers > 0
			this.hasKids = this.formData.kids > 0
		},

		/**
		 * Handle payment action.
		 */
		onPayNow () 
		{
			console.log("User clicked Pay Now for booking:", this.bookingID)
		},

		/**
		 * Save form data to localStorage.
		 */
		saveFormData () 
		{
			localStorage.setItem(this.cacheBookingKey, JSON.stringify(this.formData))
		},

		/**
		 * Validate and submit form.
		 */
		submitBookingDetails () 
		{
			this.isShowingErrors = true
			this.isProcessingRequest = true
			if (!this.isFormValid) 
			{
				this.isProcessingRequest = false
				return false
			}
			console.log("Form submitted successfully!")
			this.isProcessingRequest = false
			return true
		},
	},
}
</script>

<style lang="less">
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

	p {
		font-size: 18px;
		margin-top: 10px;
	}
	.booking-summary {
		align-content: center;
		align-items: center;
		border-bottom: 1px solid black;
		border-top: 1px solid black;
		display: flex;
		flex-direction: row;
		gap: 15px;
		margin-top: 10px;

		.col {
			align-content: center;
			align-items: center;
			display: flex;
			flex: 1;
			flex-direction: column;
			gap: 10px;
		}
		.row {
			flex: 1;
		}
		.data {
			align-items: start;
		}
		.labels {
			align-items: end;
		}
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
		flex-direction: row;
		margin-top: 10px;
		font-weight: bold;
		width: 100%;

		.input-label {
			flex: 1;
		}

		.user-setting-input {
			align-content: center;
			display: flex;
			flex: 1;
			flex-direction: column;
			width: 100%;

			.input-wrapper {
				align-content: center;
				align-items: center;
				display: flex;
				flex-direction: row;
				margin-top: 5px;
				padding: 0;
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
