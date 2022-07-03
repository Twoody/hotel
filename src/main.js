import { createApp } from 'vue'
import App from './App.vue'

import router from "./router"
import store from "./store/store.js"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { faClipboard } from "@fortawesome/free-solid-svg-icons"
import { faClipboardList } from "@fortawesome/free-solid-svg-icons"
import { faFacebook } from "@fortawesome/free-brands-svg-icons"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner"
import { faStar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { initializeApp } from "firebase/app";
import { library } from "@fortawesome/fontawesome-svg-core"

// Font awesome
library.add(faCheck)
library.add(faChevronRight)
library.add(faClipboard)
library.add(faClipboardList)
library.add(faFacebook)
library.add(faGoogle)
library.add(faSpinner)
library.add(faStar)

//Vue.config.productionTip = false

//firebase.auth().onAuthStateChanged(
//	(user) =>
//	{
//		// Update user via store
//		store.commit("setIsLoggingIn", true)
//		store.dispatch("fetchUser", user)
//
//		if (user)
//		{
//			// User is signed in.
//		}
//		else
//		{
//			// No User
//		}
//		store.commit("setIsLoggingIn", false)
//	}
//)

// Prep the app
const app = createApp(App)
app.use(store)
app.use(router)
app.component("font-awesome-icon", FontAwesomeIcon)

// Mount the app
app.mount('#app')
