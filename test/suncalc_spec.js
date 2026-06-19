var should  = require("should");
var SunCalc = require("../suncalc.js");

describe( 'suncalc-temporal', function () {
  "use strict";

  const date = Temporal.Instant.from('2013-03-05T00:00:00Z'),
        lat  = 50.5,
        lng  = 30.5;

console.log(date.toString())

  const testTimes = {
    solarNoon: '2013-03-05T10:10:57Z',
    nadir: '2013-03-05T22:10:57Z',
    sunrise: '2013-03-05T04:34:56Z',
    sunset: '2013-03-05T15:46:58Z',
    sunriseEnd: '2013-03-05T04:38:20Z',
    sunsetStart: '2013-03-05T15:43:34Z',
    dawn: '2013-03-05T04:02:18Z',
    dusk: '2013-03-05T16:19:37Z',
    nauticalDawn: '2013-03-05T03:24:31Z',
    nauticalDusk: '2013-03-05T16:57:23Z',
    nightEnd: '2013-03-05T02:46:18Z',
    night: '2013-03-05T17:35:36Z',
    goldenHourEnd: '2013-03-05T05:19:02Z',
    goldenHour: '2013-03-05T15:02:53Z'
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

      for (const i in testTimes)
      {
        times[i].toString().should.match( testTimes[i] );
      }
      done();
    }
    catch(err) {
      done(err);
    }
  });

  it('addTimes adds additional sun levels', function (done) {
    try {
      const times1 = SunCalc.getTimes(date, lat, lng);
      SunCalc.addTime( 30, "highRise", "highSet" );
      const times2 = SunCalc.getTimes(date, lat, lng);

      let cnt1 = 0;
      let cnt2 = 0;
      for (const i in times1)
      {
        cnt1++;
        //console.log(times1[i])
        times1[i].epochMilliseconds.should.be.within(date.epochMilliseconds,date.epochMilliseconds+24*3600*1000);
      }
      for (const i in times2)
      {
        cnt2++;
        //console.log(times2[i])
        times2[i].epochMilliseconds.should.be.within(date.epochMilliseconds,date.epochMilliseconds+24*3600*1000);
      }
      cnt1.should.match( 14 );
      cnt2.should.match( cnt1 + 2 );
      times2.highRise.epochMilliseconds.should.match( 1362472645000 );
      times2.highSet .epochMilliseconds.should.match( 1362483870000 );
      done();
    }
    catch(err) {
      done(err);
    }
  });

  it('get invalid, if level is not reached', function (done) {
    try {
      const date =  Temporal.Instant.from('2026-12-21T00:00:00Z');
      const times = SunCalc.getTimes(date, lat, lng);

      let cnt = 0;
      for (const i in times)
      {
        if( times[i] )
        {
          cnt++;
          times[i].epochMilliseconds.should.be.a.Number();
        }
      }
      cnt.should.match( 14 );
      should.equal( times.highRise, null );
      should.equal( times.highSet,  null );
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
      var moonTimes = SunCalc.getMoonTimes(Temporal.ZonedDateTime.from('2013-03-04T00:00:00[UTC]'), lat, lng, true);

      moonTimes.rise.toString().should.match( '2013-03-04T23:54:00+00:00[UTC]');
      moonTimes.set.toString().should.match( '2013-03-04T07:48:00+00:00[UTC]');
      done();
    }
    catch(err) {
      done(err);
    }
  });

});
