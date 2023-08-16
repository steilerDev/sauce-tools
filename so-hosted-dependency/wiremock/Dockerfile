FROM wiremock/wiremock

# Getting Sauce Connect & dependencies
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
	ca-certificates \
	wget \
    inotify-tools \
    ncat

ARG SERVICE_VERSION="4.9.1"
ARG SC_PKG="sc-${SERVICE_VERSION}-linux.tar.gz"
RUN wget https://saucelabs.com/downloads/${SC_PKG} && \
	tar xvf ${SC_PKG}  && \
    mv sc-${SERVICE_VERSION}-linux/bin/sc /sc && \
    rm -rf ${SC_PKG} sc-${SERVICE_VERSION}-linux

COPY docker-assets/sauce-entrypoint.sh /
RUN chmod +x /sauce-entrypoint.sh

## Setting up wiremock
COPY stubs /home/wiremock

ENTRYPOINT ["/sauce-entrypoint.sh"]