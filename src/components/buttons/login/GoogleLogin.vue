<template>
	<div class="google-login-wrapper">
		<div class="social-button-dex">
			Google
		</div>
		<MyButton
			class="social-button"
			:disabled="isLoggingIn || !isAuthReady || isLoggedIn"
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
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { firebaseAuth } from "@/firebase" // Adjust path as necessary
import { addUserToFirestore } from "@/utils"
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

			try
			{
				const provider = new GoogleAuthProvider()
				provider.addScope("profile")
				provider.addScope("email")

				const response = await signInWithPopup(firebaseAuth, provider)
				const credential = GoogleAuthProvider.credentialFromResult(response)
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
				const credential = error.credential
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
