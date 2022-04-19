Button to activate a facebook account authenticator
<template>
	<div class="facebook-login-wrapper">
		<div class="social-button-dex">
			Facebook
		</div>
		<button
			class="social-button"
			@click="facebookLogin"
		>
			<font-awesome-icon
				alt="Facebook Logo" 
				class="svg-wrapper"
				:icon="['fab', 'facebook']"
				:style="{ color: 'blue' }"
			/>
		</button>
	</div>
</template>

<script>
import firebase from "firebase"

export default {
	name: "FacebookLogin",
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
			provider.addScope("user_birthday")

			try
			{
				const response = await firebase.auth().signInWithPopup(provider)

				// The signed-in user info.
				const user = response.user
				// This gives you a Facebook Access Token.
				const credential = response.credential
				const token = credential.accessToken
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

<style lang='less'>
.svg-wrapper {
	
}
</style>
