Button to activate a facebook account authenticator
<template>
	<div class="facebook-login-wrapper">
		<div class="social-button-dex">
			<slot></slot>
		</div>
		<button
			class="social-button"
			@click="facebookLogin"
		>
			<img alt="Facebook Logo" src="@/assets/facebook-logo.png">
		</button>
	</div>
</template>

<script>
import firebase from "firebase"

export default {
	name: 'FacebookLogin',
	methods:
	{
		/**
		 * Use firebase to support logging in with a facebook account
		 *
		 * @returns {void}
		 * @since 0.1.3
		 */
		async facebookLogin ()
		{
			/* eslint-disable no-unused-vars */
			const provider = new firebase.auth.FacebookAuthProvider()
			provider.addScope("profile")
			provider.addScope("email")

			try
			{
				const response = await firebase.auth().signInWithPopup(provider)
				// This gives you a Facebook Access Token.
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
