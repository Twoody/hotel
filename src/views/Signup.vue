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

			<SocialLogin />
		</div>
	</div>
</template>

<script>
import firebase from "firebase"
import SocialLogin from "@/components/forms/SocialLogin.vue"
import store from "../store/store.js"

export default {
	name: "Signup",
	components:
	{
		SocialLogin,
	},

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
}
</style>

