In order to not have to rely on external dependencies during testing, this repository contains an example of how to run Wiremock in the Sauce Labs datacenter using Sauce Orchestrate.

## How to use this example

After pulling the repository, make sure you have `saucectl` installed. Also `SAUCE_USERNAME` and `SAUCE_ACCESS_KEY` need to be present as environment variables.

Execute `saucectl run`, to use the container image `steilerdev/wiremock-so:latest`. This will start a Sauce Orchestrate job, spinning up Wiremock (using Wiremock's hello world sample), as well as Sauce Connect. Once the Sauce Connect tunnel is available, you can start any session (while making sure to select the Sauce Connect tunnel) and navigate to `http://wiremock.orchestrate:8080/hello` to see the Wiremock response.

To end the session, either `Ctrl-C` the `saucectl run` program, or navigate to `http://wiremock.orchestrate:9999/` within the Sauce Labs session. This will trigger a teardown of the Sauce Orchestrate container once all Sauce Labs sessions using this container have been ended.

Finally Sauce Connect and Wiremock logs will be downloaded into the `artifacts` folder.

## How is it working?

### Dockerfile

This example uses a custom container, that is defined in `Dockerfile`. It extends the Wiremock base image, adds the Sauce Connect binaryand overwrites the default entrypoint.

Use (and modify) the `build-and-push.sh` script to create your own image.

### sauce-entrypoint.sh

This file handles creation of the Sauce Connect tunnel, as well as makes the domain name `wiremock.orchestrate` available ([to enable localhost testing](https://docs.saucelabs.com/secure-connections/sauce-connect/setup-configuration/specialized-environments/#testing-mobile-devices-against-localhost)). Additionally it spins up the Wiremock server (using Wiremock's default entrypoint) and exposes a 'kill' endpoint. This endpoint will send a `SIGKILL` signal to the script, which handles this signal through a trap and shuts down all components gracefully.

### .sauce/config.yml

This file specifies the container image to be used. Additionally it provides crucial information to the container through environment variables. Additional Sauce Connect and/or Wiremock settings can be adjusted through those variables. This file will be used to control `saucectl run`.