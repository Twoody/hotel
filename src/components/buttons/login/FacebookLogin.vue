Button to activate a facebook account authenticator
<template>
	<div class="facebook-login-wrapper">
		<div class="social-button-dex">
			Facebook
		</div>
		<MyButton
			class="social-button"
			:disabled="isLoggingIn || !isAuthReady || isLoggedIn"
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
import { signInWithPopup, FacebookAuthProvider } from "firebase/auth"
import { firebaseAuth } from "@/firebase" // Adjust path as necessary
import { addUserToFirestore } from "@/utils"
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

			try
			{
				// Configure for facebook
				const provider = new FacebookAuthProvider()
				provider.addScope("user_birthday")
				provider.setCustomParameters({
					"display": "popup",
				})

				const response = await signInWithPopup(firebaseAuth, provider)
				const credential = FacebookAuthProvider.credentialFromResult(response)
				if (credential)
				{
					// The signed-in user info.
					const user = response?.user

					if (user)
					{
						// Attempt to add user to firestore if necessary
						const firestoreUser = await addUserToFirestore(user)

						// Update store with user IFF "logged in user" is/was valid
						// NOTE: Further user setup is handled in App.vue @ `onAuthStateChanged`
						this.$store.dispatch("fetchUser", firestoreUser)

						// Release the mutex
						this.$store.commit("setIsLoggingIn", false)

						this.$router.push({
							path: "/",
						})
					}
				}
			}
			catch (error)
			{
				const errorMessage = error.message

				// The AuthCredential type that was used.
				const credential = FacebookAuthProvider.credentialFromError(error)
				console.error(errorMessage)
				console.error(credential)
				return false
			}

			// Release the mutex
			this.$store.commit("setIsLoggingIn", false)
			return true
		},
	},
}
</script>

<style lang='less'>
.svg-wrapper {
	
}
</style>
