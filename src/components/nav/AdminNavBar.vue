The admin navbar for our project
<template>
	<div
		v-if="isUserAdmin"
		class="admin-nav-wrapper nav-wrapper"
	>
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
			<router-link
				class="nav-item"
				to="/guides"
			>
				Guides
			</router-link>
			<router-link
				class="nav-item"
				to="/amenities"
			>
				Amenities
			</router-link>
			<router-link
				class="nav-item"
				to="/users"
			>
				Users
			</router-link>
		</div>
	</div>
</template>

<script>

export default {
	name: "NavBar",
	computed:
	{
		/**
		 * @returns {boolean} - Whether the app is initializing the user or not
		 */
		isLoadingData ()
		{
			return this.$store.state.user.isLoggingIn
		},

		/**
		 * @returns {boolean} - Whether a user is logged in or not
		 */
		isLoggedIn ()
		{
			return this.$store.state.user.isLoggedIn
		},

		/**
		 * @returns {boolean} - Whether a user is considered an admin or not
		 */
		isUserAdmin ()
		{
			// return !this.$store.state.user.invalid && nthis.$store.state.user.isAdmin
			return true
		},
	},
	methods:
	{
		/** @returns {void} If user-cog is clicked while on settings page, always refresh */
		async gotoUserSettings ()
		{
			// Update the URI to default
			await this.$router.replace({
				path: "/settings", 
			})

			// Force reload the page 
			window.location.reload()
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
	max-width: 500px;
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
		cursor: pointer;

		.user-icon {
			margin-right: 13px;
		}
	}
	.user-logout {
		cursor: pointer;
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

