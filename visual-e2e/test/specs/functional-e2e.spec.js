describe('Sauce Demo', () => {
    it('Login Journey', async () => {
        await browser.url('');

        const sauceHeader = await $('#root > div > div.login_logo')
        await expect(sauceHeader).toBeDisplayed()

        const credentialsFooter = $('#login_credentials')
        await expect(credentialsFooter).toHaveTextContaining(["standard_user", "locked_out_user", "problem_user", "performance_glitch_user"])

        const userNameField = await $('#login_button_container > div > form > div:nth-child(1) > input')
        await userNameField.setValue('standard_user')
        const passwordField = await $('#login_button_container > div > form > div:nth-child(2) > input')
        await passwordField.setValue('secret_sauce')

        await $('#login-button').click()

        await expect(browser).toHaveUrlContaining('https://saucedemo.steilergroup.net/inventory.html')

        const backpackTitle = await $('#item_4_title_link > div')
        await expect(backpackTitle).toHaveText('Sauce Labs Backpack')
        const backpackCost = await $('#inventory_container > div > div:nth-child(1) > div.inventory_item_description > div.pricebar > div')
        await expect(backpackCost).toHaveText('$29.99')
    });
});