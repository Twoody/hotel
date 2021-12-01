import Vue from "vue"
import VueRouter from "vue-router"
import Foobar from "../views/Foobar.vue"
import Home from "../views/Home.vue"
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
		component: Home,
		name: "home",
		path: "/",
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
