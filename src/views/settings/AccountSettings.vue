<template>
	<div class="user-settings-form-wrapper">
		<!-- Example form to update user info -->
		<form
			@submit.prevent="submitUpdatedUser"
			class="user-settings-form"
		>
			<label>
				First Name:
				<Validatable
					class="user-setting-input"
					:error="displayedFormErrors.firstName || ''"
				>
					<input
						type="text"
						v-model="formData.first_name"
					>
				</Validatable>
			</label>

			<label>
				Last Name:
				<Validatable
					class="user-setting-input"
					:error="displayedFormErrors.lastName || ''"
				>
					<input
						type="text"
						v-model="formData.last_name"
					>
				</Validatable>
			</label>

			<label>
				Phone:
				<Validatable
					class="user-setting-input"
					:error="displayedFormErrors.phoneNumber || ''"
				>
					<input
						type="text"
						v-model="formData.phone"
					>
				</Validatable>
			</label>

			<MyButton
				class="submit-button"
				:in-progress="isUpdating"
				pill
				submit
			>
				Update Account
			</MyButton>
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

export default {
	name: "AccountSettings",
	components: {},
	data () 
	{
		return {
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
		/**
		 * You may have a user object stored in Vuex. Adjust accordingly.
		 */
		currentUser () 
		{
			// Adjust to match how your store is shaped
			return store.state.user.user
		},

		/** @returns {object} Return errors object IFF showing errors; Else empty object */
		displayedFormErrors () 
		{
			return this.isShowingErrors
				? this.errors
				: {}
		},

		/**
		 * @returns {object} Return error messages if applicable; Else empty strings.
		 * @since 2.2.3
		 */
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
			// Fill in your delete logic here
		},

		/**
		 * @returns {void} Logout the current user
		 * @since 2.3.0
		 */
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
			// Fill in your password reset logic here
		},

		/**
		 * Handle the form submission to update Firestore user
		 *
		 * @returns {object} successMessage - Whether successful or not, with appropriate message
		 */
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
	},
}
</script>

<style scoped lang="less">
.user-settings-form-wrapper {
	margin-left: 11px;
	margin-right: 11px;

	.user-settings-form {
		align-items: center;
		display: flex;
		flex-direction: column;
		gap: 1rem;

		label {
			display: flex;
			flex-direction: column;
			font-weight: bold;
		}
		input {
			padding: 0.5rem;
			border: 1px solid #ccc;
			border-radius: 5px;
		}
	}

	.submit-button {
		max-width: 50%;
	}
}

.session-management-wrapper {
	margin-top: 1rem;
}
.top-padding {
	margin-top: 30px;
}
</style>
