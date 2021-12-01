import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store/store.js"
import firebase from "firebase/app"
import { firestorePlugin } from "vuefire"

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
