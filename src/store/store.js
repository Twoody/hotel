import { createStore } from "vuex"

// Sub Modules
import hotel from "@/store/hotel"
import layout from "@/store/layout"
import user from "@/store/user"

/**
 * @returns {object} Initial state for all of our properties to easily be reset
 */
function initialState ()
{
	return {
		isOnline: true,
		isAirplaneMode: true,
	}
}

export default createStore({
	state: initialState(),
	mutations:
	{
		setIsAirplaneMode (state, value)
		{
			state.isOnline = !value
			state.isAirplaneMode = value
		},
		setIsOnline (state, value)
		{
			state.isOnline = value
		},
	},
	actions: {},
	modules:
	{
		hotel,
		layout,
		user,
	},
})
