/**
 * @returns {object} Initial state for all of our properties to easily be reset
 */
function initialState ()
{
	return {
		dailyRate: NaN,
		cleaningFee: NaN,
		kidDeposit: NaN,
		petFee: NaN,
		petDeposit: NaN,
	}
}

export default
{
	state: initialState(),

	getters:
	{},

	mutations:
	{
		setCleaningFee (state, amt)
		{
			state.cleaningFee = amt
		},

		setDailyRate (state, amt)
		{
			state.dailyRate = amt
		},

		setKidDeposit (state, amt)
		{
			state.kidDeposit = amt
		},

		setPetFee (state, amt)
		{
			state.petFee = amt
		},

		setPetDeposit (state, amt)
		{
			state.petDeposit = amt
		},
	},

	actions:
	{
		/**
		 * Attempt to keep previous hotel logged in
		 *
		 * @param {object} state - Current Vuex state.
		 * @param {object} hotel - Hotel object from Firebase auth and past session; Else empty object | null.
		 */
		fetchHotel (state, hotel)
		{
			if (hotel.invalid)
			{
				state.commit("setHotelData", {})
			}
			else
			{
				// Hotel is valid
				state.commit("setCleaningFee", hotel.cleaningFee || 0)
				state.commit("setDailyRate", hotel.dailyRate || 0)
				state.commit("setKidDeposit", hotel.kidDeposit || 0)
				state.commit("setPetDeposit", hotel.petDeposit || 0)
				state.commit("setPetFee", hotel.petFee || 0)
			}
		},

		/**
		 * Updates the hotel data in the Vuex store.
		 * Fetches the hotel's data from Firestore and updates the state accordingly.
		 * Handles invalid hotel data by clearing the state
		 *
		 * @param {object} root0 - The Vuex context object.
		 * @param {object} root0.state - Current Vuex state.
		 * @param {Function} root0.commit - Vuex commit function to call mutations.
		 * @param {Function} root0.dispatch - Vuex dispatch function to call actions.
		 * @todo Implement robust error handling with hotel feedback and optional redirect.
		 * @since 2.5.0
		 * @returns {Promise<void>}
		 */
		async updateUserStore ({ state, commit, dispatch, })
		{
			// Grab the user directly from the store
			const hotel = state.user

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

	},
}
