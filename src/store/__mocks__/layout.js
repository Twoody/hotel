import Vue from "vue"

/**
 * @returns {object} Initial state for all of our properties to easily be reset
 */
function initialState ()
{
	return {
		bannerMessage: "",
		footerMessage: "",
		isNavCollapsed: false,
		isShowingBanner: false,
		isShowingFooter: false,
		isShowingNav: true,
	}
}

export default
{
	state: initialState(),

	getters:
	{},

	mutations:
	{
		setIsNavCollapsed (state, value)
		{
			state.isNavCollapsed = value
		},

		setIsShowingBanner (state, value)
		{
			state.isShowingBanner = value
		},

		setIsShowingFooter (state, value)
		{
			state.isShowingFooter = value
		},

		setIsShowingNav (state, value)
		{
			state.isShowingNav = value
		},
	},

	actions:
	{
		/**
		 * Just an example
		 *
		 * @param {object} state - Current vuex state
		 * @param {object} root0 - Different arguments to be controlled
		 * @param {object.object} root0.bar - Just an example of setting a property `entity`
		 */
		foo (state, {bar,})
		{
			Vue.set(
				state.baz,
				"entity",
				bar
			)
		},
	},
}
