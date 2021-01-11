// Configuração das informações de conexão com o banco de dados
var dbUser = 'postgres';
var dbPass = 'postgres';
var dbHost = (process.env.NODE_ENV === 'production') ? 'db' : 'localhost';
var dbPort = '5432';
var dbName = 'qualyvist';
var schemas = ['public', 'qualyvist_admin'];
var connectionString = `postgres://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;
var rootAPI = '/app/api';

module.exports = {dbUser, dbPass, dbHost, dbPort, dbName, connectionString, schemas, rootAPI};
