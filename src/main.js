import { createApp } from "vue"
import App from "./App.vue"

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
import { initializeApp } from "firebase/app"
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

// const firebaseConfig = {
//	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//	appId: import.meta.env.VITE_FIREBASE_APP_ID,
//	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//	databaseURL: import.meta.env.VITE_DATABASE_URL,
//	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
// }
// initializeApp(firebaseConfig)

// Prep the app
const app = createApp(App)
app.use(store)
app.use(router)
app.component("font-awesome-icon", FontAwesomeIcon)

// Mount the app
app.mount("#app")
