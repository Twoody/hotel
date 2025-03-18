The general navbar for our project
<template>
	<div class="nav-wrapper">
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
				v-if="!isLoggedIn && !isLoadingData"
				class="nav-item"
				to="/login"
			>
				Login
			</router-link>
		</div>
		<div
			v-if="isLoadingData"
			class="user-items"
		>
			<div class="user-icon">
				<LoadingBar size="small" tall/>
			</div>
		</div>
		<div
			v-if="isLoggedIn"
			class="user-items"
			@click="gotoUserSettings"
		>
			<div class="user-icon">
				<font-awesome-icon icon="user-cog" class="fa-xl"/>
			</div>
			<div
				v-if="isUserAdmin"
				class="action-items"
			>
				<MyButton
					class="switch-to-user"
					pill
					@click="switchToSubdomain('admin')"
				>
					Switch to Admin
				</MyButton>
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

export default {
	name: "NavBar",
	computed:
	{
		/**
		 * @returns {string} - Users first name if loaded; Else empty string
		 */
		firstName ()
		{
			return this.$store.state.user.user.first_name || ""
		},

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
			if (this.$store.state.isAirplaneMode)
			{
				return true
			}
			return this.$store.state.user.isLoggedIn
		},

		/**
		 * @returns {boolean} - Whether a user is considered an admin or not
		 */
		isUserAdmin ()
		{
			if (this.$store.state.isAirplaneMode)
			{
				return true
			}
			return !this.$store.state.user.invalid && this.$store.state.user.isAdmin
		},

		/**
		 * @returns {string} - Users last name if loaded; Else empty string
		 */
		lastName ()
		{
			return this.$store.state.user.user.last_name || ""
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

		switchToSubdomain (target)
		{

			const fullpath = target
				? `${target}.localhost:5173`
				: "localhost:5173"
			console.log(fullpath)
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
			padding-bottom: 11px;
			padding-top: 3px;
		}
	}
	.action-items {
		position: absolute;
		right: 6px;
		top: -2px;
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
