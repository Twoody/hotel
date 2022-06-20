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
					v-if="!isRegistering"
					class="login-button"
					@click="login"
					:in-progress="loggingIn"
					:success="success"
				>
					{{ buttonText }}
				</MyButton>
			</div>

			<div
				class="register-section"
				:class="{registering: isRegistering}"
			>
				<NewUserLogin
					:email="email"
					:password="password"
					:passwordsMatch="passwordConfirm === password"
					:ready="isRegistering"
					@click="handleRegistClick"
					@error="registrationError = arguments[0]"
				/>
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
			loggingIn: false,
			password: "",
			passwordConfirm: "",
			registrationError: "",
			success: false,
		}
	},

	computed:
	{
		/**
		 */
		buttonText () 
		{
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
			transition: all 0.3s ease;

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

