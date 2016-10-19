import {version} from '../../package.json';
import {Router} from 'express';
import pg from 'pg';
import facets from './facets';

pg.defaults.ssl = true;
const pgurl = `postgres://iskeizttxypnli:epJ6T3YOyI5dl2zNcjV0_hE8o7@ec2-54-247-118-36.eu-west-1.compute.amazonaws.com:5432/dafecv9fhlbk4p`;
const client = new pg.Client(pgurl);
client.connect();

const tableName = 'users';

export default ({config, db}) => {
    let api = Router();

    // mount the facets resource
    api.use('/facets', facets({config, db}));

    // perhaps expose some API metadata at the root
    api.get('/', (req, res) => {
        client.query(`SELECT * FROM ${tableName} ORDER  BY id ASC`, [], function (err, result) {
            console.log();
            res.json(result.rows);
        });
    }).get('/:id', (req, res) => {
        const id = req.params.id;
        client.query(`SELECT * FROM ${tableName} WHERE id = ${id}`, [], function (err, result) {
            if (result.rows[0]) {
                res.json(result.rows[0]);
            } else {
                res.status(404).send(`No entry with id ${id}`);
            }

        });
    }).post('/', (req, res) => {
        const {name, age} = req.body;
        client.query(`INSERT INTO ${tableName}(name,age) values($1, $2)`, [name, age], function (err, result) {
            if (err) res.send(err);
            res.send(result);

        });
    }).put('/:id', (req, res) => {
        const id = req.params.id;
        client.query(`SELECT * FROM ${tableName} WHERE id = $1`, [id], function (err, result) {

            if (result && result.rows[0]) {
                Object.keys(req.body).forEach(key => {
                    client.query(`UPDATE ${tableName} SET ${key} = ${req.body[key]} WHERE id = ${id}`, [], function (err, result) {
                        console.log(`UPDATE ${tableName} SET ${key} = ${req.body[key]} WHERE id = ${id}`)
                    });
                });
                res.send(`Entry with id ${id} was updated`);
            } else {
                res.status(404).send(`No entry with id ${id}`);
            }

        });
    }).delete('/:id', (req, res) => {
        const id = req.params.id;
        client.query(`DELETE FROM ${tableName} WHERE id = $1`, [id], function (err, result) {
            console.log(id);
            res.json(result);
        });
    })
    ;

    return api;
}
