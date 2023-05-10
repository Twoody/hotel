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
			<NavBar id="nav-wrapper" />
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
			:isShowing="$store.state.layout.isShowingFooter"
			@click="$store.commit('setIsShowingFooter', false)"
		>
			<div id="bottom-banner" />
		</AppSection>
	</div>
</template>

<script>
import {getAuth,
	onAuthStateChanged} from "firebase/auth"
import { initializeApp } from "firebase/app"

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
	created: function()
	{
		// List for online status changing
		this.$store.commit("setIsOnline", navigator.onLine)
		window.addEventListener("load", this.handleEventLoad)
		window.addEventListener("online", this.handleEventOnline)
		window.addEventListener("offline", this.handleEventOffline)

		try
		{
			const firebaseConfig = {
				apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
				appId: import.meta.env.VITE_FIREBASE_APP_ID,
				authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
				databaseURL: import.meta.env.VITE_DATABASE_URL,
				messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
				projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
				storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
			}

			// Get a Firestore instance
			initializeApp(firebaseConfig)

			const auth = getAuth()
			onAuthStateChanged(
				auth,
				(user) =>
				{
					// Update user via store
					this.$store.commit("setIsLoggingIn", true)
					this.$store.dispatch("fetchUser", user)

					if (user)
					{
						// User is signed in.
					}
					else
					{
						// No User
					}
					this.$store.commit("setIsLoggingIn", false)
				}
			)
		}
		catch (e)
		{
			console.error("Could not connect to firebase")
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
	min-height: 70px;
}

#nav-wrapper {
	background-color: @color-primary-triadic-2;
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
