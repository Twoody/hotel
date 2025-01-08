<template>
	<div class="user-settings-form-wrapper">
		<!-- Example form to update user info -->
		<form @submit.prevent="submitUpdatedUser" class="user-settings-form">
			<label
				class='user-setting-input-wrapper'
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
				class='user-setting-input-wrapper'
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
				class='user-setting-input-wrapper'
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

			<div class='submit-button-wrapper'>
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

		<!-- Reset Password -->
		<div class="session-management-wrapper">
			<MyButton
				class="user-logout"
				:in-progress="isLoggingOut"
				pill
				disabled
				@click="resetUserPassword"
			>
				Reset Password
			</MyButton>
		</div>

		<hr >

		<!-- Logout -->
		<div class="session-management-wrapper">
			<MyButton
				class="user-logout"
				:in-progress="isLoggingOut"
				pill
				@click="logout"
			>
				Logout
			</MyButton>
		</div>

		<hr >

		<!-- Delete Account -->
		<div class="session-management-wrapper">
			<MyButton
				class="user-logout"
				:in-progress="isLoggingOut"
				pill
				disabled
				@click="deleteUserAccount"
			>
				Delete Account
			</MyButton>
		</div>

		<hr >

		<div class="session-management-wrapper">
			<p>Work in Progress... Check back later</p>
		</div>
	</div>
</template>

<script>
import { signOut } from "firebase/auth"
import { firebaseAuth } from "@/firebase"
import { updateFirestoreUser } from "@/utils/firestore.js"
import store from "@/store/store.js"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

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

			isLoggingOut: false,
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
		deleteUserAccount () 
		{
			console.log("Delete user account clicked (TODO).")
		},

		async logout () 
		{
			if (this.isLoggingOut) 
			{
				return
			}
			this.isLoggingOut = true
			try 
			{
				await signOut(firebaseAuth)
				store.dispatch("logoutUser")
				this.$router.push({
					path: "/",
				})
			}
			catch (error) 
			{
				console.error(error)
			}
			finally 
			{
				this.isLoggingOut = false
			}
		},

		resetUserPassword () 
		{
			console.log("Reset password clicked (TODO).")
		},

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

<style scoped lang="less">
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
				display: flex;
				align-items: center;
				gap: 0.5rem;
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

	.submit-button-wrapper {
		width: 100%;
		.submit-button {
			max-width: 50%;
		}
	}
}

.session-management-wrapper {
	margin-top: 1rem;
}
.top-padding {
	margin-top: 30px;
}
</style>
