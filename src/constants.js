const AMENITIES = {
	GENERAL: [
		{
			id: 11,
			title: "Fiber Wifi",
			download: "160mbps",
			help: "Call or text Tanner :)",
			password: "See the peg board",
			upload: "117mbps",
		},
		{
			id: 12,
			title: "Books Entertainment",
			notables: "Calvin & Hobbes Collection, Chicken Soup for the Soul",
		},
		{
			id: 13,
			title: "Books Recreational",
			notables: "Hiking, eating, traveling, exploring, birds, plants, dogs",
		},
		{
			id: 14,
			title: "Board Games & Cards & Puzzles",
			notables: "Oregon Trail, Uno, ...",
		},
		{
			id: 15,
			title: "Public Parking",
			Notes: "See more in the **Home Instructions**",
		},
	],
	GROCERIES: [
		{
			id: 16,
			title: "Olive Oil",
			brand: "Kirkland",
		},
		{
			id: 17,
			title: "Pink Salt",
			brand: "Kirkland",
		},
		{
			id: 18,
			title: "Ground Pepper",
			brand: "Kirkland",
		},
		{
			id: 19,
			title: "Premium Coffee",
			brand: "Kirkland",
		},
		{
			id: 20,
			title: "Premium Tea Selection",
			brand: "Kirkland",
		},
		{
			id: 24,
			title: "Brita Water Filter",
			brand: "Brita",
			notes: "Fits in fridge; Filters need replaced every 2 months",
		},
	],
	BATHROOM : [
		//		{
		//			id: 9999,
		//			brand: '',
		//			description: '',
		//			model: '',
		//			title: '',
		//			year: 2021,
		//		},
		{
			id: 10,
			brand: "",
			description: "",
			model: "",
			title: "Laundry Soap",
			year: 2021,
		},
		{
			id: 5,
			brand: "",
			description: "",
			model: "",
			title: "Hair Dryer",
			year: 2021,
		},
		{
			id: 6,
			brand: "",
			description: "",
			model: "",
			title: "Washer",
			year: 2021,
		},
		{
			id: 7,
			brand: "",
			description: "",
			model: "",
			title: "Dryer",
			year: 2021,
		},
		{
			id: 8,
			brand: "",
			description: "",
			model: "",
			title: "Ironing Board",
			year: 2021,
		},
		{
			id: 9,
			brand: "",
			description: "",
			model: "",
			title: "Iron",
			year: 2021,
		},

	],
	BEDRROM: [
		{
			id: 23,
			title: "Bedroom Fan w/ Remote control",
			brand: "",
			model: "",
			notes: "Remote takes xxx batteries",
		},
		{
			id: 22,
			title: "Comforters and Sheets",
			notes: "Cotton, flannel, hypoallergenic, ...",
		},
		{
			id: 21,
			title: "Pillows and Pillow Cases",
			notes: "Cotton, flannel, satin, silk, ...",
		},
	],
	KITCHEN: [
		{
			id: 1,
			brand: "Vitamix",
			description: "Powerful blender which ensures smooth smoothy. No gritty contents!",
			model: "Explorian",
			title: "Blender",
			year: 2021,
		},
		{
			id: 2,
			brand: "Chefman",
			description: "Brings water to a boil within minutes",
			model: "rj11-17-ti Costco",
			title: "Electric Tea Kettle",
			year: 2021,
		},
	],
	LIVING_ROOM: [
		{
			id: 3,
			brand: "TLC",
			description: "Wall mounted TV, which is visible throughout the entire studio. Runs in Guest Mode.",
			model: "",
			title: "55\" Roku TV",
			year: 2021,
		},
		{
			id: 4,
			brand: "",
			description: "Both an ambient and ergonomic addition to the space",
			model: "",
			title: "Electric Gas Fireplace",
			year: 2021,
		},
	],
}

// TODO: Downtown things to do
const DOWNTOWN = {
	MARKET: {
	},
	COFFEE: {
	},
	FOOD: {
	},
	MUSIC: {
	},
	DOG_BAR: {
	},
}

