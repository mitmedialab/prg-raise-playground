/**
 * @author jg
 * Copyright 2016 IF Robots LLC
 */

"use strict";

var Time = require("../../").core.Time;

/*global describe, it, before, beforeEach, after, afterEach */

//(don't error on using new for side effects)
//jshint -W031

//var currentish = 1468540800;

/**
 * Seconds for year 2050.  This value should be fine both in the "seconds" int field, as well
 * as for scalar seconds-with-microseconds, e.g. ".add(123.123001)".  Tests that involve rounding may
 * have to use a more sturdy number than when we are using small seconds values, as we don't have much
 * 10th of microsecond precision using this floating point value at this magnitude.  Note this lack of
 * precision is only relevant when making the test, it's not an actual concern as we don't
 * track/represent 10'ths of microseconds, so either rounding is fine in reality.
 *
 * @type {number}
 */
var twenty50 = 2524608000;

/**
 * A big number of seconds (~2620); This value should be fine in the "seconds" int field, but
 * will not be acceptable as a scalar seconds-with-microseconds float, e.g., ".add(big.000001)".
 * Thus, there is a cap on magnitude of scalars that can be added to a Time while keeping
 * the scalar's microsecond precision; however, this cap is well after the difference between
 * 2050 and 1970.  Also, most delta computations will be much smaller in magnitude.
 * @type {number}
 */
var big = 20524608000;

