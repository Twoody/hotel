import Vue from "vue"
import App from "./App.vue"
import firebase from "firebase/app"
import router from "./router"
import store from "./store/store.js"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { faFacebook } from "@fortawesome/free-brands-svg-icons"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner"
import { faStar } from "@fortawesome/free-solid-svg-icons"
import { firestorePlugin } from "vuefire"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { library } from "@fortawesome/fontawesome-svg-core"

// Font awesome
library.add(faCheck)
library.add(faChevronRight)
library.add(faFacebook)
library.add(faGoogle)
library.add(faSpinner)
library.add(faStar)
Vue.component("font-awesome-icon", FontAwesomeIcon)

const firebaseConfig = {
	apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
	appId: process.env.VUE_APP_FIREBASE_APP_ID,
	authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.VUE_APP_DATABASE_URL,
	messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
	projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
}

Vue.config.productionTip = false

if (!firebase.apps.length)
{
	firebase.initializeApp(firebaseConfig)
}
else
{
	firebase.app() // if already initialized, use that one
}

firebase.auth().onAuthStateChanged(
	(user) =>
	{
		// Update user via store
		store.commit("setIsLoggingIn", true)
		store.dispatch("fetchUser", user)

		if (user)
		{
			// User is signed in.
		}
		else
		{
			// No User
		}
		store.commit("setIsLoggingIn", false)
	}
)

Vue.use(firestorePlugin)

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app")
