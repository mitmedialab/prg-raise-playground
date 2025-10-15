/**
 * @author jg
 * Copyright 2016 IF Robots LLC
 */

"use strict";

var Pose = require("../../").motion.Pose;


/*global describe, it, before, beforeEach, after, afterEach */

var pd = {hip:0.005, elbow:0.04, neck:0.3, eye:2.0};
var pd2 = {hip:0.2, elbow:0.3, neck:0.7, eye:0.1};

if(Pose.hasOwnProperty("__globalSetup")){
	Pose.__globalSetup(Object.keys(pd));
}

var setToPD = function(pose){
	var dofNames = Object.keys(pd);
	for(var i = 0; i < dofNames.length; i++){
		pose.set(dofNames[i], pd[dofNames[i]], 0);
	}
};
var setToPD2 = function(pose){
	var dofNames = Object.keys(pd);
	for(var i = 0; i < dofNames.length; i++){
		pose.set(dofNames[i], pd2[dofNames[i]], 0);
	}
};
var setToMap = function(pose, map){
	var dofNames = Object.keys(map);
	for(var i = 0; i < dofNames.length; i++){
		var val = map[dofNames[i]];
		if(typeof val === "number") {
			pose.set(dofNames[i], val, 0);
		}else{
			pose.set(dofNames[i], val);
		}
	}
};


