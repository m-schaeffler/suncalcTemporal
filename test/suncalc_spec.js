var should  = require("should");
var SunCalc = require("../suncalc.js");

describe( 'suncalc-temporal', function () {
  "use strict";

const date = new Date('2013-03-05UTC'),
      lat = 50.5,
      lng = 30.5;

const testTimes = {
    solarNoon: '2013-03-05T10:10:57Z',
    nadir: '2013-03-05T22:10:57Z',
    sunrise: '2013-03-05T04:34:56Z',
    sunset: '2013-03-05T15:46:57Z',
    sunriseEnd: '2013-03-05T04:38:19Z',
    sunsetStart: '2013-03-05T15:43:34Z',
    dawn: '2013-03-05T04:02:17Z',
    dusk: '2013-03-05T16:19:36Z',
    nauticalDawn: '2013-03-05T03:24:31Z',
    nauticalDusk: '2013-03-05T16:57:22Z',
    nightEnd: '2013-03-05T02:46:17Z',
    night: '2013-03-05T17:35:36Z',
    goldenHourEnd: '2013-03-05T05:19:01Z',
    goldenHour: '2013-03-05T15:02:52Z'
};

  it('getPosition returns azimuth and altitude for the given time and location', function (done) {
    try {
      var sunPos = SunCalc.getPosition(date, lat, lng);

      sunPos.azimuth.should.match(-2.5003175907168385);
      sunPos.altitude.should.match(-0.7000406838781611);
      done();
    }
    catch(err) {
      done(err);
    }
  });

  it('getTimes returns sun phases for the given date and location', function (done) {
    try {
      var times = SunCalc.getTimes(date, lat, lng);

      for (var i in testTimes)
      {
        times[i].toUTCString().should.match( (new Date(testTimes[i])).toUTCString() );
      }
      done();
    }
    catch(err) {
      done(err);
    }
  });

  it('getMoonPosition returns moon position data given time and location', function (done) {
    try {
      var moonPos = SunCalc.getMoonPosition(date, lat, lng);

      moonPos.azimuth.should.match( -0.9783999522438226 );
      moonPos.altitude.should.match( 0.014551482243892251 );
      moonPos.distance.should.match( 364121.37256256194 );
      done();
    }
    catch(err) {
      done(err);
    }
  });

  it('getMoonIllumination returns fraction and angle of moon\'s illuminated limb and phase', function (done) {
    try {
      var moonIllum = SunCalc.getMoonIllumination(date);

      moonIllum.fraction.should.match( 0.4848068202456374 );
      moonIllum.phase.should.match( 0.7548368838538762 );
      moonIllum.angle.should.match( 1.6732942678578346 );
      done();
    }
    catch(err) {
      done(err);
    }
  });

  it('getMoonTimes returns moon rise and set times', function (done) {
    try {
      var moonTimes = SunCalc.getMoonTimes(new Date('2013-03-04UTC'), lat, lng, true);

      moonTimes.rise.toUTCString().should.match( 'Mon, 04 Mar 2013 23:54:29 GMT');
      moonTimes.set.toUTCString().should.match( 'Mon, 04 Mar 2013 07:47:58 GMT');
      done();
    }
    catch(err) {
      done(err);
    }
  });

});
