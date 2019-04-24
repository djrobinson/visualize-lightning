# Visualize Lightning

## Lightning Network Visualization & Analysis Tool

A simple network visualizer for the Lightning Network that allows users to explore the network map from the perspective of their own node.

**Data Displayed:**
- Geolocation of all publicly announced IP address on Lightning
- Visual routes between announced nodes
- Lists all channels for a selected node
- Lists the policy details for a selected channel

![alt text](https://github.com/djrobinson/visualize-lightning/blob/master/viz.png "LND Network Visualization")

**Tech Used:**
- Typescript
- Express.js
- Vue.js
- Deck.gl & Mapbox
- Postgres
- [LNRPC](https://github.com/RadarTech/lnrpc)
- [LND Lightning Node](https://github.com/lightningnetwork/lnd)
- [IPStack](https://ipstack.com) for IP Geolocation

## Getting started

**Downloads**

1.  Install LND using the btcd operating mode according to the tutorial [here](https://dev.lightning.community/guides/installation/)
2.  `git clone https://github.com/djrobinson/visualize-lightning.git`
3.  Open up 2 terminals

**Terminal 1**

4.  `cd visualize-lightning/server`
5.  `yarn`
6.  `touch .env`
7.  Sign up for a [IPStack](https://ipstack.com) API Key
8.  Update the .env file with your keys & certs, should look like:
```
SERVER_PORT=3000
LND_URL=localhost:10009
LND_MACAROON_PATH=/path/to/a/file.macaroon
LND_CERT_PATH=/path/to/a/tls.cert
IPSTACK_API_KEY=apikeyfromipstack
```
9.  `knex migrate:latest --env development`
10.  `yarn start`

**Terminal 2**

11.  `cd visualize-lightning/web`
12.  `yarn`
13.  `yarn serve`

**Populate DB with LND `describegraph` info & gather IP locations**

14.  Open the app at http://localhost:8080
15.  Click the "Data" tab
16.  Click the "Describe Graph" button
17.  Go back to the map, verify that nodes and channels show up on the map and in the side pane
