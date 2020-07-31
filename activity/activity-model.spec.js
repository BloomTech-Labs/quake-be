const db = require('../data/db-config')
const Activity = require('./activity-model')

activityData = {
    "mag": 1.1299999999999999,
    "place": "22km E of Julian, CA",
    "time": 1592967475930,
    "updated": 1592967777093,
    "tz": -480,
    "url": "https://earthquake.usgs.gov/earthquakes/eventpage/ci39492872",
    "detail": "https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=ci39492872&format=geojson",
    "felt": null,
    "cdi": null,
    "mmi": null,
    "alert": null,
    "status": "automatic",
    "tsunami": 0,
    "sig": 20,
    "net": "ci",
    "code": "39492872",
    "ids": ",ci39492872,",
    "sources": ",ci,",
    "types": ",geoserve,nearby-cities,origin,phase-data,scitech-link,",
    "nst": 17,
    "dmin": 0.094460000000000002,
    "rms": 0.16,
    "gap": 101,
    "magType": "ml",
    "type": "earthquake",
    "title": "M 1.1 - 22km E of Julian, CA",
    "usgs_id": "ci39492872",
}

describe('activity model', () => {
    describe('insert()', () => {
        it('should inserts activity into the database', async () => {
            await Activity.addActivity(activityData, 'activity');

            const addedActivity = await db('activity');
            expect(addedActivity).toHaveLength(1);
        })

    })
})

beforeEach(async () => {
    await db('activity').truncate();
})


