A page for users to better customize their experiences
and for users to see data regarding their account.
<template>
	<div
		class="setting-page-wrapper"
	>
		<div v-if="isAuthReady && isLoggedIn">
			<h1>Settings</h1>
			<div class="foo">
				<MyButton
					class="user-logout"
					:in-progress="isLoggingOut"
					pill
					@click="logout"
				>
					Logout
				</MyButton>
				<p>
					Work in Progress... Check back later
				</p>
			</div>
		</div>
		<div v-else-if="isAuthReady">
			Currently not logged in; Please visit
			<router-link
				class="nav-item"
				to="/login"
			>
				the login page
			</router-link>.
		</div>
	</div>
</template>

<script>
import { getAuth, signOut } from "firebase/auth"
import store from "@/store/store.js"

export default {
	name: "UserSettings",
	props: {},
	data: function()
	{
		return {
			isLoggingOut: false,
		}
	},

	computed:
	{
		/**
		 * @returns {boolean} - Whether a user is logged in or not
		 */
		isAuthReady ()
		{
			return store.state.user.isAuthReady
		},

		/**
		 * @returns {boolean} - Whether a user is logged in or not
		 */
		isLoggedIn ()
		{
			return store.state.user.isLoggedIn
		},
	},
	methods: 
	{
		/**
		 * Logout the current user and remove the user session
		 *
		 * @returns {void}
		 */
		async logout ()
		{
			// Check mutex
			if (this.isLoggingOut)
			{
				return
			}
			this.$sleep(5000)
			// Set mutex
			this.isLoggingOut = true
			try
			{
				const auth = getAuth()
				await signOut(auth)
			}
			catch (error)
			{
				console.error(
					error
				)
			}

			// Update store
			store.dispatch("logoutUser")

			// Update local setting
			this.isLoggingOut = false

			// Take user to meaningful page
			this.$router.push({
				path: "/",
			})
		},
	},
}
</script>

<style scoped lang="less">
@import "../../assets/styles/styles";

.setting-page-wrapper {
	background-color: @color-purple !important;
	border-radius: 7px;
	height: auto;
	margin-top: 7px;
	width: 100%;
	max-width: min(98%, 660px);

	h1 {
		border-bottom: 1px solid @myblack;
	}

	p {
		font-size: 25px;
	}
}
</style>

