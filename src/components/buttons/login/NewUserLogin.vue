Button to instantiate a new user
<template>
	<div
		class="new-user-login-wrapper"
		@click="handleClick"
	>
		<div class="social-button-dex">
			Register Email
		</div>
		<MyButton
			class="social-button"
			:disabled='isDisabled'
			@click="registerNewUser"
		>
			<font-awesome-icon
				alt="New User Registration" 
				class="svg-wrapper"
				:icon="['fa', 'clipboard-list']"
				:style="{ color: '#FEE8B9' }"
			/>
		</MyButton>
	</div>
</template>

<script>
import firebase from "firebase"
import MyButton from "@/components/buttons/MyButton.vue"

export default {
	name: "NewUserRegistration",
	components:
	{
		MyButton,
	},
	data() {
		return {
			isShowingErrors: false,
			registrationError: '',
		}
	},
	props:
	{
		email: 
		{
			default: '',
			required: true,
			type: String,
		},
		password:
		{
			default: '',
			required: true,
			type: String,
		},

		passwordsMatch: Boolean,

		/** Is the payload ready to be submitted */
		ready: Boolean,
	},
	computed:
	{
		/**
		 * @todo validate email address too
		 * @return {string} Return error message if applicable; Else empty string.
		 */
		errors() {
			if (!this.passwordsMatch)
			{
				return 'Passwords do not match'
			}
			if (this.password.length <= 8)
			{
				return 'Password less than 8 characters'
			}
			if (!/[a-zA-Z]/.test(this.password))
			{
				return 'Password needs alphabetical character'
			}
			if (!/\d/.test(this.password))
			{
				return 'Password needs numeric character'
			}
			if (this.registrationError)
			{
				return this.registrationError
			}

			return ''
		},

		/** */
		displayedError() {
			if (this.isShowingErrors)
			{
				return this.errors
			}
			return ''
		},

		/** */
		isDisabled()
		{
			if (!this.ready)
			{
				return true
			}
			if (!this.email)
			{
				return true
			}
			if (this.errors)
			{
				return true
			}
			return false
		},
	},
	methods:
	{
		/** */
		handleClick()
		{
			this.isShowingErrors = true
			this.$emit('click')
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
			this.registrationError = ''
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
		displayedError (n, o)
		{
			this.$emit('error', n)
		},
	},
}
</script>

<style lang='less' scoped>
.social-button {
	background: white;
	border-radius: 50px !important;
	filter: brightness(97%) !important;
	width: auto !important;
	.svg-wrapper {
		height: 65px;
		padding: 5px;
		width: 65px;
	}
}
@media (hover: hover) {
	.social-button:hover {
		filter: brightness(104%) !important;
	}
}

</style>

