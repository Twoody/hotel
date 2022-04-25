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
	BURNSIDE: {
		id: 1,
		map_map_id: 1,
	},
	CANBY: {
		id: 10,
		map_id: 10,
	},
	COLUMBIA_RIVER_GORGE: {
		id: 11,
		map_id: 11,
	},
	EUGENE: {
		id: 11,
		map_id: 11,
	},
	LAKE_OSWEGO: {
		id: 8,
		map_id: 8,
	},
	LAVENDER_FARMS: {
		id: 11,
		map_id: 11,
	},
	MADDOX: {
		id: 2,
		map_id: 2,
	},
	MARKETS: {
		id: 3,
		map_id: 3,
	},
	MSY: {
		id: 5,
		map_id: 5,
	},
	MT_HOOD: {
		id: 11,
		map_id: 11,
	},
	OREGON_CITY: {
		id: 6,
		map_id: 6,
	},
	OREGON_COAST: {
		id: 11,
		map_id: 11,
	},
	SAUVY_ISLAND: {
		id: 11,
		map_id: 11,
	},
	STUB_STEWART: {
		id: 11,
		map_id: 11,
	},
	TRYON: {
		id: 11,
		map_id: 11,
	},
	WILAMETE_RIVER: {
		id: 9,
		map_id: 9,
	},
	WILDNERNESS: {
		id: 4,
		map_id: 4,
	},
}
const LOCAL: {
	BURNSIDE: {
		description: '',
		maps_id: 1,
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
		maps_id: 2,
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
		maps_id: 3,
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
		maps_id: 4,
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
		maps_id: 5,
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
		maps_id: 6,
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
		maps_id: 7,
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
		maps_id: 8,
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
		maps_id: 9,
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
		maps_id: 10,
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
		maps_id: 11,
		tags: [
			'long run',
			'bike',
			'hike',
			'dog friendly',
		],
		title: '',
	},
},
const DAY_TRIPS: {
		EUGENE: {
			description: '',
			maps_id: 12,
			tags: [
				'',
				'',
				'',
			],
			title: '',
		},
		OREGON_COAST: {
			description: '',
			maps_id: 13,
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
			maps_id: 14,
			tags: [
				'',
				'',
				'',
			],
			title: '',
		},
		MT_HOOD: {
			description: '',
			maps_id: 15,
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
			maps_id: 16,
			tags: [
				'',
				'',
				'',
			],
			title: '',
		},
		STUB_STEWART: {
			description: '',
			maps_id: 17,
			tags: [
				'frisbee golf',
				'',
				'',
			],
			title: '',
		},
		COLUMBIA_RIVER_GORGE: {
			description: '',
			maps_id: 18,
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
