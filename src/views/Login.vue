<template>
	<div class="login-page-wrapper">
		<div v-if="isLoggedIn">
			<h3>Already Logged in</h3>
			<p>
				Logging in a second time is weird. Please contine or logout.
			</p>
		</div>
		<div v-else>
			<div class='flex-container'>
				<MyButton
					class='title-toggle'
					:class="{selected: !isRegistering}"
					:disabled='isRegistering === false'
					:inactive='isRegistering === false'
					@click="isRegistering = false"
				>
					<h3>
						Sign In
					</h3>
				</MyButton>
				<span>or</span>
				<MyButton
					class='title-toggle'
					:class="{selected: isRegistering}"
					:disabled='isRegistering === true'
					@click="isRegistering = true"
				>
					<h3>
						Sign Up
					</h3>
				</MyButton>
			</div>
				<!--
				<NewUserLogin
					:email="email"
					:password="password"
					:passwordsMatch="passwordConfirm === password"
					:ready="isRegistering"
					@click="handleRegistClick"
					@error="registrationError = arguments[0]"
				/>
				-->

			<div class="login-form">
				<input
					v-model="email"
					class="login-item"
					placeholder="Email"
					ref="email"
					type="text"
				>
				<input
					v-model="password"
					class="login-item"
					placeholder="Password"
					ref="password"
					type="password"
				>
				<Validatable
					class="input-wrapper"
					:error="registrationError"
				>
					<input
						v-model="passwordConfirm"
						class="login-item"
						:class="{showing: isRegistering, hidden: !isRegistering}"
						placeholder="Confirm Password"
						ref="passwordConfirm"
						type="password"
					>
				</Validatable>
				<MyButton
					class="login-button"
					@click="loginOrRegister"
					:in-progress="loggingIn"
					:success="success"
				>
					<transition
						name="xxxx"
						mode="out-in"
					>
						<span
							v-if='isRegistering'
							key='isRegistering'
						>
							Register Email
						</span>
						<span
							v-else
							key='!isRegistering'
						>
							Log In
						</span>
					</transition>
				</MyButton>
			</div>

			<div
				class="register-section"
				:class="{registering: isRegistering}"
			>
				<h3>Social Logins</h3>
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
import Validatable from "@/components/common/Validatable"

export default {
	name: "Login",
	components:
	{
		MyButton,
		NewUserLogin,
		SocialLogin,
		Validatable,
	},

	props: {},
	data: function()
	{
		return {
			email: "",
			isLoading: true,
			isRegistering: false,
			isShowingErrors: false,
			loggingIn: false,
			password: "",
			passwordConfirm: "",
			registrationError: "",
			success: false,
		}
	},

	computed:
	{
		/** */
		displayedError () 
		{
			if (this.isShowingErrors)
			{
				return this.errors
			}
			return ""
		},


		/**
		 * @todo validate email address too
		 * @returns {string} Return error message if applicable; Else empty string.
		 */
		errors () 
		{
			if (!this.passwordsMatch)
			{
				return "Passwords do not match"
			}
			if (this.password.length <= 8)
			{
				return "Password less than 8 characters"
			}
			if (!/[a-zA-Z]/.test(this.password))
			{
				return "Password needs alphabetical character"
			}
			if (!/\d/.test(this.password))
			{
				return "Password needs numeric character"
			}
			if (this.registrationError)
			{
				return this.registrationError
			}

			return ""
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
		/** */
		handleRegistClick ()
		{
			console.log("cliclked")
			this.isRegistering = true
			if (!this.email)
			{
				this.$refs.email.focus()
				return
			}
			else if (!this.password)
			{
				this.$refs.password.focus()
				return
			}
			else if (!this.passwordConfirm)
			{
				this.$refs.passwordConfirm.focus()
				return
			}
		},

		/**
		 * Use firebase to support logging in with any email account
		 *
		 * @todo https://firebase.google.com/docs/auth/web/email-link-auth?authuser=0#web-version-9_1
		 *			Use link to provide signup with email
		 * @returns {void}
		 * @since 0.1.0
		 */
		async loginOrRegister ()
		{
			if (this.isRegistering)
			{
				this.registerNewUser()
			}
			else
			{
				this.login()
			}
		},

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

		/** @returns*/
		passwordsMatch()
		{
			return this.password === this.passwordConfirm
		},

		/**
		 * Use firebase to support logging in with a new account
		 *
		 * @todo configure errors for user logging in
		 * @returns {void}
		 * @since 0.1.3
		 */
		async registerNewUser ()
		{
			if (!this.ready)
			{
				return 
			}
			this.registrationError = ""
			/* eslint-disable no-unused-vars */
			try
			{
				const response = await firebase.auth().createUserWithEmailAndPassword(
					this.email,
					this.password
				)
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
				console.error(errorMessage)
				console.error(
					error 
				)
				console.groupEnd()
				this.registrationError = errorMessage
			}
			/* eslint-enable no-unused-vars */
		},

	},
	watch:
	{
		/**
		 * Watch user loging out to manage local state
		 *
		 * @param n
		 * @param o
		 */
		isLoggedIn (n, o)
		{
			if (n === false && o === true)
			{
				this.success = false
			}
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

	.flex-container {
		align-items: center;
		display: flex;
		flex-wrap: nowrap;
		flex-direction: row;
		justify-content: center;
		margin-bottom: 11px;
		transition: all 0.5s ease;

		span {
			padding-left: 14px;
			padding-right: 14px;
		}

		.title-toggle {
			background: unset;
			border-radius: 5px;
			color: #42b983;
			filter: brightness(102%);
			padding: 0;

			h3 {
				margin: 0;
				padding: 0;
			}

			&.selected {
				border: 2px solid #42b983;
				filter: brightness(110%);
			}
			&:not(.selected) {
				border: unset;
				filter: brightness(80%);
				opacity: 0.7;
			}
		}


	}

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
		transition: all 0.5s ease;

		.input-wrapper {
			width: 100%;;
		}

		.login-item {
			border-radius: 5px;
			border: 1px solid @color-purple;
			font-size: 20px;
			margin-bottom: 10px;
			min-height: 32px;
			min-width: 90%;
			transition: all 0.5s ease;

			&:active {
				transform: translate3d(-1px, 0, 0) scale(1.02);
			}
			&.hidden {
				border: none;
				height: 0;
				max-height: 0;
				min-height: 0;
				opacity: 0;
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
			color: @color-purple;
			border-bottom: 5px solid @color-purple;
			filter: brightness(80%);
			padding-bottom: 8px;
			text-transform: uppercase;
			text-underline-offset: 3px;
			transform: translate3d(1px, 0, 0) scale(.9);
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
.xxxx-enter-active, .xxxx-leave-active {
	transition: all 0.25s ease;
}
.xxxx-enter, .xxxx-leave-to {
	opacity: 0;
}

</style>

