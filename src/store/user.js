import { getUsersAccount } from "@/utils/firestore.js"

/**
 * @returns {object} Initial state for all of our properties to easily be reset
 */
function initialState ()
{
	return {
		isAuthReady: null,
		isLoggedIn: false,
		isLoggingIn: false,
		user: {
			invalid: true,
			isAdmin: false,
		},
	}
}

export default {
	state: initialState(),

	getters: {},

	mutations: {
		/**
		 * Set a mutex that tracks when Firebase authentication state has finished loading
		 *
		 * @param {object} state - Current vuex state
		 * @param {boolean} value - True if auth is ready; False if currently checking auth; Null if never initiated
		 */
		setIsAuthReady (state, value)
		{
			state.isAuthReady = value
		},

		/**
		 * Set whether user is logged in or not
		 *
		 * @param {object} state - Current vuex state
		 * @param {boolean} value - True if user logged in; Else false
		 */
		setIsLoggedIn (state, value)
		{
			state.isLoggedIn = value
		},

		/**
		 * Set whether user is logging in or not
		 *
		 * @param {object} state - Current vuex state
		 * @param {boolean} value - True if user is logging in; Else false
		 */
		setIsLoggingIn (state, value)
		{
			state.isLoggingIn = value
		},

		/**
		 * Set the user data stored via firebase
		 *
		 * @param {object} state - Current vuex state
		 * @param {object} user - User data to be set
		 */
		setUserData (state, user)
		{
			state.user = user
		},
	},

	actions: {
		/**
		 * Updates the user data in the Vuex store.
		 * Fetches the user's data from Firestore and updates the state accordingly.
		 * Handles invalid user data by clearing the state and setting login status to false.
		 *
		 * @param {object} root0 - The Vuex context object.
		 * @param {object} root0.state - Current Vuex state.
		 * @param {Function} root0.commit - Vuex commit function to call mutations.
		 * @param {Function} root0.dispatch - Vuex dispatch function to call actions.
		 * @todo Implement robust error handling with user feedback and optional redirect.
		 * @since 2.3.0
		 * @returns {Promise<void>}
		 */
		async updateUserStore ({ state, commit, dispatch, })
		{
			// Grab the user directly from the store
			const currentUser = state.user

			try
			{
				// 1) Fetch the Firestore document for this user
				const userDoc = await getUsersAccount(currentUser)
				let updatedUser = userDoc.data()
				updatedUser.uid = currentUser.uid

				// 2) If valid, dispatch 'fetchUser' which calls the mutation to set user data, etc.
				if (!userDoc.invalid)
				{
					dispatch("fetchUser", updatedUser)
				}
				else
				{
					console.error("User doc is invalid or not found. updateUserStore aborted.")
					// Optionally nuke any user data so the UI doesn’t assume there’s a valid user
					commit("setUserData", {})
					commit("setIsLoggedIn", false)
				}
			}
			catch (error)
			{
				console.error("Error in updateUserStore:", error)
				// Optionally clear out user data so the app doesn’t get stuck
				commit("setUserData", {})
				commit("setIsLoggedIn", false)
			}
		},

		/**
		 * Attempt to keep previous user logged in
		 *
		 * @param {object} state - Current Vuex state.
		 * @param {object} user - User object from Firebase auth and past session; Else empty object | null.
		 */
		fetchUser (state, user)
		{
			if (user.invalid)
			{
				state.commit("setIsLoggedIn", false)
			}
			else
			{
				// User is valid
				state.commit("setUserData", user)
				state.commit("setIsLoggedIn", true)
			}
		},

		/**
		 * Clears the current user data and resets store status.
		 *
		 * @param {object} state - Current Vuex state.
		 */
		logoutUser (state)
		{
			state.commit("setUserData", {})
			state.commit("setIsLoggedIn", false)
		},
	},
}

