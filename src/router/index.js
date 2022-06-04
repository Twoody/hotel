import Vue from "vue"
import VueRouter from "vue-router"
import Amenities from "../views/Amenities.vue"
import Foobar from "../views/Amenities.vue"
import Home from "../views/Home.vue"
import Login from "../views/Login.vue"
import Manual from "../views/Manual.vue"
import ManualItem from "../views/ManualItem.vue"
import Maps from "../views/Maps.vue"
import MapItem from "../views/MapItem.vue"
import Signup from "../views/Signup.vue"

Vue.use(VueRouter)

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
		component: Foobar,
		name: "foobar",
		path: "/foobar",
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
		component: Manual,
		name: "manual",
		path: "/manual",
	},
	{
		component: ManualItem,
		name: "manualItem",
		path: "/manual/:id",
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
		component: Signup,
		name: "singup",
		path: "/signup",
	},
]

const router = new VueRouter({
	base: process.env.BASE_URL,
	mode: "history",
	routes,
})

export default router
