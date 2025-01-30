<template>
	<div class="user-settings-security-tab-wrapper">
		<h2>Privacy + Security Tab</h2>

		<!-- Reset Password -->
		<div class="session-management-wrapper">
			<Validatable
				class="input-wrapper"
				:error="resetUserMessage"
				:showError="resetUserMessage?.length"
			>
				<MyButton
					class="user-action"
					data-testid="button-user-action-password-reset"
					:disabled="canResetPassword === false"
					:in-progress="isResetingPassword"
					:success="showingResetSuccess"
					pill
					@click="resetUserPassword"
				>
					Reset Password
				</MyButton>
			</Validatable>
		</div>

		<hr >

		<!-- Logout -->
		<div class="session-management-wrapper">
			<MyButton
				class="user-action"
				data-testid="button-user-action-logout"
				:disabled="isLoggingOut"
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
				class="user-action"
				data-testid="button-user-action-delete-account"
				:in-progress="isLoggingOut"
				pill
				:disabled="canDeleteAccount === false"
				@click="openDeleteModal"
			>
				Delete Account
			</MyButton>
		</div>

		<hr >

		<div class="session-management-wrapper">
			<p>
				Here you could add 2FA toggles, data download requests,
				or privacy preference toggles.
			</p>
		</div>

		<!-- Modal for Delete Account -->
		<DialogModal
			class="delete-modal-overlay"
			:backgroundColor="&quot;#f7e9f3&quot;"
			:bodyColor="&quot;#f7e9f3&quot;"
			:footerColor="&quot;#f7e9f3&quot;"
			:headerColor="&quot;#f7e9f3&quot;"

			:closeButtonLabel="'Cancel'"
			:visible="showDeleteModal"
			@close="closeDeleteModal"
		>
			<template #title>
				<h3>Are you sure you want to delete your account?</h3>
			</template>
			<template #body>
				<p>Please enter your email to confirm:</p>

				<label class="user-setting-input-wrapper">
					Email
					<Validatable
						class="user-setting-input"
						:error="displayedFormErrors?.email || ''"
					>
						<div class="input-wrapper">
							<input
								v-model="deleteEmail"
								type="email"
								data-testid="input-delete-email"
								placeholder="Enter your email"
							>
						</div>
					</Validatable>
				</label>

				<div class="modal-buttons">
					<MyButton
						class="confirm-delete"
						:disabled="isDeletingAccount || !deleteEmail.length"
						:in-progress="isDeletingAccount"
						@click="deleteUserAccount"
					>
						Yes, Delete My Account
					</MyButton>
				</div>
			</template>
		</DialogModal>
	</div>
</template>

<script>
import {deleteUser, sendPasswordResetEmail, signOut} from "firebase/auth"
import { firebaseAuth } from "@/firebase"
import { deleteUserFromFirestore, reauthenticateGoogleUser } from "@/utils"

