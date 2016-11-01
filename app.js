/*jslint node: true*/
"use strict";
const config = require("config"),
	ca = config["ca-apm-probe"],
	nai = config.util.getEnv("NODE_APP_INSTANCE");
if (ca && ca.enabled) {
	let cfg = Object.assign(ca.config);
	cfg.probeName = nai ? cfg.appName + "-" + nai : cfg.appName;
	require("ca-apm-probe")(cfg);
}

require("./src/server/app");