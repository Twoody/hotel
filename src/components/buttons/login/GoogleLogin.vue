<template>
	<div class="google-login-wrapper">
		<div class="social-button-dex">
			Google
		</div>
		<button
			class="social-button"
			@click="googleLogin"
		>
			<font-awesome-icon
				alt="Google Logo" 
				class='svg-wrapper'
				:icon="['fab', 'google']"
			/>
		</button>
	</div>
</template>

<script>
import firebase from "firebase"

export default {
	name: "GoogleLogin",
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
			/* eslint-disable no-unused-vars */
			const provider = new firebase.auth.GoogleAuthProvider()
			provider.addScope("profile")
			provider.addScope("email")

			try
			{
				const response = await firebase.auth().signInWithPopup(provider)
				// This gives you a Google Access Token.
				const token = response.credential.accessToken
				// The signed-in user info.
				const user = response.user
			}
			catch (error)
			{
				const errorCode = error.code
				const errorMessage = error.message

				// The email of the user's account used.
				const email = error.email

				// The AuthCredential type that was used.
				const credential = error.credential
				console.group()
				console.error(this.$options.name)
				console.error(provider)
				console.error(errorMessage)
				console.error(
					error 
				)
				console.groupEnd()
			}
			/* eslint-enable no-unused-vars */
		},
	},
}
</script>
