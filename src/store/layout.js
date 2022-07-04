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
	{},
}
