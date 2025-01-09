<template>
	<div class="user-settings-form-wrapper">
		<div class="form-header">
			<h2>Account Settings</h2>
		</div>

		<form @submit.prevent="submitUpdatedUser" class="user-settings-form">
			<!-- Email -->
			<label class="user-setting-input-wrapper">
				Email:
				<Validatable class="user-setting-input">
					<div class="input-wrapper">
						<input
							type="text"
							:value="currentUser?.email || ''"
							disabled
							class="locked-input inactive"
						>
						<FontAwesomeIcon
							icon="lock"
							class="lock-icon inactive"
						/>
					</div>
				</Validatable>
			</label>

			<!-- Phone -->
			<label class="user-setting-input-wrapper">
				Phone:
				<Validatable class="user-setting-input">
					<div class="input-wrapper">
						<input
							type="text"
							:value="currentUser?.phone || ''"
							disabled
							class="locked-input inactive"
						>
						<FontAwesomeIcon
							icon="lock"
							class="lock-icon inactive"
						/>
					</div>
				</Validatable>
			</label>

			<hr>

			<!-- First Name -->
			<label class="user-setting-input-wrapper">
				First Name:
				<Validatable
					class="user-setting-input"
					:error="displayedFormErrors.firstName || ''"
				>
					<div class="input-wrapper">
						<input
							type="text"
							v-model="formData.first_name"
						>
					</div>
				</Validatable>
			</label>

			<!-- Last Name -->
			<label class="user-setting-input-wrapper">
				Last Name:
				<Validatable
					class="user-setting-input"
					:error="displayedFormErrors.lastName || ''"
				>
					<div class="input-wrapper">
						<input
							type="text"
							v-model="formData.last_name"
						>
					</div>
				</Validatable>
			</label>

			<!-- Display Name -->
			<label class="user-setting-input-wrapper">
				Display Name:
				<Validatable
					class="user-setting-input"
					:error="displayedFormErrors.displayName || ''"
				>
					<div class="input-wrapper">
						<input
							type="text"
							v-model="formData.display_name"
						>
					</div>
				</Validatable>
			</label>

			<!-- Street -->
			<label class="user-setting-input-wrapper">
				Street:
				<Validatable
					class="user-setting-input"
					:error="displayedFormErrors.street || ''"
				>
					<div class="input-wrapper">
						<input
							type="text"
							v-model="formData.street"
						>
					</div>
				</Validatable>
			</label>

			<!-- City -->
			<label class="user-setting-input-wrapper">
				City:
				<Validatable
					class="user-setting-input"
					:error="displayedFormErrors.city || ''"
				>
					<div class="input-wrapper">
						<input
							type="text"
							v-model="formData.city"
						>
					</div>
				</Validatable>
			</label>

			<!-- State -->
			<label class="user-setting-input-wrapper">
				State:
				<Validatable
					class="user-setting-input"
					:error="displayedFormErrors.state || ''"
				>
					<div class="input-wrapper">
						<input
							type="text"
							v-model="formData.state"
						>
					</div>
				</Validatable>
			</label>

			<!-- Zipcode -->
			<label class="user-setting-input-wrapper">
				Zipcode:
				<Validatable
					class="user-setting-input"
					:error="displayedFormErrors.zipcode || ''"
				>
					<div class="input-wrapper">
						<input
							type="text"
							v-model="formData.zipcode"
						>
					</div>
				</Validatable>
			</label>

			<!-- Country -->
			<label class="user-setting-input-wrapper">
				Country:
				<Validatable
					class="user-setting-input"
					:error="displayedFormErrors.country || ''"
				>
					<div class="input-wrapper">
						<input
							type="text"
							v-model="formData.country"
						>
					</div>
				</Validatable>
			</label>

			<div class="submit-button-wrapper">
				<MyButton
					class="submit-button"
					:disabled="isUpdating"
					:in-progress="isUpdating"
					pill
					submit
				>
					Update Account
				</MyButton>
			</div>
		</form>

		<hr class="top-padding" >

		<div class="session-management-wrapper">
			<p>Work in Progress... Check back later</p>
		</div>
	</div>