describe("Pose", function() {
	it("Should have empty values for all constructor-provided dofs", function () {
		var dofNames = Object.keys(pd);
		var p = new Pose("Test", dofNames);
		expect(p.getDOFNames().length).to.above(0);
		expect(p.getDOFNames().length).to.equal(dofNames.length);
		for (var i = 0; i < dofNames.length; i++) {
			var dofName = dofNames[i];
			expect(p.getDOFNames().indexOf(dofName)).to.at.least(0);
			expect(p.get(dofName).length).to.equal(0);
			expect(p.get(dofName, 0)).to.equal(null);
		}
	});

	it("Should have empty values for all lazy-provided dofs", function () {
		var dofNames = Object.keys(pd);
		var p = new Pose("Test");
		p.setPose(new Pose("Test2", dofNames));
		expect(p.getDOFNames().length).to.above(0);
		expect(p.getDOFNames().length).to.equal(dofNames.length);
		for (var i = 0; i < dofNames.length; i++) {
			var dofName = dofNames[i];
			expect(p.getDOFNames().indexOf(dofName)).to.at.least(0);
			expect(p.get(dofName).length).to.equal(0);
			expect(p.get(dofName, 0)).to.equal(null);
		}
	});

	// Setting/Getting
	it("Should have exact values for dofs provided through set", function()
	{
		var dofNames = Object.keys(pd);
		var p = new Pose("Test", dofNames);
		setToPD(p);

		for(var i = 0; i < dofNames.length; i++){
			expect(p.get(dofNames[i],0)).to.equal(pd[dofNames[i]]);
		}
	});

	it("Should be ok to set with array", function()
	{
		var i;
		var dofNames = Object.keys(pd);
		var p = new Pose("Test", dofNames);
		for(i = 0; i < dofNames.length; i++){
			p.set(dofNames[i],[pd[dofNames[i]]]);
		}

		for(i = 0; i < dofNames.length; i++){
			expect(p.get(dofNames[i],0)).to.equal(pd[dofNames[i]]);
		}
	});

	it("Should be ok to ask for array", function()
	{
		var i;
		var dofNames = Object.keys(pd);
		var p = new Pose("Test", dofNames);
		setToPD(p);

		for(i = 0; i < dofNames.length; i++){
			var arr = p.get(dofNames[i]);
			expect(arr.length).to.equal(1);
			expect(arr[0]).to.equal(pd[dofNames[i]]);
		}
	});

	it("Should ignore sets from outside dof set", function()
	{
		var dofNames = Object.keys(pd);
		var p = new Pose("Test", dofNames);
		setToPD(p);

		p.set("other", 2, 0);

		expect(p.get("other"), 0).to.equal(null);
		expect(p.get("other")).to.equal(null);

		p.set("other", [2]);

		expect(p.get("other"), 0).to.equal(null);
		expect(p.get("other")).to.equal(null);

	});

	it("Should copy values in setPose/getPose", function()
	{

		var i;
		var dofNames = Object.keys(pd);
		var p1 = new Pose("Test1", dofNames);
		var p2 = new Pose("Test2", dofNames);
		setToPD(p1);
		setToPD2(p2);
		p2.set("elbow", 100, 1);

		for(i = 0; i < dofNames.length; i++){
			expect(p1.get(dofNames[i],0)).to.equal(pd[dofNames[i]]);
		}
		for(i = 0; i < dofNames.length; i++){
			expect(p2.get(dofNames[i],0)).to.equal(pd2[dofNames[i]]);
		}
		expect(p2.get("elbow", 1)).to.equal(100);

		p1.setPose(p2);

		for(i = 0; i < dofNames.length; i++){
			expect(p1.get(dofNames[i],0)).to.equal(pd2[dofNames[i]]);
		}
		for(i = 0; i < dofNames.length; i++){
			expect(p2.get(dofNames[i],0)).to.equal(pd2[dofNames[i]]);
		}
		expect(p1.get("elbow", 1)).to.equal(100);
		expect(p2.get("elbow", 1)).to.equal(100);


		p1 = new Pose("Test1", dofNames);
		p2 = new Pose("Test2", dofNames);
		setToPD(p1);
		setToPD2(p2);
		p2.set("elbow", 100, 1);

		for(i = 0; i < dofNames.length; i++){
			expect(p1.get(dofNames[i],0)).to.equal(pd[dofNames[i]]);
		}
		for(i = 0; i < dofNames.length; i++){
			expect(p2.get(dofNames[i],0)).to.equal(pd2[dofNames[i]]);
		}
		expect(p2.get("elbow", 1)).to.equal(100);

		p2.getPose(p1);

		for(i = 0; i < dofNames.length; i++){
			expect(p1.get(dofNames[i],0)).to.equal(pd2[dofNames[i]]);
		}
		for(i = 0; i < dofNames.length; i++){
			expect(p2.get(dofNames[i],0)).to.equal(pd2[dofNames[i]]);
		}
		expect(p1.get("elbow", 1)).to.equal(100);
		expect(p2.get("elbow", 1)).to.equal(100);

	});

	it("Should copy only intersecting values", function()
	{

		var p1 = new Pose("Test1", ["hip", "elbow"]);
		var p2 = new Pose("Test2", ["elbow", "neck"]);
		p1.set("hip", 1, 0);
		p1.set("elbow", 2, 0);
		p2.set("elbow", 3, 0);
		p2.set("neck", 4, 0);

		p1.setPose(p2);

		expect(p1.get("hip",0)).to.equal(1);
		expect(p1.get("elbow",0)).to.equal(3);
		expect(p1.get("neck",0)).to.equal(null);
		expect(p1.get("eye",0)).to.equal(null);

	});


	it("Two poses should not become tied together", function()
	{

		var dofNames = Object.keys(pd);

		//uninitialized p2
		var p1 = new Pose("Test1", dofNames);
		var p2 = new Pose("Test2");

		setToPD(p1);

		p2.setPose(p1);

		expect(p2.get("elbow",0)).to.equal(pd["elbow"]);

		p2.set("elbow", 100, 0);

		expect(p2.get("elbow",0)).to.equal(100);
		expect(p1.get("elbow",0)).to.equal(pd["elbow"]);


		//dof initialized p2
		p1 = new Pose("Test1", dofNames);
		p2 = new Pose("Test2", dofNames);

		setToPD(p1);

		p2.setPose(p1);

		expect(p2.get("elbow",0)).to.equal(pd["elbow"]);

		p2.set("elbow", 100, 0);

		expect(p2.get("elbow",0)).to.equal(100);
		expect(p1.get("elbow",0)).to.equal(pd["elbow"]);

		//dof and value initialized p2
		p1 = new Pose("Test1", dofNames);
		p2 = new Pose("Test2", dofNames);

		setToPD(p1);
		setToPD2(p2);

		p2.setPose(p1);

		expect(p2.get("elbow",0)).to.equal(pd["elbow"]);

		p2.set("elbow", 100, 0);

		expect(p2.get("elbow",0)).to.equal(100);
		expect(p1.get("elbow",0)).to.equal(pd["elbow"]);

	});

	// Copying
	it("Copy should have exact values of original", function()
	{
		var dofNames = Object.keys(pd);
		var p = new Pose("Test", dofNames);
		setToPD(p);

		var copy = p.getCopy("copy");

		expect(copy.getDOFNames().length).to.equal(4);

		for(var i = 0; i < dofNames.length; i++){
			expect(copy.get(dofNames[i],0)).to.equal(pd[dofNames[i]]);
		}
	});

	it("Copy should not be tied to original", function()
	{

		var dofNames = Object.keys(pd);

		//uninitialized p2
		var p1 = new Pose("Test1", dofNames);
		setToPD(p1);

		var p2 = p1.getCopy("Test2");

		expect(p2.getDOFNames().length).to.equal(4);

		expect(p2.get("elbow",0)).to.equal(pd["elbow"]);

		p2.set("elbow", 100, 0);

		expect(p2.get("elbow",0)).to.equal(100);
		expect(p1.get("elbow",0)).to.equal(pd["elbow"]);

	});

	// Binary Operations
	it("Two poses should subtract", function () {
		var i;
		var dofNames = Object.keys(pd);

		var p1 = new Pose("Test1", dofNames);
		var p2 = new Pose("Test2", dofNames);
		setToPD(p1);
		setToPD2(p2);

		var pr = new Pose("Test2", dofNames);

		Pose.subtract(p1, p2, false, pr);

		for (i = 0; i < dofNames.length; i++) {
			var dn = dofNames[i];
			expect(pr.get(dn,0)).to.equal(pd[dn] - pd2[dn]);
		}
	});

	it("Two poses should add", function () {
		var i;
		var dofNames = Object.keys(pd);

		var p1 = new Pose("Test1", dofNames);
		var p2 = new Pose("Test2", dofNames);
		setToPD(p1);
		setToPD2(p2);

		var pr = new Pose("Test2", dofNames);

		Pose.add(p1, p2, false, pr);

		for (i = 0; i < dofNames.length; i++) {
			var dn = dofNames[i];
			expect(pr.get(dn,0)).to.equal(pd[dn] + pd2[dn]);
		}
	});

	it("Non overlapping values should be cleared if specified", function () {
		var i;
		var dofNames = Object.keys(pd);

		var p1 = new Pose("Test1", dofNames);
		var p2 = new Pose("Test2", ["elbow","eye"]);
		setToPD(p1);
		setToPD2(p2);

		var pr = new Pose("Test2", dofNames);
		setToPD(pr);

		Pose.subtract(p1, p2, true, pr);

		for (i = 0; i < dofNames.length; i++) {
			var dn = dofNames[i];
			if(dn === "elbow" || dn === "eye") {
				expect(pr.get(dn, 0)).to.equal(pd[dn] - pd2[dn]);
			}else{
				expect(pr.get(dn, 0)).to.equal(null);
			}
		}
	});

	it("Non overlapping values should not be cleared if not specified", function () {
		var i;
		var dofNames = Object.keys(pd);

		var p1 = new Pose("Test1", dofNames);
		var p2 = new Pose("Test2", ["elbow","eye"]);
		setToPD(p1);
		setToPD2(p2);

		var pr = new Pose("Test2", dofNames);
		setToPD(pr);

		Pose.subtract(p1, p2, false, pr);

		for (i = 0; i < dofNames.length; i++) {
			var dn = dofNames[i];
			if(dn === "elbow" || dn === "eye") {
				expect(pr.get(dn, 0)).to.equal(pd[dn] - pd2[dn]);
			}else{
				expect(pr.get(dn, 0)).to.equal(pd[dn]);
			}
		}
	});

	it("Uninitialized Pose should be initialized to the intersection", function () {
		var i;
		var dofNames = Object.keys(pd);

		var p1 = new Pose("Test1", dofNames);
		var p2 = new Pose("Test2", ["elbow","eye"]);
		setToPD(p1);
		setToPD2(p2);

		var pr = new Pose("Test2");

		Pose.subtract(p1, p2, false, pr);

		expect(pr.getDOFNames().length).to.equal(2);

		for (i = 0; i < dofNames.length; i++) {
			var dn = dofNames[i];
			if(dn === "elbow" || dn === "eye") {
				expect(pr.get(dn, 0)).to.equal(pd[dn] - pd2[dn]);
			}else{
				expect(pr.get(dn, 0)).to.equal(null);
			}
		}
	});

	it("Null Pose should be initialized to the intersection", function () {
		var i;
		var dofNames = Object.keys(pd);

		var p1 = new Pose("Test1", dofNames);
		var p2 = new Pose("Test2", ["elbow","eye"]);
		setToPD(p1);
		setToPD2(p2);


		var pr = Pose.subtract(p1, p2, false, null);

		expect(pr.getDOFNames().length).to.equal(2);

		for (i = 0; i < dofNames.length; i++) {
			var dn = dofNames[i];
			if(dn === "elbow" || dn === "eye") {
				expect(pr.get(dn, 0)).to.equal(pd[dn] - pd2[dn]);
			}else{
				expect(pr.get(dn, 0)).to.equal(null);
			}
		}
	});

	// Unary Operations
	it("Pose.advanceByTime() should add via velocity", function () {
		var i;
		var dofNames = Object.keys(pd);

		var p1 = new Pose("Test1", dofNames);
		setToPD(p1);
		for(i = 0; i < dofNames.length; i++){
			p1.set(dofNames[i], pd2[dofNames[i]], 1);
		}

		var pr = new Pose("Result", dofNames);

		Pose.advanceByTime(p1, false, pr, 0.5);

		for (i = 0; i < dofNames.length; i++) {
			var dn = dofNames[i];
			expect(pr.get(dn, 0)).to.equal(pd[dn] + pd2[dn]*0.5);
		}
	});

	it("Non present values should be cleared if specified", function () {
		var i;
		var dofNames = Object.keys(pd);

		var p1 = new Pose("Test1", ["elbow","eye"]);
		setToPD(p1);
		for(i = 0; i < dofNames.length; i++){
			p1.set(dofNames[i], pd2[dofNames[i]], 1);
		}

		var pr = new Pose("Test2", dofNames);
		setToPD(pr);

		Pose.advanceByTime(p1, true, pr, 0.5);

		for (i = 0; i < dofNames.length; i++) {
			var dn = dofNames[i];
			if(dn === "elbow" || dn === "eye") {
				expect(pr.get(dn, 0)).to.equal(pd[dn] + pd2[dn]*0.5);
			}else{
				expect(pr.get(dn, 0)).to.equal(null);
			}
		}
	});

	it("Non present values should not be cleared if not specified", function () {
		var i;
		var dofNames = Object.keys(pd);

		var p1 = new Pose("Test1", ["elbow","eye"]);
		setToPD(p1);
		for(i = 0; i < dofNames.length; i++){
			p1.set(dofNames[i], pd2[dofNames[i]], 1);
		}

		var pr = new Pose("Test2", dofNames);
		setToPD(pr);

		Pose.advanceByTime(p1, false, pr, 0.5);

		for (i = 0; i < dofNames.length; i++) {
			var dn = dofNames[i];
			if(dn === "elbow" || dn === "eye") {
				expect(pr.get(dn, 0)).to.equal(pd[dn] + pd2[dn]*0.5);
			}else{
				expect(pr.get(dn, 0)).to.equal(pd[dn]);
			}
		}
	});

	it("Uninitialized Pose should be initialized to provided", function () {
		var i;
		var dofNames = Object.keys(pd);

		var p1 = new Pose("Test1", ["elbow","eye"]);
		setToPD(p1);
		for(i = 0; i < dofNames.length; i++){
			p1.set(dofNames[i], pd2[dofNames[i]], 1);
		}

		var pr = new Pose("Test2");

		Pose.advanceByTime(p1, false, pr, 0.5);

		expect(pr.getDOFNames().length).to.equal(2);

		for (i = 0; i < dofNames.length; i++) {
			var dn = dofNames[i];
			if(dn === "elbow" || dn === "eye") {
				expect(pr.get(dn, 0)).to.equal(pd[dn] + pd2[dn]*0.5);
			}else{
				expect(pr.get(dn, 0)).to.equal(null);
			}
		}
	});

	it("Null Pose should be initialized to provided", function () {
		var i;
		var dofNames = Object.keys(pd);

		var p1 = new Pose("Test1", ["elbow","eye"]);
		setToPD(p1);
		for(i = 0; i < dofNames.length; i++){
			p1.set(dofNames[i], pd2[dofNames[i]], 1);
		}

		var pr = Pose.advanceByTime(p1, false, null, 0.5);

		expect(pr.getDOFNames().length).to.equal(2);

		for (i = 0; i < dofNames.length; i++) {
			var dn = dofNames[i];
			if(dn === "elbow" || dn === "eye") {
				expect(pr.get(dn, 0)).to.equal(pd[dn] + pd2[dn]*0.5);
			}else{
				expect(pr.get(dn, 0)).to.equal(null);
			}
		}
	});

	describe("#equals()", function() {

		var lessDOFs1 = {hip:0.005, eye:2.0, neck:0.30};
		var lessDOFs2 = {elbow:0.04, neck:0.30, eye:2.0};

		var differentValues = {hip:2, elbow:0.04, eye:2.0};

		var additionalValues = {hip:[0.005,0.2], elbow:0.04, eye:2.0};

		it("Equal poses should be equal", function () {
			var dofNames = Object.keys(lessDOFs1);

			var p1 = new Pose("Test1", dofNames);
			var p2 = new Pose("Test2", dofNames);
			setToMap(p1, lessDOFs1);
			setToMap(p2, lessDOFs1);

			expect(p1.equals(p2));
			expect(p2.equals(p1));
		});

		it("Different poses should not be equal", function () {
			var dofNames = Object.keys(lessDOFs2);

			var p1 = new Pose("Test1", dofNames);
			var p2 = new Pose("Test2", dofNames);
			setToMap(p1, lessDOFs2);
			setToMap(p2, differentValues);

			expect(p1.equals(p2));
			expect(p2.equals(p1));
		});

		it("Poses representing different dof sets are not equal", function () {
			var dofNames1 = Object.keys(pd);
			var dofNames2 = Object.keys(lessDOFs1);
			var dofNames3 = Object.keys(lessDOFs2);

			var p1 = new Pose("Test1", dofNames1);
			var p2 = new Pose("Test2", dofNames2);
			var p3 = new Pose("Test3", dofNames3);

			setToMap(p1, pd);
			setToMap(p2, lessDOFs1);
			setToMap(p3, lessDOFs2);

			expect(!p1.equals(p2));
			expect(!p2.equals(p3));
			expect(!p3.equals(p1));

			expect(!p2.equals(p1));
			expect(!p3.equals(p2));
			expect(!p1.equals(p3));
		});

		it("Poses with equivalent missing values are still equal", function () {
			var dofNames = Object.keys(pd);

			var p1 = new Pose("Test1", dofNames);
			var p2 = new Pose("Test2", dofNames);

			setToMap(p1, lessDOFs1);
			setToMap(p2, lessDOFs1);

			expect(p1.equals(p2));
			expect(p2.equals(p1));
		});

		it("Poses with uneven extra values are not equal", function () {
			var dofNames = Object.keys(lessDOFs2);

			var p1 = new Pose("Test1", dofNames);
			var p2 = new Pose("Test2", dofNames);

			setToMap(p1, lessDOFs2);
			setToMap(p2, additionalValues);

			expect(!p1.equals(p2));
			expect(!p2.equals(p1));
		});
	});

	describe("#equals0Only()", function() {

		var lessDOFs1 = {hip:0.005, eye:2.0, neck:0.30};
		var lessDOFs2 = {elbow:0.04, neck:0.30, eye:2.0};

		var differentValues = {elbow:0.7, eye:2.0, neck:0.30};

		var additionalValues = {elbow:[0.04, 0.7], eye:2.0, neck:0.30};

		var additionalValues2 = {neck:0.30, elbow:[0.04, 0.9], eye:2.0};

		it("Equal poses should be equal", function () {
			var dofNames = Object.keys(lessDOFs1);

			var p1 = new Pose("Test1", dofNames);
			var p2 = new Pose("Test2", dofNames);
			setToMap(p1, lessDOFs1);
			setToMap(p2, lessDOFs1);

			expect(p1.equals0Only(p2));
			expect(p2.equals0Only(p1));
		});

		it("Different poses should not be equal", function () {
			var dofNames = Object.keys(lessDOFs2);

			var p1 = new Pose("Test1", dofNames);
			var p2 = new Pose("Test2", dofNames);
			setToMap(p1, lessDOFs2);
			setToMap(p2, differentValues);

			expect(p1.equals0Only(p2));
			expect(p2.equals0Only(p1));
		});

		it("Poses representing different dof sets are not equal", function () {
			var dofNames1 = Object.keys(pd);
			var dofNames2 = Object.keys(lessDOFs1);
			var dofNames3 = Object.keys(lessDOFs2);

			var p1 = new Pose("Test1", dofNames1);
			var p2 = new Pose("Test2", dofNames2);
			var p3 = new Pose("Test3", dofNames3);

			setToMap(p1, pd);
			setToMap(p2, lessDOFs1);
			setToMap(p3, lessDOFs2);

			expect(!p1.equals0Only(p2));
			expect(!p2.equals0Only(p3));
			expect(!p3.equals0Only(p1));

			expect(!p2.equals0Only(p1));
			expect(!p3.equals0Only(p2));
			expect(!p1.equals0Only(p3));
		});

		it("Poses with equivalent missing values are still equal", function () {
			var dofNames = Object.keys(pd);

			var p1 = new Pose("Test1", dofNames);
			var p2 = new Pose("Test2", dofNames);

			setToMap(p1, lessDOFs1);
			setToMap(p2, lessDOFs1);

			expect(p1.equals0Only(p2));
			expect(p2.equals0Only(p1));
		});

		it("Poses with uneven extra (not 0 slot) values are still equal", function () {
			var dofNames = Object.keys(lessDOFs2);

			var p1 = new Pose("Test1", dofNames);
			var p2 = new Pose("Test2", dofNames);

			setToMap(p1, lessDOFs2);
			setToMap(p2, additionalValues);

			expect(!p1.equals0Only(p2));
			expect(!p2.equals0Only(p1));
		});

		it("Poses with different extra (not 0 slot) values are still equal", function () {
			var dofNames = Object.keys(lessDOFs2);

			var p1 = new Pose("Test1", dofNames);
			var p2 = new Pose("Test2", dofNames);

			setToMap(p1, additionalValues);
			setToMap(p2, additionalValues2);

			expect(!p1.equals0Only(p2));
			expect(!p2.equals0Only(p1));
		});

	});

	describe("#equalsNoChange()", function() {

		var lessDOFs1 = {hip:0.005, eye:2.0, neck:0.30};
		var lessDOFs2 = {elbow:0.04, neck:0.30, eye:2.0};

		var differentValues = {elbow:0.7, eye:2.0, neck:0.30};

		var additionalValues = {elbow:[0.04, 0.7], eye:2.0, neck:0.30};

		it("Equal poses should be .equalsNoChange()", function () {
			var dofNames = Object.keys(lessDOFs1);

			var p1 = new Pose("Test1", dofNames);
			var p2 = new Pose("Test2", dofNames);
			setToMap(p1, lessDOFs1);
			setToMap(p2, lessDOFs1);

			expect(p1.equalsNoChange(p2));
			expect(p2.equalsNoChange(p1));
		});

		it("Different poses should not be .equalsNoChange()", function () {
			var dofNames = Object.keys(lessDOFs2);

			var p1 = new Pose("Test1", dofNames);
			var p2 = new Pose("Test2", dofNames);
			setToMap(p1, lessDOFs2);
			setToMap(p2, differentValues);

			expect(p1.equalsNoChange(p2));
			expect(p2.equalsNoChange(p1));
		});

		it("Poses with same values but different DOF sets should be .equalsNoChange()", function () {
			var dofNames1 = Object.keys(pd);
			var dofNames2 = Object.keys(lessDOFs1);
			var dofNames3 = Object.keys(lessDOFs2);

			var p1 = new Pose("Test1", dofNames1);
			var p2 = new Pose("Test2", dofNames2);
			var p3 = new Pose("Test3", dofNames3);

			setToMap(p1, pd);
			setToMap(p2, lessDOFs1);
			setToMap(p3, lessDOFs2);

			expect(p1.equalsNoChange(p2));
			expect(p2.equalsNoChange(p3));
			expect(p3.equalsNoChange(p1));

			expect(p2.equalsNoChange(p1));
			expect(p3.equalsNoChange(p2));
			expect(p1.equalsNoChange(p3));
		});

		it("Poses with equivalent missing values are still equalsNoChange()", function () {
			var dofNames = Object.keys(pd);

			var p1 = new Pose("Test1", dofNames);
			var p2 = new Pose("Test2", dofNames);

			setToMap(p1, lessDOFs1);
			setToMap(p2, lessDOFs1);

			expect(p1.equalsNoChange(p2));
			expect(p2.equalsNoChange(p1));
		});

		it("Poses with uneven extra values are not .equalsNoChange()", function () {
			var dofNames = Object.keys(lessDOFs2);

			var p1 = new Pose("Test1", dofNames);
			var p2 = new Pose("Test2", dofNames);

			setToMap(p1, lessDOFs2);
			setToMap(p2, additionalValues);

			expect(!p1.equalsNoChange(p2));
			expect(!p2.equalsNoChange(p1));
		});
	});

	describe("#equalsNoChange0Only()", function() {

		var lessDOFs1 = {hip:0.005, eye:2.0, neck:0.30};
		var lessDOFs2 = {elbow:0.04, neck:0.30, eye:2.0};

		var differentValues = {elbow:0.7, eye:2.0, neck:0.30};

		var additionalValues = {elbow:[0.04, 0.7], eye:2.0, neck:0.30};
		var additionalValues2 = {neck:0.30, elbow:[0.04, 0.9], eye:2.0};

		it("Equal poses should be .equalsNoChange0Only()", function () {
			var dofNames = Object.keys(lessDOFs1);

			var p1 = new Pose("Test1", dofNames);
			var p2 = new Pose("Test2", dofNames);
			setToMap(p1, lessDOFs1);
			setToMap(p2, lessDOFs1);

			expect(p1.equalsNoChange0Only(p2));
			expect(p2.equalsNoChange0Only(p1));
		});

		it("Different poses should not be .equalsNoChange0Only()", function () {
			var dofNames = Object.keys(lessDOFs2);

			var p1 = new Pose("Test1", dofNames);
			var p2 = new Pose("Test2", dofNames);
			setToMap(p1, lessDOFs2);
			setToMap(p2, differentValues);

			expect(p1.equalsNoChange0Only(p2));
			expect(p2.equalsNoChange0Only(p1));
		});

		it("Poses with same values but different DOF sets should be .equalsNoChange0Only()", function () {
			var dofNames1 = Object.keys(pd);
			var dofNames2 = Object.keys(lessDOFs1);
			var dofNames3 = Object.keys(lessDOFs2);

			var p1 = new Pose("Test1", dofNames1);
			var p2 = new Pose("Test2", dofNames2);
			var p3 = new Pose("Test3", dofNames3);

			setToMap(p1, pd);
			setToMap(p2, lessDOFs1);
			setToMap(p3, lessDOFs2);

			expect(p1.equalsNoChange0Only(p2));
			expect(p2.equalsNoChange0Only(p3));
			expect(p3.equalsNoChange0Only(p1));

			expect(p2.equalsNoChange0Only(p1));
			expect(p3.equalsNoChange0Only(p2));
			expect(p1.equalsNoChange0Only(p3));
		});

		it("Poses with equivalent missing values are still equalsNoChange0Only()", function () {
			var dofNames = Object.keys(pd);

			var p1 = new Pose("Test1", dofNames);
			var p2 = new Pose("Test2", dofNames);

			setToMap(p1, lessDOFs1);
			setToMap(p2, lessDOFs1);

			expect(p1.equalsNoChange0Only(p2));
			expect(p2.equalsNoChange0Only(p1));
		});

		it("Poses with uneven extra values (not 0 slot) are are still .equalsNoChange0Only()", function () {
			var dofNames = Object.keys(lessDOFs2);

			var p1 = new Pose("Test1", dofNames);
			var p2 = new Pose("Test2", dofNames);

			setToMap(p1, lessDOFs2);
			setToMap(p2, additionalValues);

			expect(p1.equalsNoChange0Only(p2));
			expect(p2.equalsNoChange0Only(p1));
		});

		it("Poses with different extra values (not 0 slot) are are still .equalsNoChange0Only()", function () {
			var dofNames = Object.keys(additionalValues);

			var p1 = new Pose("Test1", dofNames);
			var p2 = new Pose("Test2", dofNames);

			setToMap(p1, additionalValues);
			setToMap(p2, additionalValues2);

			expect(p1.equalsNoChange0Only(p2));
			expect(p2.equalsNoChange0Only(p1));
		});
	});
});
