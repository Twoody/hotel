/**
 * @returns {object} Initial state for all of our properties to easily be reset
 */
function initialState ()
{
	return {
		isLoggedIn: false,
		isLoggingIn: false,
	}
}

export default
{
	state: initialState(),

	getters:
	{},

	mutations:
	{
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
		 * @param {boolean} value - True if user logged in; Else false
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

	actions:
	{
		/**
		 * Attempt to keep previous user logged in
		 *
		 * @param {object} state - Current vuex state
		 * @param {object} user - User object from firebase auth and past session; Else empty object | null
		 */
		fetchUser (state, user)
		{
			const isLoggedIn = user !== null
			const userData = {}
			userData.displayName = user && user.displayName ? user.displayName : ""
			userData.email = user && user.email ? user.email : ""
			state.commit("setUserData", userData)
			state.commit("setIsLoggedIn", isLoggedIn)
		},

		/**
		 * Nuke the current user data and store status
		 *
		 * @param {object} state - Current vuex state
		 */
		logoutUser (state)
		{
			state.commit("setUserData", {})
			state.commit("setIsLoggedIn", false)
		},
	},
}
