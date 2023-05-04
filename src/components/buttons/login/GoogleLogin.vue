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

export default {
	name: "GoogleLogin",
	data ()
	{
		return {
			isLoggingIn: false,
		}
	},
	methods:
	{
		/**
		 * Use firebase to support logging in with a google account
		 *
		 * @returns {void}
		 * @since 0.1.0
		 */
		async googleLogin ()
		{
			if (this.isLoggingIn === true)
			{
				return
			}

			this.isLoggingIn = true

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
				const token = credential.accessToken
				// The signed-in user info.
				const user = response.user

				// Update store
				this.$store.dispatch("fetchUser", user)

				this.$router.push({
					path: "/",
				})
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
			this.isLoggingIn = false
		},
	},
}
</script>
