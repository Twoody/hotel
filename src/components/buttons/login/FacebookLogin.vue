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
import { getAuth, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import MyButton from "@/components/buttons/MyButton.vue"

export default {
	name: "FacebookLogin",
	components:
	{
		MyButton,
	},
	data()
	{
		return {
			isLoggingIn: false,
		}
	},
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
			if (this.isLoggingIn === true)
			{
				return
			}

			this.isLoggingIn = true
			/* eslint-disable no-unused-vars */

			try
			{
				const auth = getAuth()

				// Configure for facebook
				const provider = new FacebookAuthProvider()
				provider.addScope("user_birthday")
				provider.setCustomParameters({
					'display': 'popup',
				})

				const response = await signInWithPopup(auth, provider)
				// The signed-in user info.
				const user = response.user
				// This gives you a Facebook Access Token.
				const credential = FacebookAuthProvider.credentialFromResult(response);
				const token = credential.accessToken

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
				const credential = FacebookAuthProvider.credentialFromError(error);
				console.error(errorMessage)
			}
			/* eslint-enable no-unused-vars */
			this.isLoggingIn = false
		},
	},
}
</script>

<style lang='less'>
.svg-wrapper {
	
}
</style>
