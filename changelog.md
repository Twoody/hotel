0.1.3
   * Install vue-cal and demo on home page
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
