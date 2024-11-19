
//Conexion a la base de datos, las variables que se usan, son las variables de entorno que se
//definieron en el archivo .env
/*const mysql = require ('mysql');
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect((error)=>{
    if(error){
        console.log('El error de conexion es : '+error);
        return;
    }
    console.log('!Conectado a la base de datos');
});

module.exports = connection;*/





/*const mysql = require ('mysql');

const conexion = mysql.createConnection({
    host: '34.122.223.12',
    user: 'postgres',
    password: 'Y2xhdmUwMXBhcmFwcm95ZWN0b2FwcA',
    database: 'postgres'
})

conexion.connect((error)=>{
    if(error){
        console.error('El error de conexion es:'+error);
        return
    }
    console.log('!Conectado a la BD POSTGRES');
})

module.exports = conexion; */

const {Pool} = require('pg')

const conexion = new Pool({
    user: 'postgres',
    host: '34.122.223.12',
    database: 'lili',
    password: 'Y2xhdmUwMXBhcmFwcm95ZWN0b2FwcA',
    port: 5432, // Puerto por defecto de PostgreSQL
  }); 

  conexion.connect((error)=>{
    if(error){
        console.error('El error de conexion es:'+error);
        return
    }
    console.log('!Conectado a la BD POSTGRES');
})


/*conexion.query('SELECT * FROM user', (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      return;
    }
    console.log('Filas recuperadas:', results.rows);
  });*/

  //conexion.end();

  module.exports = conexion; 
