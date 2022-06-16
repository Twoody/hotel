<template>
	<div class="login-page-wrapper">
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
				<MyButton
					class="login-button"
					@click="login"
					:in-progress="loggingIn"
				>
					{{ buttonText }}
				</MyButton>
			</div>

			<div class="register-section">
				<h3>
					Or register here
				</h3>

				<NewUserLogin />

				<SocialLogin />
			</div>
		</div>
	</div>
</template>

<script>
import firebase from "firebase"
import MyButton from "@/components/buttons/MyButton.vue"
import NewUserLogin from "@/components/buttons/login/NewUserLogin.vue"
import SocialLogin from "@/components/forms/SocialLogin.vue"
import store from "@/store/store.js"

export default {
	name: "Login",
	components:
	{
		MyButton,
		NewUserLogin,
		SocialLogin,
	},

	props: {},
	data: function()
	{
		return {
			email: "",
			isLoading: true,
			loggingIn: false,
			password: "",
			success: false,
		}
	},

	computed:
	{
		/**
		 */
		buttonText () 
		{
			if (this.success)
			{
				return ""
			}
			return "Log In"
		},

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
			this.loggingIn = true
			try
			{
				const response = await firebase.auth().signInWithEmailAndPassword(
					this.email,
					this.password
				)
				console.log("logged in!")
				console.log(response)
				this.success = true
				// return response
			}
			catch (error)
			{
				// TODO: Show error state/message in template
				console.group()
				console.error(this.$options.name)
				console.error(
					error
				)
				console.groupEnd()
			}
			this.loggingIn = false
		},

	},
}
</script>

<style scoped lang="less">
@import "~styles/styles";

.login-page-wrapper {
	display: relative;
	flex-grow: 1;
	max-width: 70%;
	padding: 10px;

	.login-form {
		align-items: center;
		border-bottom: 5px solid @color-purple;
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: auto;
		margin-bottom: 20px;
		padding-bottom: 7px;
		position: relative;
		transition: all 0.3s ease;

		.login-item {
			border-radius: 5px;
			border: 1px solid @color-purple;
			font-size: 20px;
			margin-bottom: 10px;
			min-height: 32px;
			min-width: 90%;
			transition: all 0.3s ease;

			&:active {
				transform: translate3d(-1px, 0, 0) scale(1.02);
			}
		}

		.login-button {
			margin-bottom: 10px;
			margin-top: 10px;
			min-width: 50%;
			max-width: 50%;
		}
	}
	.register-section {
		h3 {
			padding-bottom: 4px;
			text-decoration: underline;
			text-transform: uppercase;
			text-underline-offset: 3px;
		}
		.social-button {
			background: white;
			border: 0;
			border-radius: 100%;
			box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0,2);
			padding: 10px;
			width: 75px;

			&:active {
				display: relative;
				box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.8);
			}
			img {
				width: 100%;
			}
		}
	}
}
@media (hover: hover) {
	.login-item {
		&:hover {
			transform: translate3d(-1px, 0, 0) scale(1.02);
		}
	}
	.social-button:hover {
		display: relative;
		box-shadow: -2 -2px -4px 0 rgba(0, 0, 0, .5);
	}
}
</style>

