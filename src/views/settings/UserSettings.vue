<template>
	<div class="setting-page-wrapper">
		<h1>Settings</h1>

		<!-- 2) If auth is ready, but user is not logged in -->
		<div
			v-if="!isLoggedIn"
			data-testid="user-settings-case-not-logged-in"
		>
			Currently not logged in; Please visit
			<router-link
				class="nav-item"
				to="/login"
			>
				the login page
			</router-link>.
		</div>

		<!-- 3) If auth is ready, user is logged in -->
		<div
			v-else-if="isLoggedIn"
			data-testid="user-settings-tab-navigation"
		>
			<div class="settings-tabs-wrapper">
				<Filters
					:filters="settingTabs"
					@update="handleTabNavigation"
				/>
			</div>

			<!-- Instead of large v-if blocks, load subcomponents conditionally -->
			<AccountSettings
				v-if="activeTab && activeTab.id === 0"
				data-testid="user-settings-account-settings"
			/>

			<ProfileSettings
				v-else-if="activeTab && activeTab.id === 1"
				data-testid="user-settings-profile-settings"
			/>

			<PrivacyAndSecuritySettings
				v-else-if="activeTab && activeTab.id === 2"
				data-testid="user-settings-security-settings"
			/>

			<div
				v-else
				data-testid="user-settings-unrecgonized-tab"
			>
				<!-- TODO: Red warning/danger design -->
				<p>
					Please pick a section from the tabs above.
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import { logEvent } from "firebase/analytics"
import { firebaseAnalyics } from "@/firebase"

// Import your new sub-components
import AccountSettings from "@/views/settings/AccountSettings.vue"
import PrivacyAndSecuritySettings from "@/views/settings/PrivacyAndSecuritySettings.vue"
import ProfileSettings from "@/views/settings/ProfileSettings.vue"

export default {
	name: "UserSettings",

	data ()
	{
		return {
			activeTab: null,
			availableTabs: {
				0: {
					active: false,
					id: 0,
					title: "Account",
				},
				1: {
					active: false,
					id: 1,
					title: "Profile",
				},
				2: {
					active: false,
					id: 2,
					title: "Privacy + Security",
				},
			},
		}
	},

	computed: {
		/**
		 * Checks whether the user is logged in.
		 *
		 * @returns {boolean} True if the user is logged in, false otherwise.
		 */
		isLoggedIn ()
		{
			return this.$store.state.user.isLoggedIn
		},

		/**
		 * Returns the list of tabs the user can visit to view/edit account information.
		 *
		 * @returns {Array} List of tab objects.
		 */
		settingTabs ()
		{
			// Adapt for the <Filters> component
			return Object.values(this.availableTabs)
		},
	},

	created ()
	{
		const queryTab = this.getFromQueryString("active-tab")
		if (queryTab !== null)
		{
			const tabId = parseInt(queryTab, 10)
			if (this.availableTabs[tabId])
			{
				this.activeTab = this.availableTabs[tabId]
				this.availableTabs[tabId].active = true
			}
			else
			{
				this.activeTab = this.availableTabs[0]
				this.availableTabs[0].active = true
			}
		}
		else
		{
			this.activeTab = this.availableTabs[0]
			this.availableTabs[0].active = true
		}
	},
	watch:
	{
		"$route.query.active-tab":
		{
			handler (newTab)
			{
				const tabId = parseInt(newTab, 10)
				if (this.availableTabs[tabId])
				{
					this.activeTab = this.availableTabs[tabId]
					this.availableTabs[tabId].active = true
				}
				else
				{
					this.activeTab = this.availableTabs[0]
					this.availableTabs[0].active = true
				}
			},
			immediate: true,
		},
	},

	methods: {
		/**
		 * Retrieves a value from the query string by key.
		 *
		 * @param {string} key - The key to look for in the query string.
		 * @returns {string|null|boolean} The value of the key, null if the key is not present, or true if the key has no value.
		 */
		getFromQueryString (key)
		{
			const urlParams = new URLSearchParams(window.location.search)
			if (!urlParams.has(key))
			{
				return null
			}
			const val = urlParams.get(key)
			return val || true
		},

		/**
		 * Handles navigation when the user clicks a tab in the Filters component.
		 *
		 * @param {number} id - The ID of the tab selected.
		 * @returns {void}
		 * @since 2.3.0
		 */
		handleTabNavigation (id)
		{
			// Deactivate all, then activate the chosen one
			Object.keys(this.availableTabs).forEach((tabId) =>
			{
				this.availableTabs[tabId].active = false
			})
			if (this.availableTabs[id])
			{
				this.availableTabs[id].active = true
				this.activeTab = this.availableTabs[id]
			}

			this.$router.replace({
				query: {
					...this.$route.query,
					"active-tab": id,
				},
			})

			// Optionally log to analytics
			try
			{
				logEvent(firebaseAnalyics, "settings_tab_navigation", {
					value: this.availableTabs[id]?.title || "NOT_FOUND",
				})
			}
			catch (e)
			{
				console.error(e)
			}
		},
	},
	components: {
		AccountSettings,
		PrivacyAndSecuritySettings,
		ProfileSettings,
	},
}
</script>

<style scoped lang="less">
@import "../../../assets/styles/styles";

.setting-page-wrapper {
	background-color: @color-purple !important;
	border-radius: 7px;
	height: auto;
	margin: 7px;
	max-width: min(98%, 660px);
	padding: 9px;
	width: 100%;

	.settings-tabs-wrapper {
		.filters-wrapper {
			padding-left:20px;
			padding-right:20px;
			margin: 0;
			justify-content: center;
		}

		border-bottom: 2px solid black;
		margin-bottom: 10px;

		:deep(.my-button-wrapper) {
			&.active {
				background: @color-lavendar;
			}
		}
	}
	.submit-button {
		max-width: 50%;
	}
	.top-padding {
		margin-top: 30px;
	}

	h1 {
		border-bottom: 1px solid @myblack;
		margin-bottom: 5px;
	}
	p {
		font-size: 25px;
	}
}
</style>
