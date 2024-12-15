<template>
	<div class="google-login-wrapper">
		<div class="social-button-dex">
			Google
		</div>
		<MyButton
			class="social-button"
			@click="googleLogin"
		>
			<font-awesome-icon
				alt="Google Logo" 
				class="svg-wrapper"
				:icon="['fab', 'google']"
				:style="{ color: 'blue' }"
			/>
		</MyButton>
	</div>
</template>

<script>
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import store from "@/store/store.js"

export default {
	name: "GoogleLogin",
	data ()
	{
		return {}
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
		 * Use firebase to support logging in with a google account
		 *
		 * @todo Configure with some .env vars
		 * @returns {boolean} Was work done
		 * @since 0.1.0
		 */
		async googleLogin ()
		{
			if (this.isLoggingIn && this.isAuthReady && !this.isLoggedIn)
			{
				return false
			}

			// Set a mutex 
			this.$store.commit("setIsLoggingIn", true)

			/* eslint-disable no-unused-vars */
			const auth = getAuth()
			const provider = new GoogleAuthProvider()
			provider.addScope("profile")
			provider.addScope("email")

			try
			{
				const response = await signInWithPopup(auth, provider)
				// This gives you a Google Access Token.
				const credential = GoogleAuthProvider.credentialFromResult(response)
				if (credential)
				{
					/** Saving this line in case access token is needed at some point */
					// const token = credential.accessToken

					// The signed-in user info.
					const user = response?.user

					if (user)
					{
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
				const credential = error.credential
				console.error(errorMessage)
			}
			/* eslint-enable no-unused-vars */
			return true
		},
	},
}
</script>
