import {version} from '../package.json';
import {Router} from 'express';
import {comparePasswords, cryptPassword} from '../utils/password';

const tableName = 'users';

    let api = Router();
export default (db) => {
    const User = db.User;

    api.get('/', (req, res) => {
        User.findAll()
          .then(function (users) {
              res.json(users);
          });
        // client.query(`SELECT * FROM ${tableName} ORDER  BY id ASC`, [], function (err, result) {
        //     console.log();
        //     res.json(result.rows);
        // });
    }).get('/:id', (req, res) => {
        const id = req.params.id;
        client.query(`SELECT * FROM ${tableName} WHERE id = ${id}`, [], function (err, result) {
            if (result && result.rows[0]) {
                res.json(result.rows[0]);
            } else {
                res.status(404).send(`No entry with id ${id}`);
            }

        });
    }).post('/', (req, res) => {
        const {username, password} = req.body;
        console.log([username, password]);
        cryptPassword(password).then((hash) => {
            console.log(hash);
            User.create({ username, password: hash })
              .then(function (user) {
                  res.json(user);
              });
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
    });
    return api;

};
