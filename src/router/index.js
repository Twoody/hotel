import { createWebHistory, createRouter } from "vue-router"
import { logEvent } from "firebase/analytics"
import { firebaseAnalyics } from "@/firebase"
import store from "@/store/store.js"

// Standard user views
import AirbnbCleaning from "@/views/AirbnbCleaning.vue"
import Amenities from "@/views/Amenities.vue"
import Home from "@/views/Home.vue"
import Login from "@/views/Login.vue"
import ManageBooking from "@/views/bookings/ManageBooking.vue"
import Guides from "@/views/Guides.vue"
import GuideItem from "@/views/GuideItem.vue"
import NotFound from "@/views/NotFound.vue"
import UserSettings from "@/views/settings/UserSettings.vue"
import ThermometerPage from "@/views/ThermometerPage.vue"

// Use path-based admin detection now
/* eslint-disable-next-line no-unused-vars */
const isAdminPath = window.location.pathname.startsWith("/a")

// Define routes for each mode
const adminRoutes = [
	{
		path: "/a",
		component: () => import("@/views/admin/AdminDashboard.vue"),
		name: "admin-dashboard",
	},
	{
		path: "/a/about",
		component: () => import("@/views/admin/AboutManagement.vue"),
		name: "about-management",
	},
	{
		path: "/a/amenities",
		component: () => import("@/views/admin/AmenitiesManagement.vue"),
		name: "amenities-management",
	},
	{
		path: "/a/guides",
		component: () => import("@/views/admin/GuidesManagement.vue"),
		name: "guides-management",
	},
	{
		path: "/a/users",
		component: () => import("@/views/admin/UserManagement.vue"),
		name: "user-management",
	},
]

const userRoutes = [
	{
		component: () =>
			import(/* webpackChunkName: "about" */ "@/views/About.vue"),
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
		component: Guides,
		name: "guides",
		path: "/guides",
	},
	{
		component: GuideItem,
		name: "guideItem",
		path: "/guides/:id",
	},
	{
		component: ManageBooking,
		name: "manageBooking",
		path: "/booking/:id",
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
	{
		component: NotFound,
		path: "/:catchAll(.*)",
		name: "404",
	},
]

const router = createRouter({
	base: import.meta.env.BASE_URL,
	history: createWebHistory(),
	routes: [
		...userRoutes,
		...adminRoutes,
	], // Merge both sets
})

router.beforeEach((to, from, next) => 
{
	// Track page views with Firebase Analytics
	if (parseFloat(import.meta.env.VITE_CI)) 
	{
		try 
		{
			logEvent(firebaseAnalyics, "page_view", {
				title: to.name, 
			})
		}
		catch (e) 
		{
			console.error(e)
		}
	}

	// Admin guard logic
	// Admin routes protection
	if (to.path.startsWith("/a/")) 
	{
		const isLoggedIn = store.state.user.isLoggedIn
		const isAdmin = store.state.user.isAdmin

		if (!isLoggedIn) 
		{
			// User is not logged in, redirect to login
			next({
				name: "login", 
			})
		}
		else if (!isAdmin) 
		{
			// Logged in but not admin, redirect home or a permission error page
			next({
				name: "home", 
			})
		}
		else 
		{
			// User is admin
			next()
		}
	}
	else 
	{
		// Non-admin route
		next()
	}
})

export default router
