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
		// New flag to indicate hotel data has been loaded
		isLoaded: false,
	}
}

export default {
	state: initialState(),

	getters: {},

	mutations: {
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

		// New mutation to set the hotel loaded flag
		setIsLoaded (state, value) 
		{
			state.isLoaded = value
		},
	},

	actions: {
		/**
		 * Attempt to keep previous hotel logged in.
		 *
		 * @param {object} context - Vuex context object.
		 * @param context.commit
		 * @param {object} hotel - Hotel object from Firestore; if invalid, contains { invalid: true }.
		 */
		fetchHotel ({ commit, }, hotel) 
		{
			console.log(hotel)
			if (hotel.invalid) 
			{
				// Optionally, reset hotel state or show an error
				commit("setIsLoaded", true)
			}
			else 
			{
				commit("setCleaningFee", hotel.cleaning_fee || 0)
				commit("setDailyRate", hotel.daily_Rate || 0)
				commit("setKidDeposit", hotel.kid_deposit || 0)
				commit("setPetDeposit", hotel.pet_deposit || 0)
				commit("setPetFee", hotel.pet_fee || 0)
				commit("setIsLoaded", true)
			}
		},

		// ... other actions
	},
}
