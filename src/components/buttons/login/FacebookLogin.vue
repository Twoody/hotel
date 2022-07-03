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
			const auth = getAuth()
			const provider = new FacebookAuthProvider()
			provider.addScope("user_birthday")

			try
			{
				const response = await signInWithPopup(auth, provider)

				// The signed-in user info.
				const user = response.user
				// This gives you a Facebook Access Token.
				const credential = response.credential
				const token = credential.accessToken
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
