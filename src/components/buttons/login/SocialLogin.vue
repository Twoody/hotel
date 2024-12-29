<template>
	<div class="social-login-wrapper">
		<div class="social-button-dex">
			{{ providerName }}
		</div>
		<MyButton
			class="social-button"
			:disabled="isLoggingIn || !isAuthReady || isLoggedIn"
			@click="handleLogin"
		>
			<font-awesome-icon
				:icon="icon"
				class="svg-wrapper"
				:style="{ color: 'blue' }"
				:alt="`${providerName} Logo`"
			/>
		</MyButton>
	</div>
</template>

<script>
import {signInWithPopup,
	GoogleAuthProvider,
	FacebookAuthProvider} from "firebase/auth"
import { firebaseAuth } from "@/firebase"
import { addUserToFirestore } from "@/utils"
import store from "@/store/store.js"

// Helper to capitalize the first letter
/**
 *
 * @param word
 */
function capitalize (word)
{
	return word.charAt(0).toUpperCase() + word.slice(1)
}

export default {
	name: "SocialLogin",
	props: {
		/**
		 * Which login provider to use, e.g. 'google' or 'facebook'
		 *
		 * @warning facebook authentiacation is currently blocked until a Buiness Number is sent in
		 */
		provider: {
			required: true,
			type: String,
			validator (val) 
			{
				return [
					"google",
					"facebook",
				].includes(val.toLowerCase())
			},
		},
	},
	computed: {
		/**
		 * Choose appropriate FontAwesome icon
		 *
		 * @returns {Array} - Font Awesome array-to-string specfic
		 * @since 2.2.2
		 */
		icon () 
		{
			if (this.provider === "facebook") 
			{
				return [
					"fab",
					"facebook",
				]
			}
			return [
				"fab",
				"google",
			]
		},

		/**
		 * Uses the store to check if the auth is ready
		 *
		 * @returns {boolean} - Whether a user is logged in or not
		 * @since 2.2.1
		 */
		isAuthReady () 
		{
			return store.state.user.isAuthReady
		},

		/**
		 * Uses the store to check if the user is logged in
		 *
		 * @returns {boolean} - Whether a user is logged in or not
		 * @since 2.2.1
		 */
		isLoggedIn () 
		{
			return store.state.user.isLoggedIn
		},

		/**
		 * Uses the store to check if the user is in the process of logging in
		 *
		 * @returns {boolean} - Whether a user is logging in or not
		 * @since 2.2.1
		 */
		isLoggingIn () 
		{
			return store.state.user.isLoggingIn
		},

		/**
		 * A simplistic approach to detect mobile for Google redirect
		 *
		 * @returns {boolean} - Is current device mobile
		 * @todo Create and move to the store + App.vue level
		 * @todo Possible consider https://github.com/kaimallea/isMobile
		 * @since 2.2.1
		 */
		isMobile () 
		{
			let isMobile = false
			if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobi/i.test(
				navigator.userAgent))
			{
				isMobile = true
			}
			return isMobile
		},

		/**
		 * Capitalizes the provider name for display
		 */
		providerName () 
		{
			return capitalize(this.provider)
		},

	},
	methods: {
		/**
		 * @returns {object} - A configured provider instance (Google or Facebook)
		 * @since 2.2.2
		 */
		getProviderInstance () 
		{
			if (this.provider === "google") 
			{
				const googleProvider = new GoogleAuthProvider()
				googleProvider.addScope("profile")
				googleProvider.addScope("email")
				return googleProvider
			}
			else if (this.provider === "facebook") 
			{
				const facebookProvider = new FacebookAuthProvider()
				facebookProvider.addScope("user_birthday")
				facebookProvider.setCustomParameters({
					display: "popup", 
				})
				return facebookProvider
			}
			else
			{
				return {
					invalid: true,
				}
			}
		},

		async handleLogin () 
		{
			let success = false

			// If we are currently logging in or already logged in, do nothing
			if (this.isLoggingIn && this.isAuthReady && !this.isLoggedIn) 
			{
				return success
			}

			// Start login process - set a mutex
			this.$store.commit("setIsLoggingIn", true)

			try 
			{
				let response

				const providerInstance = this.getProviderInstance()
				if (providerInstance.invalid) 
				{
					return success
				}

				response = await signInWithPopup(firebaseAuth, providerInstance)

				const user = response?.user
				if (user) 
				{
					// Add user to Firestore if necessary
					const firestoreUser = await addUserToFirestore(user)
					// Tell Vuex to fetch/store the user
					this.$store.dispatch("fetchUser", firestoreUser.data())
					// Redirect or route as appropriate
					this.$router.push({
						path: "/", 
					})
					success = true
				}
			}
			catch (error) 
			{
				console.error(error.message)
			}
			finally 
			{
				// Release the mutex
				this.$store.commit("setIsLoggingIn", false)
			}
			return success
		},
	},
}
</script>

<style scoped>
.social-login-wrapper {
	align-items: center;
	display: flex;
	flex-direction: column;
}
.social-button-dex {
	margin-right: 8px;
}
</style>
