<template>
	<div id="app">
		<!-- TODO: Tie into vue comps -->
		<AppSection
			:isShowing="$store.state.layout.isShowingBanner"
			@click="$store.commit('setIsShowingBanner', false)"
		>
			<div id="top-banner">
				{{ $store.state.layout.bannerMessage }}
			</div>
		</AppSection>

		<!-- Handle appSection click for navbar on chevron and ations instead.. -->
		<AppSection
			class="nav-section"
			:isCollapsed="true"
			is-showing
		>
			<div class="flex-box nav-flex">
				<NavBar id="nav-wrapper" />
			</div>
		</AppSection>

		<AppSection
			centered
			class="main-section"
			is-showing
		>
			<router-view
				v-slot="{ Component }"
			>
				<transition
					name="fade"
					mode="out-in"
				>
					<component
						id="content-wrapper"
						:is="Component"
					/>
				</transition>
			</router-view>
		</AppSection>
		<AppSection
			centered
			class="legal-section"
			is-showing
		>
			<Copyright/>
		</AppSection>
		<AppSection
			:isShowing="$store.state.layout.isShowingFooter"
			@click="$store.commit('setIsShowingFooter', false)"
		>
			<div id="bottom-banner" />
		</AppSection>
	</div>
</template>

<script>
import { onAuthStateChanged } from "firebase/auth"
import { firebaseAuth } from "@/firebase" // Adjust path as necessary
import { addUserToFirestore } from "@/utils"

import NavBar from "components/nav/NavBar"

export default {
	name: "App",
	components:
	{
		NavBar,
	},
	data: function()
	{
		return {
			isNavCollapsed: true,
		}
	},
	computed: {},
	watch:
	{
		/**
		 * Reset offline banner state from closed when route changes
		 */
		"$route" ()
		{
			this.$store.commit("setIsShowingBanner", !navigator.onLine)
		},
	},
	// Inside your created function
	created: function() 
	{
		// Initialize Firebase
		try 
		{
			onAuthStateChanged(
				firebaseAuth,
				async (user) => // Make the callback async
				{
					// Check the mutex so multiple logins do not occur
					if (this.$store.state.user.isLoggingIn)
					{
						return
					}

					// Set a mutex that tracks when Firebase authentication state has finished loading
					this.$store.commit("setIsAuthReady", false)

					// Set a mutex so only one login occurs
					this.$store.commit("setIsLoggingIn", true)

					if (user?.uid)
					{
						// console.info("User is signed in:", user)

						// Now that the user is authenticated, read from Firestore
						try 
						{
							const firestoreUser = await addUserToFirestore(user)
							this.$store.dispatch("fetchUser", firestoreUser)
						}
						catch (e) 
						{
							console.error("App.vue: Could not connect to Firestore database")
							console.error(e)
						}
					}
					else
					{
						console.info("App.vue: No user is signed in")
						// Optionally, redirect to login page or show a message
					}
					
					// Release the mutex
					this.$store.commit("setIsLoggingIn", false)

					// Set a mutex that tracks when Firebase authentication state has finished loading
					this.$store.commit("setIsAuthReady", true)

				}
			)
		}
		catch (e)
		{
			console.error("Local: Could not connect to Firebase")
			console.error(e)
		}
	},
	beforeDestroy: function()
	{
		window.removeEventListener("load", this.handleEventLoad)
		window.removeEventListener("online", this.handleEventOnline)
		window.removeEventListener("offline", this.handleEventOffline)
	},
	methods:
	{
		/**
		 * Handle when the app is loaded
		 */
		handleEventLoad ()
		{
			if (navigator.onLine)
			{
				this.handleEventOnline()
			}
			else
			{
				this.handleEventOffline()
			}
		},

		/**
		 * Handle the app going offline
		 */
		handleEventOffline ()
		{
			// Tell user internet is disconnected
			this.$store.commit(
				"setBannerMessage",
				"Warning: No Internet"
			)

			// Configure environment accordingly
			this.$store.commit("setIsOnline", false) 
			this.$store.commit("setIsShowingBanner", true)
		},

		/**
		 * Handle when the app goes online
		 */
		handleEventOnline ()
		{
			this.$store.commit("setIsOnline", true) 
			this.$store.commit("setIsShowingBanner", false)

			// Last, reset the message text
			this.$store.commit( "setBannerMessage", "")
		},

	},
}
</script>

<style lang='less'>
@import "../assets/styles/styles";

html, body {
	color: @myblack;
	height: 100%;
	margin: 0;
	padding: 0;
	width: 100%;
}

#app {
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	background-color: @color-primary-triadic-1;
	color: @myblack;
	display: flex;
	flex-direction: column;
	//font-family: Avenir, Helvetica, Arial, sans-serif;
	font-family: 'Poppins', sans-serif;
	height: 100%;
	max-height: 100%;
	min-height: 100%;
	text-align: center;
	width: 100%;

}
#bottom-banner {
	background-color: @color-primary-triadic-3;
	bottom: 0;
	height: 50px;
	width: 100%;
}
#content-wrapper {
	background-color: @color-primary-triadic-1;
	overflow: scroll;
}

.main-section {
	flex: 1;
	max-height: 4000px !important;
}
.nav-section {
	background-color: @color-primary-triadic-2;
	min-height: 70px;
	min-width: 100%;

	.nav-flex {
		align-content: center;
		align-items: center;
		justify-content: space-evenly;
		min-width: 100%;
	}
}

#nav-wrapper {
}

#top-banner {
	align-items: center;
	background-color: @color-purple;
	color: @myblack;
	cursor: pointer;
	display: flex;
	filter: brightness(1.2);
	font-weight: 900;
	justify-content: flex-start;
	padding: 5px;
	padding-left: 11px;
	margin: 0;
	width: 100%;
}
.fade-enter-active,
.fade-leave-active {
	transition-duration: 0.2s;
	transition-property: opacity;
	transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
	opacity: 0
}

a:focus-visible {
	border-radius: 5px;
	outline: 4px solid @color-focus !important;
}
input:focus-visible {
	outline: 4px solid @color-focus !important;
	transform: scale(1.02);
}
button:focus-visible {
	outline: 4px solid @color-focus !important;
	transform: scale(1.02);
}
</style>
