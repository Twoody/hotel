<template>
	<div class="setting-page-wrapper">
		<h1>Settings</h1>
		<!-- If firebase auth is instantiated but user is not logged in -->
		<div v-if="isAuthReady && !isLoggedIn">
			Currently not logged in; Please visit
			<router-link
				class="nav-item"
				to="/login"
			>
				the login page
			</router-link>.
		</div>

		<!-- Show user settings if authentication has been checked and the user is logged in -->
		<div v-else-if="isAuthReady && isLoggedIn">

			<div class="user-settings-form-wrapper">
				<!-- Example form to update user info -->
				<form
					@submit.prevent="submitUpdatedUser()"
					class="user-settings-form"
				>
					<label>
						First Name:
						<Validatable
							class="user-setting-input"
							:error="diplayedFormErrors.firstName || ''"
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
							:error="diplayedFormErrors.lastName || ''"
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
							:error="diplayedFormErrors.phone || ''"
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
			</div>
			<!-- End user-settings-form-->

			<hr class="top-padding">

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
				<p>
					Work in Progress... Check back later
				</p>
			</div>
		</div>

	</div>
</template>

<script>
import { getAuth, signOut } from "firebase/auth"
import store from "@/store/store.js"

// Import our newly finished updateFirestoreUser function
import { updateFirestoreUser } from "@/utils/firestore.js"

export default {
	name: "UserSettings",
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
			isUpdating: false, // optional for button's "in-progress" state
		}
	},
	computed: {

		/** @returns {object} Return errors object IFF showing errors; Else empty object */
		diplayedFormErrors () 
		{
			if (this.isShowingErrors)
			{
				return this.errors
			}
			return {}
		},

		/**
		 * @returns {object} Return error messages if applicable; Else empty strings.
		 * @since 2.2.3
		 */
		errors () 
		{
			let errors = {}

			errors.firstName = this.formData.first_name ? "" : "User must have a first name"
			return errors
		},

		/**
		 * @returns {boolean} - Whether auth state has finished checking
		 */
		isAuthReady ()
		{
			return store.state.user.isAuthReady
		},
		/**
		 * @returns {boolean} - Whether a user is logged in or not
		 */
		isLoggedIn ()
		{
			return store.state.user.isLoggedIn
		},
		/**
		 * You may have a user object stored in Vuex. Adjust accordingly.
		 */
		currentUser ()
		{
			return store.state.user
		},
	},
	methods: {
		/**
		 * Handle the form submission to update Firestore user
		 * @returns {object} successMessage - Whether successful or not, with appropriate message
		 */
		async submitUpdatedUser ()
		{
			console.log('called')
			// If already saving, do nothing
			if (this.isUpdating)
			{
				return
			}
			this.isUpdating = true

			try
			{
				const payloadToUpdate = {
					// Only pass the fields you want to update in Firestore
					first_name: this.formData.first_name,
					last_name: this.formData.last_name,
					phone: this.formData.phone,
				}
				
				const result = await updateFirestoreUser(this.currentUser, payloadToUpdate)

				if (result.success)
				{
					alert("User updated successfully!")
					// Optionally reset the form or do a fresh read
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
		 * Logout the current user
		 */
		async logout ()
		{
			// Avoid re-entrance
			if (this.isLoggingOut)
			{
				return
			}

			this.isLoggingOut = true
			try
			{
				const auth = getAuth()
				await signOut(auth)
			}
			catch (error)
			{
				console.error(error)
			}

			// Update store
			store.dispatch("logoutUser")

			// Release
			this.isLoggingOut = false

			// Redirect
			this.$router.push({
				path: "/",
			})
		},
	},
}
</script>

<style scoped lang="less">
@import "../../assets/styles/styles";

.setting-page-wrapper {
	.top-padding {
		margin-top: 30px;
	}

	background-color: @color-purple !important;
	border-radius: 7px;
	height: auto;
	margin-top: 7px;
	width: 100%;
	max-width: min(98%, 660px);

	h1 {
		border-bottom: 1px solid @myblack;
	}

	p {
		font-size: 25px;
	}
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
	}

	.submit-button {
		max-width: 50%;
	}
}
</style>
