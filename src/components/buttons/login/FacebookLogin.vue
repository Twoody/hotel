Button to activate a facebook account authenticator
<template>
	<div class="facebook-login-wrapper">
		<div class="social-button-dex">
			Facebook
		</div>
		<MyButton
			class="social-button"
			@click="facebookLogin"
		>
			<font-awesome-icon
				alt="Facebook Logo" 
				class="svg-wrapper"
				:icon="['fab', 'facebook']"
				:style="{ color: 'blue' }"
			/>
		</MyButton>
	</div>
</template>

<script>
import { getAuth, signInWithPopup, FacebookAuthProvider } from "firebase/auth"
import store from "@/store/store.js"

export default {
	name: "FacebookLogin",
	data ()
	{
	},
	computed:
	{
		/**
		 * @returns {boolean} - Whether a user is logged in or not
		 * @since 2.2.1
		 */
		isAuthReady ()
		{
			return store.state.user.isAuthReady
		},

		/**
		 * @returns {boolean} - Whether a user is logged in or not
		 * @since 2.2.1
		 */
		isLoggedIn ()
		{
			return store.state.user.isLoggedIn
		},

		/**
		 * @returns {boolean} - Whether a user is logging in or not
		 * @since 2.2.1
		 */
		isLoggingIn ()
		{
			return store.state.user.isLoggingIn
		},
	},
	methods:
	{
		/**
		 * Use firebase to support logging in with a facebook account
		 *
		 * @returns {boolean} Was work done
		 * @since 0.1.3
		 */
		async facebookLogin ()
		{
			if (this.isLoggingIn && this.isAuthReady && !this.isLoggedIn)
			{
				return false
			}

			// Set a mutex 
			this.$store.commit("setIsLoggingIn", true)

			/* eslint-disable no-unused-vars */
			try
			{
				const auth = getAuth()

				// Configure for facebook
				const provider = new FacebookAuthProvider()
				provider.addScope("user_birthday")
				provider.setCustomParameters({
					"display": "popup",
				})

				const response = await signInWithPopup(auth, provider)
				// This gives you a Facebook Access Token.
				const credential = FacebookAuthProvider.credentialFromResult(response)
				const token = credential.accessToken
				if (credential)
				{
					// The signed-in user info.
					const user = response?.user

					if (user)
					{
						// Actual user setup is handled in App.vue @ `onAuthStateChanged`
						this.$router.push({
							path: "/",
						})
					}
				}
			}
			catch (error)
			{
				const errorCode = error.code
				const errorMessage = error.message

				// The email of the user's account used.
				const email = error.email

				// The AuthCredential type that was used.
				const credential = FacebookAuthProvider.credentialFromError(error)
				console.error(errorMessage)
			}
			/* eslint-enable no-unused-vars */

			// Release the mutex
			this.$store.commit("setIsLoggingIn", false)
		},
	},
}
</script>

<style lang='less'>
.svg-wrapper {
	
}
</style>
