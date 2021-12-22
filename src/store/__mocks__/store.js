import Vue from "vue"
import Vuex from "vuex"

// Sub Modules
import layout from "store/__mocks__/layout"
import user from "store/__mocks__/user"

Vue.use(Vuex)

export default new Vuex.Store({
	state: {},
	mutations: {},
	actions: {},
	modules:
	{
		layout,
		user,
	},
})
