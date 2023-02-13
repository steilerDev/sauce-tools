API_URL="https://saucelabs.com/rest/v1/public/tunnels/info/versions?client_host=linux"

SC_VERSION=$(curl -s $API_URL | jq -r '.latest_version')
SC_DOWNLOAD_URL=$(curl -s $API_URL | jq -r '.download_url')
                                                                                
wget $SC_DOWNLOAD_URL -O ./sc-latest.tar.gz  

tar -xf ./sc-latest.tar.gz

./sc-${SC_VERSION}-linux/bin/sc
