// Vue main imports
import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store/store.js"

// UI Library imports: Teahub
import Accordion from "teahub"
import AmenitiesSection from "components/accordions/AmenitiesSection.vue"
import AvailabilitySearch from "components/forms/AvailabilitySearch.vue"
import AvailabilitySearchBar from "components/inputs/AvailabilitySearchBar.vue"
import Copyright from "components/common/Copyright.vue" // TODO: Use this
import DialogModal from "components/modals/DialogModal.vue" // TODO: Use this
import Filters from "components/buttons/filters/Filters.vue"
import MapCard from "components/cards/MapCard.vue"
import MyButton from "teahub"
import MyFilter from "components/buttons/filters/MyFilter.vue"
import QuestionAccordion from "components/accordions/QuestionAccordion.vue"
import SideMenu from "components/menus/SideMenu.vue" // TODO: Use this??
import Spinner from "components/common/loading/Spinner.vue"
import Validatable from "components/common/Validatable.vue"
import "teahub/dist/style.css"

// Font Awesome imports
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { faClipboard } from "@fortawesome/free-solid-svg-icons"
import { faClipboardList } from "@fortawesome/free-solid-svg-icons"
import { faFacebook } from "@fortawesome/free-brands-svg-icons"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import { faStar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { library } from "@fortawesome/fontawesome-svg-core"

// Font awesome
library.add(faCheck)
library.add(faChevronRight)
library.add(faClipboard)
library.add(faClipboardList)
library.add(faFacebook)
library.add(faGoogle)
//import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner"
//library.add(faSpinner)
library.add(faStar)

// Prep the app
const app = createApp(App)
app.use(store)
app.use(router)
app.use(Accordion)
app.use(AmenitiesSection)
app.use(AvailabilitySearch)
app.use(AvailabilitySearchBar)
app.use(Copyright)
app.use(DialogModal)
app.use(Filters)
app.use(LoadingBar)
app.use(MapCard)
app.use(MyButton)
app.use(MyDate)
app.use(MyFilter)
app.use(QuestionAccordion)
app.use(SideMenu)
app.use(Spinner)
app.use(Validatable)


app.component("font-awesome-icon", FontAwesomeIcon)

// Mount the app
app.mount("#app")
