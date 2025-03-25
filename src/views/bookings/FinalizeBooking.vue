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
					<div class="guests-wrapper">
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
										required
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
					</div>

					<div class="booking-summary">
						<div class="row">
							<div class="label col">
								Check-in Date:
							</div>
							<Validatable
								class="data col"
								:error="displayedErrors.startDate || ''"
							>
								<input
									type="date"
									v-model="formData.startDate"
									@input="handleStartDate"
									class="date-input"
									:max="maxStartDate"
									:min="minStartDate"
								>
							</Validatable>
						</div>

						<div class="row">
							<div class="label col">
								Check-out Date:
							</div>
							<Validatable
								class="data col"
								:error="displayedErrors.endDate || ''"
							>
								<!-- Checkout date is not end date -->
								<input
									type="date"
									v-model="formData.endDate"
									@input="handleEndDate"
									class="date-input"
									:max="maxEndDate"
									:min="minEndDate"
								>
							</Validatable>
						</div>

						<div class="row">
							<div class="label col">
								Daily Rate:
							</div>
							<div class="data col">
								{{ dailyRate }}
							</div>
						</div>

						<div
							v-if="hasDogs || hasCats"
							class="row"
						>
							<div class="label col">
								Pet fees
							</div>
							<div class="data col" >
								{{ petFee }}
							</div>
						</div>

						<div class="row">
							<div class="label col">
								Cleaning fees:
							</div>
							<div class="data col">
								{{ cleaningFee }}
							</div>
						</div>

						<div class="row">
							<div class="label col bold">
								Total:
							</div>
							<div class="data col bold">
								{{ bookingCost }}
							</div>
						</div>
					</div>
					<!-- End booking-summary -->

					<!-- Payment Button -->
					<Validatable
						class=""
						:error="displayedErrors.paymentButton || ''"
					>
						<MyButton
							class="pay-button"
							:disabled="isSubmitDisabled"
							:inProgress="isProcessingRequest"
							:sucess="false"
							submit
						>
							Pay Now
						</MyButton>
					</Validatable>
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
import { getBookingStatus } from "@/utils/misc.js"
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
	emits: [
		"update:booking",
	],
	data ()
	{
		return {
			formData: {
				adults: 1,
				babies: 0,
				cats: 0,
				dogs: 0,
				endDate: null,
				kids: 0,
				specialRequests: "",
				startDate: null,
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
			this.formData.endDate = this.booking.endDate
			this.formData.startDate = this.booking.startDate
		}
		if (this.isBookingInThePast)
		{
			this.isShowingErrors = true
		}
	},
	computed: {
		/**
		 * Calculate the total booking cost based on nightly rate, cleaning fee, and pet fees.
		 *
		 * @returns {string} Total cost formatted as currency.
		 */
		bookingCost ()
		{
			if (!this.totalNights)
			{
				return "-"
			}

			const nightlyRate = this.$store.state.hotel.dailyRate
			const cleaningFee = this.$store.state.hotel.cleaningFee
			const petFee = this.hasDogs || this.hasCats ? this.$store.state.hotel.petFee : 0
			const daysCost = this.totalNights * nightlyRate

			const totalCost = daysCost + cleaningFee + petFee
			return `$${totalCost}`
		},

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
			else if (this.formData.adults <= 0)
			{
				ret.adults = "Cannot be zero"
			}
			if (this.hasCats && (this.formData.cats > 10 || this.formData.cats <= 0))
			{
				ret.cats = "Must be between 1 and 10"
			}
			if (this.hasDogs && (this.formData.dogs > 10 || this.formData.dogs <= 0))
			{
				ret.dogs = "Must be between 1 and 10"
			}
			if (this.hasBabies && (this.formData.babies > 10 || this.formData.babies <= 0))
			{
				ret.babies = "Must be between 1 and 10"
			}
			if (this.hasToddlers && (this.formData.toddlers > 10 || this.formData.toddlers <= 0))
			{
				ret.toddlers = "Must be between 1 and 10"
			}
			if (this.hasKids && (this.formData.kids > 10 || this.formData.kids <= 0))
			{
				ret.kids = "Must be between 1 and 10"
			}
			// TODO: if endDate is too far in the future
			// if (formData.endDate is one year from today) {
			//		ret.endDate = 'End date is too far in the future''
			// }

			if (!this.formData.endDate)
			{
				ret.endDate = "No check-out date"
			}

			if (!this.formData.startDate)
			{
				ret.startDate = "No check-in date"
			}

			if (this.isBookingInThePast)
			{
				ret.paymentButton = "Start date no longer available"
			}

			return ret
		},

		/** @since 2.5.0 */
		isBookingInThePast ()
		{
			  const singleDateBooking = {
				...this.booking,
				endDate: this.booking.startDate,
			}

			singleDateBooking.endDate = this.booking.startDate
			const bookingStatus = getBookingStatus(singleDateBooking)
			if (bookingStatus === "Past")
			{
				return true
			}
			return false
		},

		/** @since 2.5.0 */
		isFormValid ()
		{
			return Object.keys(this.errors).length === 0
		},

		/** @since 2.5.0 */
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
			return !this.isFormValid || this.isBookingInThePast
		},

		maxEndDate ()
		{
			return this.oneYearFromTodayISO
		},

		maxStartDate ()
		{
			return this.oneYearFromTodayISO
		},

		minEndDate ()
		{
			if (this.formData.startDate)
			{
				// Enforce at least 1 day after start date
				return DateTime.fromISO(this.formData.startDate)
					.plus({
						days: 1,
					}).toISODate()
			}
			return this.todayISO

		},

		minStartDate ()
		{
			return this.todayISO // The start date must be today or later
		},

		// Get the date one year from today
		oneYearFromTodayISO ()
		{
			return DateTime.now().plus({
				years: 1,
			}).toISODate()
		},

		petFee ()
		{
			return `$${this.$store.state.hotel.petFee}`
		},

		todayISO ()
		{
			return DateTime.now().toISODate() // Get today's date in ISO format (YYYY-MM-DD)
		},

		/**
		 * Calculate the total number of nights between check-in and check-out.
		 *
		 * @returns {number} Total nights of the booking.
		 */
		totalNights ()
		{
			if (!this.formData.startDate || !this.formData.endDate)
			{
				return NaN
			}

			const start = DateTime.fromISO(this.formData.startDate).startOf("day")
			const end = DateTime.fromISO(this.formData.endDate).startOf("day")

			// Compute difference correctly & ensure at least 1 night
			const nights = Math.ceil(end.diff(start, "days").days)

			return nights > 0 ? nights : 1 // Prevent 0 or negative values
		},

	},
	watch: {
		/**
		 * Watch for any changes in formData and immediately update local storage and `booking`
		 *
		 * @since 2.5.0
		 */
		formData: {
			deep: true,
			handler ()
			{
				if (this.isFormValid)
				{
					this.saveFormData()
				}
			},
		},

		/**
		 * Watchers to reset formData values when a checkbox is unchecked
		 *
		 * @param newValue
		 */
		hasBabies (newValue) 
		{
			if (!newValue) 
			{
				this.formData.babies = 0
			}
		},
		hasCats (newValue) 
		{
			if (!newValue) 
			{
				this.formData.cats = 0
			}
		},
		hasDogs (newValue) 
		{
			if (!newValue) 
			{
				this.formData.dogs = 0
			}
		},
		hasKids (newValue) 
		{
			if (!newValue) 
			{
				this.formData.kids = 0
			}
		},
		hasToddlers (newValue) 
		{
			if (!newValue) 
			{
				this.formData.toddlers = 0
			}
		},
	},
	methods: {
		handleEndDate (event)
		{
			const selectedDate = event.target.value
			if (selectedDate <= this.todayISO
				|| selectedDate < this.formData.startDate
				|| selectedDate > this.oneYearFromTodayISO
			)
			{
				// Do not update due to bad selection
				return
			}
			this.formData.endDate = selectedDate
			this.$emit("update:booking", {
				...this.booking,
				endDate: selectedDate,
			})
		},

		handleStartDate (event)
		{
			const selectedDate = event.target.value
			if (selectedDate <= this.todayISO
				|| selectedDate > this.maxStartDate
				|| selectedDate > this.oneYearFromTodayISO
			)
			{
				// Do not update due to bad selection
				return
			}
			if (this.formData.endDate && selectedDate >= this.formData.endDate)
			{
				this.formData.endDate = null
			}
			this.formData.startDate = selectedDate
			this.$emit("update:booking", {
				...this.booking,
				startDate: selectedDate,
			})
		},

		/**
		 * Load form data from localStorage.
		 *
		 * @since 2.5.0
		 */
		loadSavedFormData ()
		{
			const savedData = localStorage.getItem(this.cacheBookingKey)
			if (savedData)
			{
				this.formData = JSON.parse(savedData)
			}
			this.formData.endDate = this.booking.endDate
			this.formData.startDate = this.booking.startDate

			// Set checkboxes so data is shown
			this.hasCats = this.formData.cats > 0
			this.hasDogs = this.formData.dogs > 0
			this.hasBabies = this.formData.babies > 0
			this.hasToddlers = this.formData.toddlers > 0
			this.hasKids = this.formData.kids > 0
		},

		/**
		 * Save form data to localStorage.
		 *
		 * @since 2.5.0
		 */
		saveFormData ()
		{
			localStorage.setItem(this.cacheBookingKey, JSON.stringify(this.formData))
		},

		/**
		 * Validate and submit form.
		 *
		 * @returns {boolean} Success of the booking being processed or not
		 * @since 2.5.0
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
			console.info("Form submitted successfully!")
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
	.date-input {
		width: auto;
		padding: 11px;
		border: 1px solid #ccc;
		border-radius: 5px;
	}

	.booking-summary {
		align-content: center;
		align-items: center;
		border-bottom: 1px solid black;
		border-top: 1px solid black;
		display: flex;
		flex-direction: column;
		gap: 7px;
		padding-top: 6px;

		.col {
			flex: 1;
		}
		.row {
			align-content: center;
			align-items: center;
			display: flex;
			flex: 1;
			flex-direction: row;
			gap: 20px;
			width: 100%;
		}
		.data {
			text-align: left;
		}
		.label {
			text-align: right;
			align-items: center;
		}
	}
	.form-header {

	}
	.form-wrapper {
		.guests-wrapper {
			display: flex;
			flex-direction: column;
			padding-bottom: 7px;
		}
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
