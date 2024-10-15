// Vue main imports
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store.js";

// UI Library imports: Teahub
import {
  Accordion,
  AmenitiesSection,
  AppSection,
  AvailabilitySearch,
  AvailabilitySearchBar,
  Filters,
  MapCard,
  MyButton,
  MyFilter,
  QuestionAccordion,
  Spinner,
  Validatable,
} from "teahub";
import "teahub/dist/style.css";

// Font Awesome imports
import {
  faCheck,
  faChevronRight,
  faClipboard,
  faClipboardList,
  faCopyright,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

// Font Awesome library setup
library.add(
  faCheck,
  faChevronRight,
  faClipboard,
  faClipboardList,
  faCopyright,
  faFacebook,
  faGoogle,
  faStar
);

// Prep the app
const app = createApp(App);
app.use(store);
app.use(router);

// Register components globally
app.component("Accordion", Accordion);
app.component("AmenitiesSection", AmenitiesSection);
app.component("AppSection", AppSection);
app.component("AvailabilitySearch", AvailabilitySearch);
app.component("AvailabilitySearchBar", AvailabilitySearchBar);
app.component("Filters", Filters);
app.component("MapCard", MapCard);
app.component("MyButton", MyButton);
app.component("MyFilter", MyFilter);
app.component("QuestionAccordion", QuestionAccordion);
app.component("Spinner", Spinner);
app.component("Validatable", Validatable);

// Register FontAwesome component
app.component("font-awesome-icon", FontAwesomeIcon);

// Mount the app
app.mount("#app");