describe("Time", function() {

	it("Should not error on valid times", function () {
		expect(function(){new Time(12, 17);}).to.not.throw(Error);
		expect(function(){new Time(0, 17);}).to.not.throw(Error);
		expect(function(){new Time(12, 0);}).to.not.throw(Error);
		expect(function(){new Time(12, 999999);}).to.not.throw(Error);
		expect(function(){new Time(big, 999999);}).to.not.throw(Error);
		expect(function(){Time.createFromTimestamp([12, 17]);}).to.not.throw(Error);
	});

	it("Should error on common invalid stamp format", function () {
		expect(function(){Time.createFromTimestamp(12);}).to.throw(Error);
		expect(function(){Time.createFromTimestamp([]);}).to.throw(Error);
		expect(function(){Time.createFromTimestamp({});}).to.throw(Error);
	});

	it("Should error on invalid time values", function () {
		expect(function(){new Time(-1, 12);}).to.throw(Error);
		expect(function(){new Time(-1, -12);}).to.throw(Error);
		expect(function(){new Time(12, -1);}).to.throw(Error);
		expect(function(){new Time(12, 1000000);}).to.throw(Error);
		expect(function(){new Time(12, 1100000);}).to.throw(Error);
		expect(function(){new Time(12.3, 1100000);}).to.throw(Error);
		expect(function(){new Time(12, 12.000000000001);}).to.throw(Error);
	});

	// Time Comparison
	it("Equal should be equals()", function () {
		expect(new Time(12, 2).equals(new Time(12, 2))).to.equal(true);
		expect(new Time(0, 2).equals(new Time(0, 2))).to.equal(true);
		expect(new Time(big, 2).equals(new Time(big, 2))).to.equal(true);
	});

	it("Not-Equal should be !equals()", function () {
		expect(new Time(12, 2).equals(new Time(12, 0))).to.equal(false);
		expect(new Time(12, 2).equals(new Time(0, 2))).to.equal(false);
		expect(new Time(12, 2).equals(new Time(12, 1))).to.equal(false);
		expect(new Time(big, 2).equals(new Time(big, 1))).to.equal(false);
	});

	it("Greater than should be isGreater()", function () {
		expect(new Time(12, 2).isGreater(new Time(12, 0))).to.equal(true);
		expect(new Time(12, 0).isGreater(new Time(11, 900000))).to.equal(true);
		expect(new Time(big, 0).isGreater(new Time(big-1, 999999))).to.equal(true);
	});

	it("Not greater than should be !isGreater()", function () {
		expect(new Time(12, 1).isGreater(new Time(12, 2))).to.equal(false);
		expect(new Time(11, 900000).isGreater(new Time(12, 0))).to.equal(false);
		expect(new Time(12, 2).isGreater(new Time(12, 2))).to.equal(false);
		expect(new Time(big-1, 0).isGreater(new Time(big, 999999))).to.equal(false);
	});

	it("Greater than or equal should be isGreaterOrEqual()", function () {
		expect(new Time(12, 2).isGreaterOrEqual(new Time(12, 0))).to.equal(true);
		expect(new Time(12, 0).isGreaterOrEqual(new Time(11, 900000))).to.equal(true);
		expect(new Time(12, 2).isGreaterOrEqual(new Time(12, 2))).to.equal(true);
		expect(new Time(big, 2).isGreaterOrEqual(new Time(big, 2))).to.equal(true);
		expect(new Time(big+1, 1).isGreaterOrEqual(new Time(big, 2))).to.equal(true);
	});

	it("Not greater than or equal should be !isGreaterOrEqual()", function () {
		expect(new Time(12, 1).isGreaterOrEqual(new Time(12, 2))).to.equal(false);
		expect(new Time(11, 900000).isGreaterOrEqual(new Time(12, 0))).to.equal(false);
		expect(new Time(big-1, 900000).isGreaterOrEqual(new Time(big, 0))).to.equal(false);
	});

	// addition of scalar to Time
	it("Positive addition works", function () {
		expect(new Time(12, 7).add(0.0).equals(new Time(12, 7))).to.equal(true);
		expect(new Time(12, 0).add(0.000012).equals(new Time(12, 12))).to.equal(true);
		expect(new Time(12, 0).add(1.000012).equals(new Time(13, 12))).to.equal(true);
		expect(new Time(12, 700000).add(1.299999).equals(new Time(13, 999999))).to.equal(true);
		expect(new Time(12, 700001).add(1.299999).equals(new Time(14, 0))).to.equal(true);
		expect(new Time(12, 700002).add(1.299999).equals(new Time(14, 1))).to.equal(true);
		expect(new Time(big, 700002).add(1.299999).equals(new Time(big+2, 1))).to.equal(true);
		expect(new Time(12, 700002).add(twenty50+1.299999).equals(new Time(twenty50+14, 1))).to.equal(true);
	});
	it("Negative addition works", function () {
		expect(new Time(12, 14).add(-0.000012).equals(new Time(12, 2))).to.equal(true);
		expect(new Time(12, 14).add(-1.000012).equals(new Time(11, 2))).to.equal(true);
		expect(new Time(12, 14).add(-1.000012).equals(new Time(11, 2))).to.equal(true);
		expect(new Time(12, 700000).add(-1.699999).equals(new Time(11, 1))).to.equal(true);
		expect(new Time(12, 699999).add(-1.699999).equals(new Time(11, 0))).to.equal(true);
		expect(new Time(12, 699998).add(-1.699999).equals(new Time(10, 999999))).to.equal(true);
		expect(new Time(12, 999999).add(-1.999999).equals(new Time(11,0))).to.equal(true);
		expect(new Time(12, 14).add(-12.000014).equals(new Time(0,0))).to.equal(true);
		expect(new Time(twenty50, 14).add(-twenty50-0.000014).equals(new Time(0,0))).to.equal(true);
		expect(new Time(big, 14).add(-12.000014).equals(new Time(big-12,0))).to.equal(true);
	});
	it("Small scalars (round-down, x < 0.5us) additions have no effect", function () {
		expect(new Time(12, 1).add(0.00000000000001).equals(new Time(12, 1))).to.equal(true);
		expect(new Time(12, 1).add(-0.00000000000001).equals(new Time(12, 1))).to.equal(true);
		expect(new Time(12, 0).add(0.00000000000001).equals(new Time(12, 0))).to.equal(true);
		expect(new Time(12, 0).add(-0.00000000000001).equals(new Time(12, 0))).to.equal(true);
		expect(new Time(11, 999999).add(0.00000000000001).equals(new Time(11, 999999))).to.equal(true);
		expect(new Time(11, 999999).add(-0.00000000000001).equals(new Time(11, 999999))).to.equal(true);
		expect(new Time(big, 999999).add(-0.00000000000001).equals(new Time(big, 999999))).to.equal(true);

		expect(new Time(12, 1).add(0.0000004).equals(new Time(12, 1))).to.equal(true);
		expect(new Time(12, 1).add(-0.0000004).equals(new Time(12, 1))).to.equal(true);
		expect(new Time(12, 0).add(0.0000004).equals(new Time(12, 0))).to.equal(true);
		expect(new Time(12, 0).add(-0.0000004).equals(new Time(12, 0))).to.equal(true);
		expect(new Time(11, 999999).add(0.0000004).equals(new Time(11, 999999))).to.equal(true);
		expect(new Time(11, 999999).add(-0.0000004).equals(new Time(11, 999999))).to.equal(true);
		expect(new Time(big, 999999).add(-0.0000004).equals(new Time(big, 999999))).to.equal(true);
	});
	it("Small scalars (round-up, 0.5us <= x < 1us) additions have an effect", function () {
		expect(new Time(12, 1).add(0.00000051).equals(new Time(12, 2))).to.equal(true);
		expect(new Time(12, 1).add(-0.00000051).equals(new Time(12, 0))).to.equal(true);
		expect(new Time(12, 0).add(0.00000051).equals(new Time(12, 1))).to.equal(true);
		expect(new Time(12, 0).add(-0.00000051).equals(new Time(11, 999999))).to.equal(true);
		expect(new Time(11, 999999).add(0.00000051).equals(new Time(12, 0))).to.equal(true);
		expect(new Time(11, 999999).add(-0.00000051).equals(new Time(11, 999998))).to.equal(true);
		expect(new Time(big, 999999).add(0.00000051).equals(new Time(big+1, 0))).to.equal(true);
		expect(new Time(big, 999999).add(-0.00000051).equals(new Time(big, 999998))).to.equal(true);
		expect(new Time(twenty50+11, 999999).add(-twenty50-0.0000008).equals(new Time(11, 999998))).to.equal(true); //use a stronger 8 as we're out of precision for the 10ths of us
	});
	it("Scalars with trailing (round-down, x < 0.5us) small components add properly", function () {
		expect(new Time(12, 0).add(1.9999994).equals(new Time(13, 999999))).to.equal(true);
		expect(new Time(12, 1).add(1.9999994).equals(new Time(14, 0))).to.equal(true);
		expect(new Time(12, 999999).add(-1.9999994).equals(new Time(11, 0))).to.equal(true);
		expect(new Time(12, 999998).add(-1.9999994).equals(new Time(10, 999999))).to.equal(true);

		expect(new Time(big, 999999).add(-1.9999994).equals(new Time(big-1, 0))).to.equal(true);
		expect(new Time(twenty50+12, 999999).add(-twenty50-1.9999992).equals(new Time(11, 0))).to.equal(true); //use a stronger 2 as we're out of precision for the 10ths of us
	});
	it("Scalars with trailing (round-up, 0.5us <= x < 1us) small components add properly", function () {
		expect(new Time(12, 1).add(1.99999951).equals(new Time(14, 1))).to.equal(true);
		expect(new Time(12, 0).add(1.99999951).equals(new Time(14, 0))).to.equal(true);
		expect(new Time(11, 999999).add(1.99999951).equals(new Time(13, 999999))).to.equal(true);
		expect(new Time(13, 1).add(-1.99999951).equals(new Time(11, 1))).to.equal(true);
		expect(new Time(13, 0).add(-1.99999951).equals(new Time(11, 0))).to.equal(true);
		expect(new Time(12, 999999).add(-1.99999951).equals(new Time(10, 999999))).to.equal(true);
		expect(new Time(13+big, 0).add(-1.99999951).equals(new Time(11+big, 0))).to.equal(true);
		expect(new Time(12+big, 999999).add(-1.99999951).equals(new Time(10+big, 999999))).to.equal(true);
		expect(new Time(13+twenty50, 0).add(-twenty50-1.9999998).equals(new Time(11, 0))).to.equal(true); //use a stronger 8 as we're out of precision for the 10ths of us
		expect(new Time(12+twenty50, 999999).add(-twenty50-1.9999998).equals(new Time(10, 999999))).to.equal(true); //use a stronger 8 as we're out of precision for the 10ths of us
	});
	it("Producing negative times causes error", function () {
		expect(function(){new Time(12, 0).add(-14);}).to.throw(Error);
		expect(function(){new Time(0, 500).add(-0.000501);}).to.throw(Error);
		expect(function(){new Time(12, 500).add(-12.000499);}).to.not.throw(Error);
		expect(function(){new Time(12, 500).add(-12.000500);}).to.not.throw(Error);
		expect(function(){new Time(12, 500).add(-12.000501);}).to.throw(Error);
		expect(function(){new Time(12, 500).add(-13.000499);}).to.throw(Error);
		expect(function(){new Time(13, 500).add(-10000);}).to.throw(Error);
		expect(function(){new Time(big, 500).add(-(big+1));}).to.throw(Error);
		expect(function(){new Time(twenty50, 500).add(-(twenty50+0.000500));}).to.not.throw(Error);
		expect(function(){new Time(twenty50, 500).add(-(twenty50+0.000501));}).to.throw(Error);
	});

	// difference between times
	it("subtract() should throw error applied to common invalid (non-time) arguments", function() {
		expect(function(){new Time(12,1).subtract(5);}).to.throw(Error);
		expect(function(){new Time(12,1).subtract(null);}).to.throw(Error);
		expect(function(){new Time(12,1).subtract([]);}).to.throw(Error);
		expect(function(){new Time(12,1).subtract({});}).to.throw(Error);
	});
	it("Same times should have zero difference", function () {
		expect(new Time(12, 0).subtract(new Time(12,0))).to.equal(0);
		expect(new Time(0, 12).subtract(new Time(0,12))).to.equal(0);
		expect(new Time(12, 1).subtract(new Time(12,1))).to.equal(0);
		expect(new Time(big, 1).subtract(new Time(big,1))).to.equal(0);
	});
	it("Positive time differences should be correct", function () {
		expect(new Time(12, 0).subtract(new Time(10, 1))).to.equal(1.999999);
		expect(new Time(12, 0).subtract(new Time(10, 0))).to.equal(2);
		expect(new Time(12, 0).subtract(new Time(9, 999999))).to.equal(2.000001);
		expect(new Time(12, 400).subtract(new Time(10, 401))).to.equal(1.999999);
		expect(new Time(12, 400).subtract(new Time(10, 400))).to.equal(2);
		expect(new Time(12, 400).subtract(new Time(10, 399))).to.equal(2.000001);
		expect(new Time(big, 400).subtract(new Time(big-2, 399))).to.equal(2.000001);
		expect(new Time(twenty50, 400).subtract(new Time(2, 399))).to.equal(twenty50-2+0.000001);
	});
	it("Negative time differences should be correct", function () {
		expect(new Time(10, 1).subtract(new Time(12, 0))).to.equal(-1.999999);
		expect(new Time(10, 0).subtract(new Time(12, 0))).to.equal(-2);
		expect(new Time(9, 999999).subtract(new Time(12, 0))).to.equal(-2.000001);
		expect(new Time(10, 401).subtract(new Time(12, 400))).to.equal(-1.999999);
		expect(new Time(10, 400).subtract(new Time(12, 400))).to.equal(-2);
		expect(new Time(10, 399).subtract(new Time(12, 400))).to.equal(-2.000001);
		expect(new Time(big-2, 399).subtract(new Time(big, 400))).to.equal(-2.000001);
		expect(new Time(2, 399).subtract(new Time(twenty50, 400))).to.equal(-twenty50+2-0.000001);
	});
});
