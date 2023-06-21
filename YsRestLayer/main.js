
/****** Initializing objects from the imported classes ******/
const express = require('express')
const cors = require('cors')
const YSRestDocument = express()

/****** Adding Configurations to express object ******/
YSRestDocument.use(cors());
YSRestDocument.use(express.json())

const userService = require("./src/services/user.service")
const customerService = require("./src/services/customer.service")


/****** Mapping the endpoints to the respective service modules ******/
YSRestDocument.use("/api/ysquare/", userService);
YSRestDocument.use("/api/ysquare/", customerService);

/****** Starting the Ys Rest Document Based on the security configuration ******/

YSRestDocument.listen(3100)
console.log("RestService Running Successfully" + ` LocalHost` + ":" + `3100`)

