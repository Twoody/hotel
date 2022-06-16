Button to instantiate a new user
<template>
	<div class="new-user-login-wrapper">
		<div class="social-button-dex">
			New User
		</div>
		<MyButton
			class="social-button"
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
	props:
	{
		email: String,
		password: String,
	},
	methods:
	{
		/**
		 * Use firebase to support logging in with a new account
		 *
		 * @todo configure errors for user logging in
		 * @returns {void}
		 * @since 0.1.3
		 */
		async registerNewUser ()
		{
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
			}
			/* eslint-enable no-unused-vars */
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

