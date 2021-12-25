<template>
	<div class="page-wrapper">
		<div v-if="isLoggedIn">
			<h3>Already Logged in</h3>
			<p>
				It looks like you already have an account and are logged in.
				<br >
				If need be, 
			</p>
		</div>
		<div v-if="!isLoggedIn">
			<h3>Register now</h3>

			<!-- TODO: Put all of this in /forms ... -->
			<div class="register-form">
				<input
					v-model="firstName"
					class="register-item"
					placeholder="First Name"
					type="text"
				>
				<input
					v-model="lastName"
					class="register-item"
					placeholder="Last Name"
					type="text"
				>
				<input
					v-model="phone"
					class="register-item"
					placeholder="1+ 123 456 7890"
					type="text"
				>
				<input
					v-model="street"
					class="register-item"
					placeholder="Street"
					type="text"
				>
				<input
					v-model="city"
					class="register-item"
					placeholder="City"
					type="text"
				>
				<!-- TODO: Make a dropdown -->
				<input
					v-model="state"
					class="register-item"
					placeholder="state"
					type="text"
				>

				<button class="register-button" @click="register">
					Register	
				</button>
			</div>

			<div class="google-login">
				<div class="social-button-dex">
					or login with Google
				</div>
				<button
					class="social-button"
					@click="socialLogin"
				>
					<img alt="Google Logo" src="../assets/google-logo.png">
				</button>
			</div>
		</div>

	</div>
</template>

<script>
import firebase from "firebase"
import store from "../store/store.js"

export default {
	name: "Signup",
	components:
	{},

	props: {},
	data: function()
	{
		return {
			city: "",
			firstName: "",
			isLoading: true,
			lastName: "",
			phone: "",
			state: "",
			street: "",
		}
	},

	computed:
	{
		/**
		 * @returns {boolean} - Whether a user is logged in or not
		 * @since 0.1.3
		 */
		isLoggedIn ()
		{
			return store.state.user.isLoggedIn
		},

		/**
		 * @todo Setup a spinner in template when user is logging in
		 * @returns {boolean} - Whether a user is logging in or not
		 * @since 0.1.3
		 */
		isLoggingIn ()
		{
			return store.state.user.isLoggingIn
		},
	},
	methods: 
	{
		/**
		 * Use firebase to support logging in with any email account
		 *
		 * @returns {void}
		 * @since 0.1.3
		 */
		async register ()
		{
			try
			{
				const response = await firebase.auth().signInWithEmailAndPassword(
					this.email,
					this.password
				)
				console.log("logged in!")
				console.log(response)
				return response
			}
			catch (error)
			{
				// TODO: Show error state/message in template
				console.error(
					error
				)
			}
		},

		/**
		 * Use firebase to support logging in with a google account
		 *
		 * @returns {void}
		 * @since 0.1.3
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
				console.error("error", {
					error, 
				})
			}
			/* eslint-enable no-unused-vars */
		},
	},
}
</script>

<style scoped lang="less">
.page-wrapper {
	display: relative;
	padding: 10px;
	.login-form {
		display: flex;
		flex-direction: column;
		height: auto;
		margin-bottom: 20px;
		position: relative;
		width: 100%;

		.login-item {
			margin-bottom: 10px;
		}

		.login-button {
			margin-bottom: 10px;
			margin-top: 10px;
		}
	}
	.social-button {
		width: 75px;
		background: white;
		padding: 10px;
		border-radius: 100%;
		box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0,2);
		outline: 0;
		border: 0;
	}
	.social-button:active {
		display: relative;
		box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
	}
	.social-button img {
		width: 100%;
	}
}
</style>

