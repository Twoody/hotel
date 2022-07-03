import { db } from "../db"
import { createStore } from 'vuex'

// Sub Modules
import layout from "@/store/layout"
import user from "@/store/user"


export default createStore({
	state: {},
	mutations: {
		// Other mutations
	},
	actions: {
	},
	modules:
	{
		layout,
		user,
	},
})
