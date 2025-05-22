<template>
	<div id="app">
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

			<!-- Consider a route guard via `beforeEach` instead -->
			<!-- Splash screen remains until both user and hotel data are ready -->
			<SplashScreen
				v-if="isShowingSplashScreen && false"
			/>
			<router-view
				v-else
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
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { TRUTHYS } from "@/utils/misc"

import NavBar from "@/components/nav/NavBar"
import SplashScreen from "@/components/entities/SplashScreen.vue"

export default {
	name: "App",
	components:
	{
		NavBar,
		SplashScreen,
	},
	data: function()
	{
		return {
			isNavCollapsed: true,
		}
	},
	computed:
	{
		/**
		 * @returns {boolean} If still setting up authentication or logging the user is, show the splash screen
		 */
		isShowingSplashScreen ()
		{
			return !this.$store.state.user.isAuthReady ||
				this.$store.state.user.isLoggingIn || 
				! this.$store.state.hotel.isLoaded
		},

		/**
		 * @returns {boolean} - Whether a user is considered an admin or not
		 * @todo Setup a loaded mock to point to on `airplaneMode`
		 * @since 2.5.0
		 */
		isUserAdmin ()
		{
			if (this.$store.state.isAirplaneMode)
			{
				return true
			}
			const isUserAdmin = !this.$store.state.user.invalid && this.$store.state.user.isAdmin
			return isUserAdmin
		},
	},
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
	created: async function() 
	{
		const __airplanMode = import.meta?.env?.VITE_AIRPLANE_MODE || false
		const isAirplaneMode = TRUTHYS.includes(__airplanMode)
		this.$store.commit("setIsAirplaneMode", isAirplaneMode)

		// Initialize Firebase & User Collection
		if (this.$store.state.isAirplaneMode)
		{
			this.$store.commit("setIsAuthReady", true)
			this.$store.commit("setIsLoggingIn", false)
		}
		else
		{
			try 
			{
				onAuthStateChanged(
					firebaseAuth,
					async (user) =>
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
							// Now that the user is authenticated, read from Firestore
							try 
							{
								// Attempts to add user to firestore if necessary
								const firestoreUser = await addUserToFirestore(user)
								let userData = firestoreUser.data()
								userData.uid = user.uid
								this.$store.dispatch("fetchUser", userData)
							}
							catch (e) 
							{
								console.error("App.vue: Could not connect to Firestore User Collection")
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

			// TODO: Eventually make this dynamic and able to switch between hotels
			const hotelUID = "RDfJBr73puFfGggTaQfi"

			try
			{
				const hotelDocRef = doc(db, "hotels", hotelUID)
				let docSnap = await getDoc(hotelDocRef)
				if (docSnap.exists()) 
				{
					const hotelData = docSnap.data()
					// Dispatch the hotel data to the namespaced hotel module
					this.$store.dispatch("fetchHotel", hotelData)
				}
				else 
				{
					// TODO: If hotel not returned, the app should enter an error state, too
					console.error("Hotel document not found for UID:", hotelUID)
					this.$store.dispatch("fetchHotel", {
						invalid: true, 
					})
				}
			}
			catch (e)
			{
				console.error("Error fetching hotel document:", e)
				this.$store.dispatch("fetchHotel", {
					invalid: true, 
				})
			}
		} // End not isAirplaneMode
	},
	beforeUnmount: function()
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
