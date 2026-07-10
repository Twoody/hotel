const GUIDES = {
	BURNSIDE: 1,
	CANBY: 10,
	COLUMBIA_RIVER_GORGE: 11,
	EUGENE: 11,
	LAKE_OSWEGO: 8,
	LAVENDER_FARMS: 11,
	MADDOX: 2,
	MARKETS: 3,
	MSY: 5,
	MT_HOOD: 11,
	OREGON_CITY: 6,
	OREGON_COAST: 11,
	SAUVY_ISLAND: 11,
	STUB_STEWART: 11,
	TRYON: 11,
	WILAMETE_RIVER: 9,
	WILDNERNESS: 4,
}
const GUIDE_FILTERS = {
	1: "Dog Friendly",
	2: "Food",
	3: "Groceries",
	4: "Child Friendly",
	5: "Running",
	6: "Hiking",
	7: "Exercise",
	8: "Attractions",
	9: "Drinks",
	10: "Walking",
	11: "Shopping",
	12: "Music",
}

const HOTEL_STATUSES = {
	INACTIVE: 0,
	ACTIVE: 1,
	OFFLINE: 2, // Not Accepting Bookings
	BANNED: 3,
	UNDER_CONSTRUCTION: 4,
	ONBOARDING: 5,
}

export {
	HOTEL_STATUSES as HOTEL_STATUSES,
	GUIDE_FILTERS as GUIDE_FILTERS,
	GUIDES as GUIDES
}
