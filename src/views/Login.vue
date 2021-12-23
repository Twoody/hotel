<template>
	<div class="page-wrapper">
		<div v-if="isLoggedIn">
			<h3>Already Logged in</h3>
			<p>
				Logging in a second time is weird. Please contine or logout.
			</p>
		</div>
		<div v-if="!isLoggedIn">
			<h3>Sign In</h3>

			<div class="login-form">
				<input
					v-model="email"
					class="login-item"
					placeholder="Email"
					type="text"
				>
				<input
					v-model="password"
					class="login-item"
					placeholder="Password"
					type="password"
				>
				<button class="login-button" @click="login">
					Log In
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
	name: "Login",
	components:
	{},

	props: {},
	data: function()
	{
		return {
			email: "",
			isLoading: true,
			password: "",
		}
	},

	computed:
	{
		/**
		 * @returns {boolean} - Whether a user is logged in or not
		 * @since 0.1.0
		 */
		isLoggedIn ()
		{
			return store.state.user.isLoggedIn
		},

		/**
		 * @todo Setup a spinner in template when user is logging in
		 * @returns {boolean} - Whether a user is logging in or not
		 * @since 0.1.0
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
		 * @todo https://firebase.google.com/docs/auth/web/email-link-auth?authuser=0#web-version-9_1
		 *			Use link to provide signup with email
		 * @returns {void}
		 * @since 0.1.0
		 */
		async login ()
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

