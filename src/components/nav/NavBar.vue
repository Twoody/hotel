<template>
	<div class="nav-wrapper">
		<div class="nav-items">
			<router-link
				class="nav-item"
				:to="isNavigatingToAdmin ? '/a/' : '/'"
			>
				Home
			</router-link>
			<router-link
				class="nav-item"
				:to="isNavigatingToAdmin ? '/a/about' : '/about'"
			>
				About
			</router-link>
			<router-link
				class="nav-item"
				:to="isNavigatingToAdmin ? '/a/guides' : '/guides'"
			>
				Guides
			</router-link>
			<router-link
				class="nav-item"
				:to="isNavigatingToAdmin ? '/a/amenities' : '/amenities'"
			>
				Amenities
			</router-link>
			<router-link
				v-if="isNavigatingToAdmin"
				class="nav-item"
				to="/a/users"
			>
				Users
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
				<LoadingBar size="small" tall />
			</div>
		</div>

		<div
			v-else-if="isLoggedIn"
			class="user-items"
			@click="gotoUserSettings"
		>
			<div class="user-icon">
				<font-awesome-icon icon="user-cog" class="fa-xl" />
			</div>
		</div>

		<div v-else class="user-items options-guest">
			<!-- Guest actions here if needed -->
		</div>
		<SwitchRoles
			v-if="isUserAdmin"
			class="action-items"
		/>
	</div>
</template>

<script>
import SwitchRoles from "@/components/buttons/SwitchRoles.vue"

export default {
	name: "NavBar",
	components: {
		SwitchRoles, 
	},
	computed: {
		isLoadingData () 
		{
			return this.$store.state.user.isLoggingIn
		},
		isLoggedIn () 
		{
			return this.$store.state.isAirplaneMode || this.$store.state.user.isLoggedIn
		},
		isNavigatingToAdmin ()
		{
			const isAdminPath = this.$route.path.startsWith("/a/")
			return isAdminPath && this.isUserAdmin
		},
		isUserAdmin () 
		{
			return this.$store.state.isAirplaneMode
				|| (!this.$store.state.user.invalid && this.$store.state.user.isAdmin)
		},
	},
	methods: {
		async gotoUserSettings () 
		{
			await this.$router.replace({
				path: "/settings", 
			})
			window.location.reload()
		},
	},
}
</script>

<style lang="less">
@import '../../../assets/styles/styles';

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
}

a {
	font-weight: bold;
	color: #2c3e50;
	&.router-link-exact-active {
		color: #42b983;
	}
}
</style>

