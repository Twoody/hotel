/**
 * @returns {object} Initial state for all of our properties to easily be reset
 */
function initialState ()
{
	return {
		bannerMessage: "",
		footerMessage: "",
		isAdmin: false,
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
		setIsLayoutAdmin (state, value)
		{
			state.isAdmin = value
		},

		setBannerMessage (state, msg)
		{
			state.bannerMessage = msg
		},

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
