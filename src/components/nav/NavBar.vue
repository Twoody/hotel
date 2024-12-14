The general navbar for our project
<template>
	<div class="nav-wrapper">
		<div
			class="user-logout"
			@click="logout"
		>
			Logout
		</div>

		<div class="nav-items">
			<router-link
				class="nav-item"
				to="/"
			>
				Home
			</router-link>
			<router-link
				class="nav-item"
				to="/about"
			>
				About
			</router-link>
			<!-- TODO: Reasses manual page for actual manuals-->
			<!--
			<router-link
				class="nav-item"
				to="/manual"
			>
				Manual
			</router-link>
 -->
			<router-link
				class="nav-item"
				to="/maps"
			>
				Maps
			</router-link>
			<router-link
				class="nav-item"
				to="/amenities"
			>
				Amenities
			</router-link>
			<router-link
				v-if="!isLoggedIn"
				class="nav-item"
				to="/login"
			>
				Login
			</router-link>
		</div>
		<div
			v-if="isLoggedIn"
			class="user-items options-user"
			@click="gotoSettings"
		>
			<div
				class="user-item user-name"
			>
				{{ userInitials }}
			</div>
			<div class="user-item user-action">
				Settings
			</div>
		</div>
		<div
			v-else
			class="user-items options-guest"
		>
			<!-- Put any guest actions here -->
		</div>
	</div>
</template>

<script>
import { getAuth, signOut } from "firebase/auth"
import store from "@/store/store.js"

export default {
	name: "NavBar",
	computed:
	{
		/**
		 * @returns {string} - Users first name if loaded; Else empty string
		 */
		firstName ()
		{
			// console.info(store.state.user.user)
			return store.state.user.user.first_name || ""
		},

		/**
		 * @returns {boolean} - Whether the app is initializing the user or not
		 */
		isLoadingData ()
		{
			return store.state.user.isLoggingIn
		},

		/**
		 * @returns {boolean} - Whether a user is logged in or not
		 */
		isLoggedIn ()
		{
			return store.state.user.isLoggedIn
		},

		/**
		 * @returns {string} - Users last name if loaded; Else empty string
		 */
		lastName ()
		{
			return store.state.user.user.last_name || ""
		},

		/**
		 * @returns {string} - Users initials to be displayed; Else dash
		 */
		userInitials ()
		{
			const first = this.firstName.length ? this.firstName[0].toUpperCase() : ""
			const last = this.lastName.length ? this.lastName[0].toUpperCase() : ""
			return (first + last) || "-"
		},
	},
	methods:
	{
		gotoSettings ()
		{
			this.$router.push({
				path: "/settings",
			})
		},

		/**
		 * Logout the current user and remove the user session
		 *
		 * @returns {void}
		 */
		async logout ()
		{
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
			store.dispatch("logoutUser")
		},
	},
}
</script>

<style lang="less">
@import "../../../assets/styles/styles";

/* @todo setup a main file and set margins/padding there probably */
.nav-wrapper {
	@v-padding: 30px;
	align-content: center;
	align-items: center;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: flex-start;
	padding: 10px;
	padding-bottom: @v-padding;
	padding-top: @v-padding;
	position: relative;
	width: 100%;

	.nav-items {
		flex-grow: 1;

		.nav-item {
			margin: 5px;
		}
	}
	.user-items {
		border: 1px solid @myblack;
		border-radius: 50px;
		display: flex;
		flex-direction: column;
		flex-grow: 0;
		flex-shrink: 1;

		&.options-guest {
			border: none;
		}
		.user-item {
			margin: 3px;
			margin-left: 6px;
			margin-right: 6px;
		}
		.user-action {
			border-top: 1px solid @myblack;
			font-size: 12px;
			margin-bottom: 5px;
			margin-left: 11px;
			margin-right: 11px;
		}
		.user-name {
			font-size: 20px;
			margin-top: 5px;
		}
	}
	.user-logout {
		font-size: 13px;
		margin-top: 4px;
		padding-left: 5px;
	}

}
a {
	font-weight: bold;
	color: #2c3e50;
}
a.router-link-exact-active {
	color: #42b983;
}
</style>
