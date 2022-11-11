/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comairbus/z_default_val/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
