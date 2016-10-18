import {version} from '../../package.json';
import {Router} from 'express';
import pg from 'pg';
import facets from './facets';

const pgurl = `postgres://iskeizttxypnli:epJ6T3YOyI5dl2zNcjV0_hE8o7@ec2-54-247-118-36.eu-west-1.compute.amazonaws.com:5432/dafecv9fhlbk4p`;

export default ({config, db}) => {
    let api = Router();

    // mount the facets resource
    api.use('/facets', facets({config, db}));

    // perhaps expose some API metadata at the root
    api.get('/', (req, res) => {
        const response = [];
        pg.defaults.ssl = true;
        pg.connect(pgurl, function (err, client) {
            if (err) throw err;
            console.log('Connected to postgres! Getting schemas...');


            client
                .query('SELECT table_schema,table_name FROM information_schema.tables;', [], function (err, result) {
                    if (err) throw err;

                    // just print the result to the console
                    console.log(result); // outputs: { name: 'brianc' }
                    res.json({result});
                    // disconnect the client
                    client.end(function (err) {
                        if (err) throw err;
                    });

                });


        });
    });

    return api;
}
