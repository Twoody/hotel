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
				@click="deleteUserAccount"
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

		<!-- Additional content as needed -->
	</div>
</template>

<script>
import { signOut, deleteUser, sendPasswordResetEmail } from "firebase/auth"
import { firebaseAuth } from "@/firebase"

export default {
	name: "PrivacyAndSecuritySettings",
	data () 
	{
		return {
			isLoggingOut: false,
			isResetingPassword: false,
			resetUserMessage: "",
			showingResetSuccess: false,
		}
	},
	computed: {
		canDeleteAccount () 
		{
			return this.isLoggedIn && !this.isLoggingOut && false
		},
		canResetPassword () 
		{
			return this.isLoggedIn && !this.isLoggingOut && 
				!this.showingResetSuccess && !this.isResetingPassword
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
		 * Deletes the currently logged-in user account.
		 *
		 * @since 2.4.0
		 */
		async deleteUserAccount () 
		{
			if (!this.isLoggedIn) 
			{
				console.error("User not logged in.")
				return
			}

			try 
			{
				const user = firebaseAuth.currentUser
				if (!user) 
				{
					console.error("No current user found.")
					return
				}

				await deleteUser(user)
				this.$store.dispatch("logoutUser")
				this.$router.push({
					path: "/", 
				})
				console.log("User account deleted successfully.")
			}
			catch (error) 
			{
				console.error("Error deleting account:", error)
			}
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
				this.$store.dispatch("logoutUser")
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
				const user = firebaseAuth.currentUser
				if (!user?.email) 
				{
					this.resetUserMessage = "No current user or email found."
					return
				}

				await sendPasswordResetEmail(firebaseAuth, user.email)
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
}
</style>

