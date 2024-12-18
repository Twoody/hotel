// Vue main imports
import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store/store.js"

// UI Library imports: Teahub
import teahub from "teahub"
import "teahub/dist/style.css"

// Font Awesome imports
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { faClipboard } from "@fortawesome/free-solid-svg-icons"
import { faClipboardList } from "@fortawesome/free-solid-svg-icons"
import { faCopyright } from "@fortawesome/free-solid-svg-icons"
import { faFacebook } from "@fortawesome/free-brands-svg-icons"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner"
import { faStar } from "@fortawesome/free-solid-svg-icons"
import { faUserCog } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { library } from "@fortawesome/fontawesome-svg-core"

// Font awesome
library.add(faCheck)
library.add(faChevronRight)
library.add(faClipboard)
library.add(faClipboardList)
library.add(faCopyright)
library.add(faFacebook)
library.add(faGoogle)
 library.add(faSpinner)
library.add(faStar)
library.add(faUserCog)

// Prep the app
const app = createApp(App)
app.use(store)
app.use(router)

app.use(teahub)

app.component("font-awesome-icon", FontAwesomeIcon)

/**
 * @param ms
 * @global
 * @example this.$sleep(3000)
 * @since 2.2.1
 */
app.config.globalProperties.$sleep = async (ms) => 
{
	await new Promise((resolve) => setTimeout(resolve, ms))
}

// Mount the app
app.mount("#app")
