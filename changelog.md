2.2.2 - 47645b0b82ea9839fd7cac2d49b2b6f4a122c3cf
    # Add CSP header & upgrade Firebase deps to v11, unify social logins under SocialLogin
    * firebase.json:
        ** Added Content-Security-Policy header
        ** Changed Cross-Origin-Opener-Policy and Cross-Origin-Embedder-Policy to unsafe-none
    * package-lock.json & package.json:
        ** Upgraded firebase from 9.x to ^11.1.0
        ** Updated various Firebase sub-deps (Firestore, Auth, etc.)
    * App.vue:
        ** Updated logic to dispatch fetchUser with firestoreUser.data() instead of the full doc snapshot
    * FacebookLogin.vue & GoogleLogin.vue:
        ** Consolidated into a single SocialLogin component for DRY code
    * SocialLogin.vue (new):
        ** Handles Google/Facebook sign-in from a single place
        ** Dispatches fetchUser with firestoreUser.data() on success
    * NavBar.vue:
        ** Added loading indicator for auth readiness
    * Login.vue:
        ** Replaced direct getAuth references with firebaseAuth import
        ** Passes response.user to fetchUser
    * Misc:
        ** Minor style changes, improved form validation, and updated store usage for user objects.

2.2.1 - 840892b40ee42f387de43046fa870c32a45ef5a8
    # User login/logout improvements
    * refactor:
       ** move Firebase initialization to a dedicated file
       ** adjust COOP/COEP headers under hosting
       ** add Font Awesome user-cog icon
       ** update version to 2.2.1
       ** and improve login flow and user settings page
       ** Support for a global `sleep` method
       ** navbar design changes

2.2.0 - f5c157e9981b3c8c25a2b492535d850eeb93f8a7
    * Removed:
    ** Jest config (jest.config.js) and Styleguidist config (styleguide.config.js).
    ** Old references to vue styleguidist commands from package.json.
    * Added:
    ** Documentation references pointing to the external [teahub] library.
    ** New todo.txt outlining next steps for integrating teahub icons.
    * Changed:
    ** Bumped version from 2.1.1 to 2.2.0 in package.json.
    ** Consolidated multiple teahub component imports into a single app.use(teahub) call in main.js.
    ** Minor UI updates in TrashAccordion.vue (structure changes to .trash-info) and MapFilters.vue (removal of inactive prop, added styling for active buttons).
    ** GoogleLogin.vue now returns a boolean from its googleLogin() method for better status handling.

2.1.1 - 820adb4e1af57f393f021d9e0aeff1f739ec26cb
    # Migrated to Vitest for testing, added coverage scripts, updated local activity thumbnails, and introduced new section & analytics improvements
    * Build & Testing
    ** Switched from vue-cli-service test:unit to Vitest
    ** Added a test:coverage script and a new vitest.config.js for configuration
    ** Removed several legacy test files no longer in use
    * Dependencies
    ** Bumped teahub from ^0.0.5 to ^0.0.6
    ** Incremented version from 2.1.0 to 2.1.1
    * Features & UI
    ** App.vue: Added a new centered AppSection that displays a copyright footer
    ** MapFilters.vue: Conditionally initializes Firebase Analytics in production mode; includes safer log event usage
    ** LOCAL Activities: Added thumbnail property to each activity object
    ** Maps.vue: Passed imageURL and isOnline props to activity cards for improved display and offline detection

2.1.0
    # Update ESLint + add Thermometer page
    * ESLint (.eslintrc.js)
    ** Added "Thermometer" to recognized component names
    ** Cleaned up whitespace rules (removed trailing spaces, standardized arrow-parens and indent)
    * Git Ignore & Environment
    ** Added /.attic to .gitignore
    * Created new .nvmrc specifying Node v20.8.0
    * New Public Index
    ** Introduced public/index.html with Firebase Hosting setup and sample usage instructions
    * Thermometer Feature
    ** Added src/components/entities/Thermometer.vue with a dynamic progress bar
    ** Created src/views/ThermometerPage.vue and hooked into router (/thermometer)
    * Other Minor Updates
    ** Removed Foobar route
    ** Tidied main.js by commenting out the unused spinner import
    ** Minor whitespace/style fixes across files

2.0.0
	* Teahub integreation
	** Almost all components moved into a public repo

1.1.0
	* General bugs and better pages

1.0.0
	* Moved over to vite
	* Moved over to vue3

0.1.3
  * Install vue-cal and demo on home page
	* Groundwork for logging in and users
	* Amenities section and base components
	* Setup more dev environment factors:
	** Jest (w/ bad coverage unfortunately)
	** This changelog file

0.1.2
   * All the firebase login + Vuefire stuff

	* Completed firebase hosting via git hooks
    
   * Start linting jsdocs
   
   * Start production via .env file
   
   * App layout configured
   
   * Vuex installed
   
   * Perma collapse navbar because it looks better
   
   * Todos for optimal login page
   ** Biggest thing is all user content needs to be loaded behind a splash.
   ** Currently, user content is being handled in vuex and main.
   ** Splash screen can be main background and then content-sections may be able to go into an `is-showing` state when content is loaded
   
   * loading bar/shimmer component
