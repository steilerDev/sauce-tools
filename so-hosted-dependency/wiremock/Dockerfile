FROM wiremock/wiremock

# Getting dependencies
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install \
        --no-install-recommends \
        --fix-missing \
        --assume-yes \
            ca-certificates wget inotify-tools ncat && \
    apt-get clean autoclean && \
    apt-get autoremove && \
    rm -rf /var/lib/{apt,dpkg,cache,log} /tmp/* /var/tmp/*
	
# Installing Sauce Connect
ARG SERVICE_VERSION="4.9.1"
ARG SC_PKG="sc-${SERVICE_VERSION}-linux.tar.gz"
RUN wget https://saucelabs.com/downloads/${SC_PKG} && \
	tar xvf ${SC_PKG}  && \
    mv sc-${SERVICE_VERSION}-linux/bin/sc /sc && \
    rm -rf ${SC_PKG} sc-${SERVICE_VERSION}-linux

# Creating custom entrypoint
COPY sauce-entrypoint.sh /
RUN chmod +x /sauce-entrypoint.sh

## Setting up wiremock
COPY stubs /home/wiremock

ENTRYPOINT ["/sauce-entrypoint.sh"]