// TODO: Day iteneraries
const DAY_PLANS = {
	RIVER_GORGE: {
	},
	DOWNTOWN_SUMMER: {
	},
	DOWNTONW_SPRING: {
	},
	DOWNTOWN_FOODIE: {
	},
	DOWNTOWN_FALL: {
	},
	DOWNTOWN_WINTER: {
		// christmas boat parade
		// spaghetti factory
	},
}

// TODO: Make polymorphic and just pull out IDs in other entities
const MAPS = {
	LOCAL: {
		BURNSIDE: {
			description: '',
			end_at: '',
			start_at: '',
			tags: [
				'dog friendly',
				'walk',
				'relaxing',
			],
			title: '',
		},
		MADDOX: {
			description: '',
			end_at: '',
			start_at: '',
			tags: [
				'dog friendly',
				'walk',
				'relaxing',
			],
			title: '',
		},
		MARKETS: {
			description: '',
			end_at: '',
			start_at: '',
			tags: [
				'dog friendly',
				'walk',
				'food',
				'relaxing',
			],
			title: '',
		},
		WILDNERNESS: {
			description: '',
			end_at: '',
			start_at: '',
			tags: [
				'dog friendly',
				'run',
				'walk',
				'relaxing',
			],
			title: '',
		},
		MSY: {
			description: '',
			end_at: '',
			start_at: '',
			tags: [
				'dog friendly',
				'run',
				'walk',
				'relaxing',
				'state park',
				'dog beach',
				'dog park',
			],
			title: '',
		},
		OREGON_CITY: {
			description: '',
			end_at: '',
			start_at: '',
			tags: [
				'long walk',
				'run',
				'food carts',
				'dog friendly',
				'',
			],
			title: '',
		},
		ORANGE_THEORY: {
			description: '',
			end_at: '',
			start_at: '',
			tags: [
				'',
				'',
				'',
			],
			title: '',
		},
		LAKE_OSWEGO: {
			description: '',
			end_at: '',
			start_at: '',
			tags: [
				'',
				'',
				'',
			],
			title: '',
		},
		WILAMETE_RIVER: {
			description: '',
			end_at: '',
			start_at: '',
			tags: [
				'kayak rental',
				'sup rental',
				'',
			],
			title: '',
		},
		CANBY: {
			description: '',
			end_at: '',
			start_at: '',
			tags: [
				'live music',
				'drive',
				'bike',
			],
			title: '',
		},
		TRYON: {
			description: '',
			end_at: '',
			start_at: '',
			tags: [
				'long run',
				'bike',
				'hike',
				'dog friendly',
			],
			title: '',
		},
	},
	DAY_TRIPS: {
		EUGENE: {
			description: '',
			tags: [
				'',
				'',
				'',
			],
			title: '',
		},
		OREGON_COAST: {
			description: '',
			tags: [
				'',
				'',
				'',
			],
			title: '',
			subtitle: 'Haystack rock, Seaside,',
		},
		SAUVY_ISLAND: {
			description: '',
			tags: [
				'',
				'',
				'',
			],
			title: '',
		},
		MT_HOOD: {
			description: '',
			tags: [
				'',
				'',
				'',
			],
			title: '',
			subtitle: 'Trillium Lake, Timberline Ridge, ski lodges,',
		},
		LAVENDER_FARMS: {
			description: '',
			tags: [
				'',
				'',
				'',
			],
			title: '',
		},
		STUB_STEWART: {
			description: '',
			tags: [
				'frisbee golf',
				'',
				'',
			],
			title: '',
		},
		COLUMBIA_RIVER_GORGE: {
			description: '',
			tags: [
				'',
				'',
				'',
			],
			title: '',
		},
	},
}

export {
	AMENITIES as AMENITIES,
	DOWNTOWN as DOWNTOWN_ACTIVITIES,
	DAY_PLANS as DAY_PLANS,
	MAPS as MAPS,
}
