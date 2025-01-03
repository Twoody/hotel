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
			<div class="settings-tabs-wrapper">
				<Filters
					:filters="settingTabs"
					@update="handleTabNavigation($event)"
				/>
			</div>

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
							:error="displayedFormErrors.phone || ''"
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
import { signOut } from "firebase/auth"
import { logEvent } from "firebase/analytics"
import { firebaseAuth, firebaseAnalyics } from "@/firebase" // using the pre-initialized db
import store from "@/store/store.js"

// Import our newly finished updateFirestoreUser function
import { updateFirestoreUser } from "@/utils/firestore.js"

export default {
	name: "UserSettings",
	data ()
	{
		return {
			activeTab: {},
			availableTabs: {
				0: {
					active: false,
					id: 0,
					title: "Account",
				},
				1: {
					active: false,
					id: 1,
					title: "Profile",
				},
				2: {
					active: false,
					id: 2,
					title: "Privacy + Security",
				},
			},
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
	computed:
	{
		/**
		 * You may have a user object stored in Vuex. Adjust accordingly.
		 */
		currentUser ()
		{
			return store.state.user.user
		},

		/** @returns {object} Return errors object IFF showing errors; Else empty object */
		displayedFormErrors () 
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
			errors.lastName = this.formData.last_name ? "" : "User must have a last name"
			errors.phoneNumber = this.formData.phone_number ? "" : "User must have a phone number"
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
		 * @returns {Array} List of the tabs user can visit to view/edit account information
		 */
		settingTabs () 
		{
			const ret = []

			for (let id in this.availableTabs)
			{
				const iteratedTab = this.availableTabs[id]
				let formattedTab = {}

				formattedTab.id = iteratedTab.id
				formattedTab.title = iteratedTab.title

				// TODO: See if tab is active or not
				formattedTab.active = false

				ret.push(formattedTab)
			}
			return ret
		},

	},
	created () 
	{
		const queryTab = this.getFromQueryString("active-tab")
	},
	methods: {
		/**
		 * @param key
		 */
		getFromQueryString (key)
		{
			console.log("key: ", key)
		},

		/**
		 * @param id
		 */
		handleTabNavigation (id) 
		{
			const ID = id * 1
			let activeStatus = this.availableTabs[ID].active
			this.availableTabs[ID].active = ! activeStatus

			// Send event to GA
			try
			{
				const eventTitle = "settings_tab_navigation"
				logEvent(
					firebaseAnalyics,
					eventTitle,
					{
						value: this.availableTabs[id].title || "NOT_FOUND",
					}
				)
			}
			catch (e)
			{
				console.error(e)
			}

			this.activeTab = this.availableTabs[ID]
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
				await signOut(firebaseAuth)
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

		/**
		 * Handle the form submission to update Firestore user
		 *
		 * @returns {object} successMessage - Whether successful or not, with appropriate message
		 */
		async submitUpdatedUser ()
		{
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
