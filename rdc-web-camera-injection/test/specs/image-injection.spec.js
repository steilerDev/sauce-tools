const fs = require('fs/promises')

describe('Image Injection', () => {
    beforeEach(async () => {
        await browser.url('');
        try {
            const eulaAcceptButton = $('body > div.page-container > div.terms-content-container > div > div > div.terms-button.agree')
            await eulaAcceptButton.waitForDisplayed()
            console.log(`Accepting EULA`)
            await eulaAcceptButton.click()
        } catch(err) {
            console.log(`EULA not visible`)
        }

        await $('body > div.page-container > div.welcome-container > span').waitForDisplayed();
    });

    it('should image inject', async () => {
        await $('body > div.page-container > div.scan-button-container > div').click()

        // On Chrome 'autoGrantPermissions' does not work
        // This branch will click the native elements that are needed to grant permissions
        if(browser.capabilities.browserName === "Chrome") {
            console.log("Handling Permission Dialog on Android...")
            // Storing webcontext
            const webContext = await driver.getContext()

            console.debug("Switching to native context")
            await driver.switchContext("NATIVE_APP");

            console.debug("Granting permissions...")
            const grantSelector = 'android=new UiSelector().text("Allow").className("android.widget.Button")'
            await $(grantSelector).waitForExist()
            await $(grantSelector).click()
            console.log('Permissions granted!')

            console.debug("Granting permissions duration...")
            const permissionDurationSelector = 'android=new UiSelector().text("While using the app").className("android.widget.Button")'
            await $(permissionDurationSelector).waitForExist()
            await $(permissionDurationSelector).click()
            console.log("Permissions duration granted!")

            console.debug(`Switching to web context (${webContext})`)
            await driver.switchContext(webContext);
        }

        await expect(browser).toHaveUrl('https://demo.pla.health/scan.html')

        console.log(`Loading & injecting image...`)
        const testImage = await fs.readFile('./test/data/valid_code.png', {encoding: 'base64'})

        // Image injection
        browser.execute(`window.ImageCapture = class {
            constructor() {}
            grabFrame() {
                return fetch("data:image/png;base64,${testImage}").then((res) => res.blob()).then((blob) => createImageBitmap(blob))
            }
        }`)
        
        await $('#settings-modal > div > div.page-content > div.loader').waitForExist()
        console.log(`Image scanned!`)
        
        // There might be a language missmatch
        try {
            await $('#leaflet-lang-select').waitForDisplayed()
            console.debug(`Language not available, selecting default...`)
            await $('#leaflet-lang-select > div > div.modal-content > div.proceed-button.has-leaflets').click()
        } catch(err) {
            console.debug(`Language available: ${err.message}!`)
        }

        await $('#expired-modal').waitForDisplayed()
    });
})
