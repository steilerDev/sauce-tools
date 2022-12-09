describe('Sauce Demo', () => {
    it('Login Journey', async () => {
        await browser.url('');

        const sauceHeader = await $('#root > div > div.login_logo')
        expect(sauceHeader).toBeDisplayed()
        const sauceBot = await $('#root > div > div.login_wrapper > div.login_wrapper-inner > div.bot_column')
        expect(sauceBot).toBeDisplayed()
        const credentialsFooter = await $('#login_credentials')
        expect(credentialsFooter).toHaveTextContaining([
            "standard_user",
            "locked_out_user",
            "problem_user",
            "performance_glitch_user"
        ])

        await $('#user-name').addValue('standard_user')
        await $('#password').addValue('secret_sauce')

        await $('#login-button').click()

        expect(browser).toHaveUrl('https://saucedemo.steilergroup.net/inventory.html')

        const backpackTitle = await $('#item_4_title_link > div')
        expect(backpackTitle).toHaveText('Sauce Labs Backpack')
        const backpackCost = await $('#inventory_container > div > div:nth-child(1) > div.inventory_item_description > div.pricebar > div')
        expect(backpackCost).toHaveText('$29.99')
    });
});