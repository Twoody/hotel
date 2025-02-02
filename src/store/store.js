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
	}
}

export default createStore({
	state: initialState(),
	mutations:
	{
		setIsOnline (state, msg)
		{
			state.isOnline = msg
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
