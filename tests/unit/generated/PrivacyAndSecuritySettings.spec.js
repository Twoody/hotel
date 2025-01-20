import { mount } from '@vue/test-utils'
import PrivacyAndSecuritySettings from '../path/to/PrivacyAndSecuritySettings'

describe('PrivacyAndSecuritySettings', () => {
    
    let wrapper;
    beforeEach(() => {
        wrapper = mount(PrivacyAndSecuritySettings);
    });

    test('renders the component correctly', () => {
        expect(wrapper.html()).toMatchSnapshot();
    });

    test(\"'Reset Password' button click\", async () => {
        const reset = jest.fn();
        wrapper.setMethods({ resetUserPassword: reset });
        await wrapper.find('.user-logout').trigger('click');
        expect(reset).toBeCalled();
    });

    test(\"'Logout' button click\", async () => {
        const logout = jest.fn();
        wrapper.setMethods({ logout: logout });
        await wrapper.find('.user-logout').trigger('click');
        expect(logout).toBeCalled();
    });

    test(\"'Delete Account' button click\", async () => {
        const del = jest.fn();
        wrapper.setMethods({ deleteUserAccount: del });
        await wrapper.find('.user-logout').trigger('click');
        expect(del).toBeCalled();
    });
});
