<template>
	<div class="login-page-wrapper">
		<div v-if="!isAuthReady">
			<h3>Checking firebase auth status...</h3>
		</div>
		<div v-else-if="isLoggedIn">
			<h3>Already Logged in</h3>
			<p>
				Logging in a second time is weird. Please contine or logout.
			</p>
		</div>
		<div v-else>
			<div class="flex-container">
				<MyButton
					class="title-toggle"
					:class="{selected: !isRegistering}"
					:disabled="isRegistering === false"
					:inactive="isRegistering === false"
					@click="isRegistering = false"
				>
					<h3>
						Sign In
					</h3>
				</MyButton>
				<span>or</span>
				<MyButton
					class="title-toggle"
					:class="{selected: isRegistering}"
					:disabled="isRegistering === true"
					@click="isRegistering = true"
				>
					<h3>
						Sign Up
					</h3>
				</MyButton>
			</div>

			<div class="login-form">
				<Validatable
					class="input-wrapper"
					:error="displayedErrors.email || ''"
				>
					<input
						v-model="email"
						class="login-item"
						placeholder="Email"
						ref="email"
						type="text"
					>
				</Validatable>
				<Validatable
					class="input-wrapper"
					:error="displayedErrors.password || ''"
				>
					<input
						v-model="password"
						class="login-item"
						placeholder="Password"
						ref="password"
						type="password"
					>
				</Validatable>
				<Validatable
					class="input-wrapper"
					:error="displayedErrors.passwordConfirm || ''"
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

				<Validatable
					class="login-button-wrapper"
					:error="displayedErrors.response || ''"
				>
					<MyButton
						class="login-button"
						:in-progress="isLoggingIn"
						:success="success"
						@click="loginOrRegister"
					>
						<transition
							name="xxxx"
							mode="out-in"
						>
							<span
								v-if="isRegistering"
								key="isRegistering"
							>
								Register Email
							</span>
							<span
								v-else
								key="!isRegistering"
							>
								Log In
							</span>
						</transition>
					</MyButton>
				</Validatable>
			</div>

			<div class="register-section">
				<h3>Social Logins</h3>
				<SocialLogin />
			</div>
		</div>
	</div>
</template>

<script>
import {createUserWithEmailAndPassword,
	getAuth,
	signInWithEmailAndPassword} from "firebase/auth"
import SocialLogin from "@/components/forms/SocialLogin.vue"
import store from "@/store/store.js"

export default {
	name: "Login",
	components:
	{
		SocialLogin,
	},

	props: {},
	data: function()
	{
		return {
			auth: getAuth(),
			email: "",
			isLoading: true,
			isMounted: false,
			isRegistering: false,
			isShowingErrors: false,
			loginError: "",
			password: "",
			passwordConfirm: "",
			registrationError: "",
			success: false,
		}
	},

	computed:
	{
		/** @returns {object} Return errors object IFF showing errors; Else empty object */
		displayedErrors () 
		{
			if (this.isShowingErrors)
			{
				return this.errors
			}
			return {}
		},

		/**
		 * @todo validate email address too
		 * @returns {object} Return error message if applicable; Else empty string.
		 */
		errors () 
		{
			let errors = {}

			// Show confirm errors IFF user is registering
			errors.passwordConfirm = this.passwordsMatch ? "" : "Passwords do not match"
			errors.passwordConfirm = this.isRegistering ? errors.passwordConfirm : ""

			// In order from lease important to most important
			errors.password = /\d/.test(this.password) ?
				"" : "Password needs numeric character"
			errors.password = /[a-zA-Z]/.test(this.password) ?
				errors.password : "Password needs alphabetical character"
			errors.password = this.password.length >= 8 ?
				errors.password : "Password less than 8 characters"

			if (this.isRegistering)
			{
				errors.response = this.registrationError || ""
			}
			else
			{
				errors.response = this.loginError || ""
			}

			errors.email = this.email.length ? "" : "Please enter an email"

			return errors
		},

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

		/** @returns {boolean} When registering, if passwords match or not */
		passwordsMatch ()
		{
			return this.password === this.passwordConfirm
		},
	},
	methods: 
	{
		/** @returns {boolean} Whether focus was applied or not */
		assignFocus ()
		{
			if (!this.email)
			{
				this.$refs.email.focus()
				return false
			}
			else if (!this.password)
			{
				this.$refs.password.focus()
				return false
			}
			else if (!this.passwordConfirm && this.isRegistering)
			{
				this.$refs.passwordConfirm.focus()
				return false
			}
			return true
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
			// Check the mutex
			if (this.isLoggingIn)
			{
				// console.info('dont call more than once')
				return
			}

			// Set a mutex 
			this.$store.commit("setIsLoggingIn", true)

			// Clear any previous error message
			this.loginError = ""
			try
			{
				const response = await signInWithEmailAndPassword(
					this.auth,
					this.email,
					this.password
				)
				this.success = true

				// Update store
				this.$store.dispatch("fetchUser", response)

				this.$router.push({
					path: "/",
				})
			}
			catch (error)
			{
				if (error.code === "auth/user-not-found")
				{
					this.loginError = "User not found"
				}
				else
				{
					this.loginError = error.code
				}
			}
					
			// Release the mutex
			this.$store.commit("setIsLoggingIn", false)
		},

		/**
		 * Login or create a new user
		 *
		 * @todo https://firebase.google.com/docs/auth/web/email-link-auth?authuser=0#web-version-9_1
		 *			Use link to provide signup with email
		 * @returns {void}
		 * @since 0.1.0
		 */
		loginOrRegister ()
		{
			// First show errors and assign focus if applicable
			this.isShowingErrors = true
			if (!this.assignFocus())
			{
				return false
			}
			
			if (this.isRegistering)
			{
				return this.registerNewUser()
			}
			else
			{
				return this.login()
			}
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
			// First clear existing errors
			this.registrationError = ""

			/* eslint-disable no-unused-vars */
			try
			{
				const response = await createUserWithEmailAndPassword(
					this.auth,
					this.email,
					this.password
				)
				this.$router.push({
					path: "/",
				})
			}
			catch (error)
			{
				const errorCode = error.code
				const errorMessage = error.message

				// The AuthCredential type that was used.
				const credential = error.credential
				this.registrationError = errorMessage
			}
			/* eslint-enable no-unused-vars */
		},

	},
	watch:
	{
		/**
		 * Watch user logging out to manage local state
		 *
		 * @param {boolean} n - New value
		 * @param {boolean} o - Old value
		 */
		isLoggedIn (n, o)
		{
			if (n === false && o === true)
			{
				this.success = false
			}
		},

		/** */
		isRegistering ()
		{
			this.isShowingErrors = false
			this.passwordConfirm = ""
		},
	},
}
</script>

<style scoped lang="less">
@import "../../assets/styles/styles";

.login-page-wrapper {
	display: relative;
	flex-grow: 1;
	max-width: 70%;
	padding: 10px;
	padding-top: 43px;
	transition: all 0.5s ease;

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
			padding: 7px;
			width: auto;

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
			min-width: 90%;
			width: auto;

			.login-item {
				border-radius: 5px;
				border: 1px solid @color-purple;
				font-size: 20px;
				margin-bottom: 10px;
				min-height: 32px;
				transition: all 0.5s ease;
				width: 100%;

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
		}

		.login-button-wrapper {
			margin-bottom: 10px;
			margin-top: 10px;
			min-width: 50%;
			max-width: 50%;

			.login-button {
				margin-bottom: 14px;
			}
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
