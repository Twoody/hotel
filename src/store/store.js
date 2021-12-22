import Vue from "vue"
import { vuexfireMutations, firestoreAction } from "vuexfire"
import { db } from "../db"
import Vuex from "vuex"

// Sub Modules
import layout from "@/store/layout"
import user from "@/store/user"

Vue.use(Vuex)

export default new Vuex.Store({
	state: {},
	mutations: {
		// Other mutations
		...vuexfireMutations,
	},
	actions: {
		bindTodos: firestoreAction(
			({ bindFirestoreRef, }) => 
			{
				// return the promise returned by `bindFirestoreRef`
				return bindFirestoreRef("todos", db.collection("todos"))
			}
		),
		unbindTodos: firestoreAction(
			({ unbindFirestoreRef, }) => 
			{
				unbindFirestoreRef("todos")
			}
		),
	},
	modules:
	{
		layout,
		user,
	},
})
