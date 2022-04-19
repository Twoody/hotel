// TODO: Either setup a running store per docs or plugin stuff from store
// e.g. test/.../nav/* has a store implementation

export default
{
	state:
	{
		isLoggedIn: true,
		isLoggingIn: false,
		user: {},
	},

	getters:{},

	mutations:
	{
		setIsLoggedIn: jest.fn(),
		setIsLoggingIn: jest.fn(),
		setUserData: jest.fn(),
	},

	actions:
	{
		fetchUser: jest.fn(),
		logoutUser: jest.fn(),
	},
}