export default {
	name: "PrivacyAndSecuritySettings",
	data () 
	{
		return {
			deleteEmail: "",
			isDeletingAccount: false,
			isLoggingOut: false,
			isResetingPassword: false,
			resetUserMessage: "",
			showDeleteModal: false,
			showingResetSuccess: false,

		}
	},
	computed: {
		canDeleteAccount () 
		{
			return this.isLoggedIn && !this.isLoggingOut &&
				!this.isDeletingAccount
		},

		canResetPassword () 
		{
			return this.isLoggedIn && !this.isLoggingOut && 
				!this.showingResetSuccess && !this.isResetingPassword
		},

		/**
		 * @returns {}
		 */
		currentUser () 
		{
			return this.$store.state.user.user
		},
		/**
		 * Checks whether the user is logged in.
		 *
		 * @returns {boolean} True if the user is logged in, false otherwise.
		 */
		isLoggedIn () 
		{
			return this.$store.state.user.isLoggedIn
		},
	},
	created () 
	{
	},
	methods: {
		/**
		 * @since 2.4.0
		 */
		closeDeleteModal ()
		{
			this.showDeleteModal = false
			this.deleteEmail = ""
		},

		/**
		 * Deletes the currently logged-in user account.
		 *
		 * @since 2.4.0
		 */
		async deleteUserAccount () 
		{
			if (!this.canDeleteAccount) 
			{
				return
			}

			this.isDeletingAccount = true

			try 
			{
				if (!this.currentUser?.email.length || !firebaseAuth.currentUser) 
				{
					console.error("No current user found.")
					return
				}
				if (this.deleteEmail != this.currentUser.email)
				{
					console.error("Error deleting account: Emails do not match")
					alert("Emails did not match. Please try again.")
					return
				}

				const reauthenticatedCheck = await reauthenticateGoogleUser()
				if (!reauthenticatedCheck)
				{
					throw new Error("Reauthentication failed. Cannot update user.")
				}

				// Delete the user account from `user` collection first
				const result = await deleteUserFromFirestore(this.currentUser)
				if (!result.success)
				{
					console.error("Failed to delete user from Firestore:", result.message)
				}
				else
				{
					// If user collection was deleted, the primary user can be removed now too
					await deleteUser(firebaseAuth.currentUser)
					// Force sign-out to clear any cached authentication state
					await signOut(firebaseAuth)
					this.$store.dispatch("logoutUser")
					this.$router.push({
						path: "/", 
					})
					console.info("User account deleted successfully.")
				}
			}
			catch (error) 
			{
				console.error("Error deleting account:", error)
				alert("Error deleting account. Please try again.")
			}
			finally 
			{
				this.isDeletingAccount = false
				this.closeDeleteModal()
			}
		},

		/**
		 * @returns {boolean} Success of logout or not
		 */
		async logout () 
		{
			// Set and ensure states
			if (this.isLoggingOut) 
			{
				return false
			}
			this.isLoggingOut = true

			try 
			{
				await signOut(firebaseAuth)
				this.$store.dispatch("logoutUser")
				this.$router.push({
					path: "/",
				})
				this.isLoggingOut = false
				return true
			}
			catch (error) 
			{
				console.error(error)
				this.isLoggingOut = false
				return false
			}
		},

		/**
		 * @since 2.4.0
		 */
		openDeleteModal ()
		{
			this.showDeleteModal = true
		},

		/**
		 * Sends a password reset email to the user's email address.
		 *
		 * @since 2.4.0
		 */
		async resetUserPassword () 
		{
			if (this.showingResetSuccess)
			{
				this.resetUserMessage = "Already sent reset email"
				return false
			}

			this.isResetingPassword = true
			try 
			{
				if (!this.currentUser?.email) 
				{
					this.resetUserMessage = "No current user or email found."
					return
				}

				await sendPasswordResetEmail(firebaseAuth, this.currentUser.email)
				this.resetUserMessage = "Password reset email sent successfully."
				this.showingResetSuccess = true
				this.isResetingPassword = false 
				return true
			}
			catch (error) 
			{
				this.isResetingPassword = false 
				console.error("Error resetting password:", error)
				this.resetUserMessage = "Error resetting password; Try again?"
				return false
			}
		},

	},
}
</script>

<style lang="less">
@import "../assets/styles/styles";
.user-settings-security-tab-wrapper {
	.session-management-wrapper {
		.input-wrapper {
			align-content: center;
			align-items: center;
			display: flex;
			flex-direction: column;
			.error-message {
				// TODO: Pick a better color
				color: blue;
			}
		}
	}
	.delete-modal-overlay {
		.dialog-content {
			.dialog-header {
				border-bottom: 1px solid black;
				color: @myblack;
			}
			.dialog-body {
				color: @myblack;
			}
		}
		align-items: center;
		background: rgba(0, 0, 0, 0.5);
		color: @myblack;
		display: flex;
		height: 100%;
		justify-content: center;
		left: 0;
		position: fixed;
		top: 0;
		width: 100%;

		.modal-content {
			color: @myblack;
			background: white;
			padding: 20px;
			border-radius: 11px;
			text-align: center;
			width: 90%;
			max-width: 400px;
		}
		.modal-buttons {
			display: flex;
			justify-content: space-between;
			margin-top: 20px;
		}
		.confirm-delete {
			background: @danger;
			border-radius: 11px !important;
			color: white;
		}
		.dialog-button {
			border-radius: 11px !important;
		}
	}
}
</style>

