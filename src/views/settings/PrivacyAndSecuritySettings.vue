<template>
	<div class="user-settings-form-wrapper">
		<h2>Privacy + Security Tab</h2>

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
			<p>
				Here you could add 2FA toggles, data download requests,
				or privacy preference toggles.
			</p>
		</div>

		<!-- Additional content as needed -->
	</div>
</template>

<script>
import { signOut } from "firebase/auth"
import { firebaseAuth } from "@/firebase"
import store from "@/store/store.js"

export default {
	name: "PrivacyAndSecuritySettings",
	// Add props, data, methods, etc., as needed
	data () 
	{
		return {
			isLoggingOut: false,
		}
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
	},
}
</script>

<style scoped lang="less">
/* Insert any privacy/security-specific styles here */
</style>
