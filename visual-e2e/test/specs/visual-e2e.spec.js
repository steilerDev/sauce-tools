describe('Sauce Demo', () => {
    it('Login Journey', async () => {
        await browser.url('');

        await browser.execute('/*@visual.init*/', 'Login Journey');
        await browser.execute('/*@visual.snapshot*/', 'Login Form');

        const userNameField = await $('#login_button_container > div > form > div:nth-child(1) > input')
        await userNameField.setValue('standard_user')
        const passwordField = await $('#login_button_container > div > form > div:nth-child(2) > input')
        await passwordField.setValue('secret_sauce')

        await $('#login-button').click()

        await browser.execute('/*@visual.snapshot*/', 'Inventory Page');

        const result = await browser.execute('/*@visual.end*/');
        if(!result.passed) {
            console.error(result.message)
        }
        expect(result.passed).toBe(true);
    });
});