import { mount } from \"@vue/test-utils\"
import PrivacyAndSecuritySettings from \"@/components/PrivacyAndSecuritySettings.vue\"

function createWrapper (component, options = {}) {
  return mount(component, options)
}

describe(\"PrivacyAndSecuritySettings\", () => {

  it(\"logout button click\", async () => {
    const wrapper = createWrapper(PrivacyAndSecuritySettings)
    const logOutButton = wrapper.get('.user-logout')
    await logOutButton.trigger('click')
    expect(wrapper.vm.isLoggingOut).toBe(false)
  })

  it(\"reset password button click\", async () => {
    const wrapper = createWrapper(PrivacyAndSecuritySettings)
    const resetPasswordButton = wrapper.get('.user-logout')
    await resetPasswordButton.trigger('click')
    expect(console.log).toHaveBeenCalledWith('Reset password clicked (TODO).')
  })
  
  it(\"delete account button click\", async () => {
    const wrapper = createWrapper(PrivacyAndSecuritySettings)
    const deleteAccountButton = wrapper.get('.user-logout')
    await deleteAccountButton.trigger('click')
    expect(console.log).toHaveBeenCalledWith('Delete user account clicked (TODO).')
  })

  it(\"renders additional content\", () => {
    const wrapper = createWrapper(PrivacyAndSecuritySettings)
    const additionalContentElem = wrapper.get('.session-management-wrapper p')
    expect(additionalContentElem.text()).toBe('Here you could add 2FA toggles, data download requests,or privacy preference toggles.')
  })
})
