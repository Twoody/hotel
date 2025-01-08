<template>
	<div class="user-settings-form-wrapper">
		<!-- Example form to update user info -->
		<form @submit.prevent="submitUpdatedUser" class="user-settings-form">
			<label
				class="user-setting-input-wrapper"
			>
				First Name:
				<Validatable
					class="user-setting-input"
					:error="displayedFormErrors.firstName || ''"
				>
					<div class="input-wrapper">
						<input
							type="text"
							v-model="formData.first_name"
							:disabled="!editStates.firstName"
							:class="{ inactive: !editStates.firstName }"
						>
						<FontAwesomeIcon
							icon="pencil-alt"
							:class="{ active: editStates.firstName, inactive: !editStates.firstName }"
							@click="toggleEdit('firstName')"
						/>
					</div>
				</Validatable>
			</label>

			<label
				class="user-setting-input-wrapper"
			>
				Last Name:
				<Validatable
					class="user-setting-input"
					:error="displayedFormErrors.lastName || ''"
				>
					<div class="input-wrapper">
						<input
							type="text"
							v-model="formData.last_name"
							:disabled="!editStates.lastName"
							:class="{ inactive: !editStates.lastName }"
						>
						<FontAwesomeIcon
							icon="pencil-alt"
							:class="{ active: editStates.lastName, inactive: !editStates.lastName }"
							@click="toggleEdit('lastName')"
						/>
					</div>
				</Validatable>
			</label>

			<label
				class="user-setting-input-wrapper"
			>
				Phone:
				<Validatable
					class="user-setting-input"
					:error="displayedFormErrors.phoneNumber || ''"
				>
					<div class="input-wrapper">
						<input
							type="text"
							v-model="formData.phone"
							:disabled="!editStates.phone"
							:class="{ inactive: !editStates.phone }"
						>
						<FontAwesomeIcon
							icon="pencil-alt"
							:class="{ active: editStates.phone, inactive: !editStates.phone }"
							@click="toggleEdit('phone')"
						/>
					</div>
				</Validatable>
			</label>

			<div class="submit-button-wrapper">
				<MyButton
					class="submit-button"
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
			/**
			 * Control active/inactive state of input elements
			 */
			editStates: {
				firstName: false,
				lastName: false,
				phone: false,
			},

			formData: {
				first_name: "",
				last_name: "",
				phone: "",
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
			let errors = {}
			errors.firstName = this.formData.first_name ? "" : "User must have a first name"
			errors.lastName = this.formData.last_name ? "" : "User must have a last name"
			errors.phoneNumber = this.formData.phone ? "" : "User must have a phone number"
			return errors
		},
	},
	methods: {
		/** @returns {void}  */
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
					first_name: this.formData.first_name,
					last_name: this.formData.last_name,
					phone: this.formData.phone,
				}
				const result = await updateFirestoreUser(this.currentUser, payloadToUpdate)
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

		/**
		 * @param field
		 * @since 2.3.0
		 */
		toggleEdit (field) 
		{
			this.editStates[field] = !this.editStates[field]
		},
	},
}
</script>

<style lang="less">
.user-settings-form-wrapper {
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

			.input-wrapper {
				align-items: center;
				display: flex;
				gap: 0.5rem;
				/* Padding is simply matching the width of the pencil icon */
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

			.fa-pencil-alt {
				cursor: pointer;
				padding: 0.2rem;
				border-radius: 5px;
			}

			.fa-pencil-alt.active {
				background-color: #f7e9f3;
			}

			.fa-pencil-alt.inactive {
				background-color: #e9f7f1;
			}
		}
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
