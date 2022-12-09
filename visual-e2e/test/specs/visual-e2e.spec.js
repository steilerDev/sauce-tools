describe('Sauce Demo', () => {
    it('Login Journey', async () => {
        await browser.url('');

        await browser.execute('/*@visual.init*/', 'Login Journey');
        await browser.execute('/*@visual.snapshot*/', 'Login Form');

        await $('#user-name').addValue('standard_user')
        await $('#password').addValue('secret_sauce')

        await $('#login-button').click()

        await browser.execute('/*@visual.snapshot*/', 'Inventory Page');

        const result = await browser.execute('/*@visual.end*/');
        if(!result.passed) {
            console.error(result.message)
        }
        expect(result.passed).toBe(true);
    });
});