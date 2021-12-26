User should be able to register/login from multiple places
<template>
	<div class='social-login-wrapper'>
		<div class="google-login">
			<div class="social-button-dex">
				or login with Google
			</div>
			<button
				class="social-button"
				@click="socialLogin"
			>
				<img alt="Google Logo" src="@/assets/google-logo.png">
			</button>
		</div>
	</div>
</template>

<script>
import firebase from "firebase"

export default {
	name: 'SocialLogin',
	components: {},
	methods:
	{
		/**
		 * Use firebase to support logging in with a google account
		 *
		 * @returns {void}
		 * @since 0.1.0
		 */
		async socialLogin ()
		{
			/* eslint-disable no-unused-vars */
			const provider = new firebase.auth.GoogleAuthProvider()

			try
			{
				const response = await firebase.auth().signInWithPopup(provider)
				console.log("success", response)
				// This gives you a Google Access Token. You can use it to access Google APIs.
				const credential = provider.credentialFromResult(response)
				const token = credential.accessToken

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
					error, 
				)
				console.groupEnd()
			}
			/* eslint-enable no-unused-vars */
		},
	},
}
</script>