</template>

<script>
import { updateFirestoreUser } from "@/utils/firestore.js"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import store from "@/store/store.js"

export default {
	name: "AccountSettings",
	components: {
		FontAwesomeIcon,
	},
	data ()
	{
		return {
			formData: {
				city: "",
				country: "",
				display_name: "",
				first_name: "",
				last_name: "",
				state: "",
				street: "",
				zipcode: "",
			},

			isShowingErrors: false,
			isUpdating: false,
		}
	},
	computed: {
		currentUser ()
		{
			return store.state.user.user
		},
		displayedFormErrors ()
		{
			return this.isShowingErrors ? this.errors : {}
		},
		errors ()
		{
			// Add whatever validation logic you need here
			let errors = {}
			errors.firstName = this.formData.first_name
				? ""
				: "User must have a first name"
			errors.lastName = this.formData.last_name
				? ""
				: "User must have a last name"
			errors.phoneNumber = this.currentUser?.phone
				? ""
				: "User must have a phone number"

			// The rest can be optional or also validated similarly
			errors.city = ""
			errors.country = ""
			errors.displayName = ""
			errors.email = ""
			errors.street = ""
			errors.state = ""
			errors.zipcode = ""
			return errors
		},
	},
	created ()
	{
		this.preloadFormData()
	},
	methods: {
		preloadFormData ()
		{
			// Pull user data from the store if available
			if (this.currentUser)
			{
				this.formData.city = this.currentUser.city || ""
				this.formData.country = this.currentUser.country || ""
				this.formData.display_name = this.currentUser.display_name || ""
				this.formData.first_name = this.currentUser.first_name || ""
				this.formData.last_name = this.currentUser.last_name || ""
				this.formData.street = this.currentUser.street || ""
				this.formData.state = this.currentUser.state || ""
				this.formData.zipcode = this.currentUser.zipcode || ""
			}
		},

		/** @returns {void} */
		async submitUpdatedUser ()
		{
			if (this.isUpdating)
			{
				return
			}
			this.isUpdating = true
			try
			{
				const payloadToUpdate = {
					city: this.formData.city,
					country: this.formData.country,
					display_name: this.formData.display_name,
					first_name: this.formData.first_name,
					last_name: this.formData.last_name,
					state: this.formData.state,
					street: this.formData.street,
					zipcode: this.formData.zipcode,
				}

				const result = await updateFirestoreUser(
					this.currentUser,
					payloadToUpdate
				)
				if (result.success)
				{
					alert("User updated successfully!")
					// Once user is updated, get updated user for store
					this.$store.dispatch("updateUserStore")
				}
				else
				{
					console.error("Error updating user:", result.message)
					alert("Failed to update user.")
				}
			}
			catch (error)
			{
				console.error("Exception while updating user:", error)
			}
			finally
			{
				this.isUpdating = false
			}
		},
	},
}
</script>

<style scoped lang="less">
@import "../../../assets/styles/styles";

.user-settings-form-wrapper {
	display: flex;
	flex-direction: column;
	margin-left: 11px;
	margin-right: 11px;

	.user-settings-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		.user-setting-input-wrapper {
			align-items: center;
		}

		label {
			display: flex;
			flex-direction: column;
			font-weight: bold;
			.locked-input {
				cursor: not-allowed;
			}
			.lock-icon {
				cursor: not-allowed;
			}
			.input-wrapper {
				align-items: center;
				display: flex;
				gap: 0.5rem;
				/* The left padding is simply for positioning; adjust as needed. */
				padding-left: 19px;
			}

			input {
				padding: 0.5rem;
				border: 1px solid #ccc;
				border-radius: 5px;
			}

			input.inactive {
				background-color: #f0f0f0;
				color: #999;
			}
		}
	}
	hr {
		border: 1px solid @myblack;
		width: 100%;
	}

	.session-management-wrapper {
		margin-top: 1rem;
	}
	.submit-button-wrapper {
		width: 100%;
		.submit-button {
			max-width: 50%;
		}
	}
	.top-padding {
		margin-top: 30px;
	}
}
</style>
