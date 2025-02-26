import { createWebHistory, createRouter } from "vue-router"
import { logEvent } from "firebase/analytics"
import { firebaseAnalyics } from "@/firebase" // using the pre-initialized db

import AirbnbCleaning from "../views/AirbnbCleaning.vue"
import Amenities from "../views/Amenities.vue"
import Home from "../views/Home.vue"
import Login from "../views/Login.vue"
import ManageBooking from "../views/bookings/ManageBooking.vue"
import Maps from "../views/Maps.vue"
import MapItem from "../views/MapItem.vue"
import NotFound from "../views/NotFound.vue"
import UserSettings from "../views/settings/UserSettings.vue"
import ThermometerPage from "../views/ThermometerPage.vue"

const routes = [
	{
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
		name: "about",
		path: "/about",
	},
	{
		component: AirbnbCleaning,
		name: "airbnbCleaning",
		path: "/airbnb-cleaning",
	},
	{
		component: Amenities,
		name: "amenities",
		path: "/amenities",
	},
	{
		component: Home,
		name: "home",
		path: "/",
	},
	{
		component: Login,
		name: "login",
		path: "/login",
	},
	{
		component: Maps,
		name: "maps",
		path: "/maps",
	},
	{
		component: MapItem,
		name: "mapItem",
		path: "/maps/:id",
	},
	{
		component: ManageBooking,
		name: "manageBooking",
		path: "/booking/:id",
	},
	{
		component: NotFound,
		path: "/:catchAll(.*)",
		name: "404",
	},
	{
		component: UserSettings,
		name: "settings",
		path: "/settings",
	},
	{
		component: ThermometerPage,
		name: "thermometer-page",
		path: "/thermometer",
	},
]

const router = createRouter({
	base: import.meta.env.BASE_URL,
	history: createWebHistory(),
	routes,
})

router.beforeEach((to, from, next) =>
{
	if (parseFloat(import.meta.env.VITE_CI))
	{
		try
		{
			logEvent(
				firebaseAnalyics,
				"page_view",
				{
					// type: "internal",
					title: to.name,
				}
			)
		}
		catch (e)
		{
			console.error(e)
		}
	}
	next()
})

export default router
