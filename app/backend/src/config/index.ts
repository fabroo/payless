export default () => ({
    UBER_CLIENT_ID: process.env.UBER_CLIENT_ID ?? '',
    UBER_SECRET_ID: process.env.UBER_CLIENT_SECRET ?? '',
    DIDI: {
        appVersion: "7.2.84",
        terminalId: 7,
        city_id:54052300,
        requestUrl: "https://api-us.didiglobal.com/halo/v1/multi/ability/df5d5b1852dfa4a39eead7db47ed9cf9",
        ticket: process.env.DIDI_TICKET
    }
})  