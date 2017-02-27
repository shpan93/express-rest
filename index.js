import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';
import db from './models';

let server = express();

// 3rd party middleware
server.use((req,res, next) => {
	console.log(req.originalUrl, req.params);
	next();
})

server.use(cors({
	exposedHeaders: config.corsHeaders
}));

server.use(bodyParser.json({
	limit : config.bodyLimit
}));

server.use(bodyParser.urlencoded({ extended: true }));
server.use('/api', api(db));
server.listen(process.env.PORT || 8080, () => {
		db.sequelize.sync();
});
console.log(`Started on port ${server.port}`);

export default server;
