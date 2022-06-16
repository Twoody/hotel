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
	methods:
	{
		/**
		 * Use firebase to support logging in with a new account
		 *
		 * @returns {void}
		 * @since 0.1.3
		 */
		async registerNewUser ()
		{
			/* eslint-disable no-unused-vars */
			const provider = new firebase.auth.FacebookAuthProvider()
			provider.addScope("user_birthday")

			try
			{
				const response = await firebase.auth().signInWithPopup(provider)

				// The signed-in user info.
				const user = response.user
				// This gives you a Facebook Access Token.
				const credential = response.credential
				const token = credential.accessToken
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
				console.error(provider)
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

