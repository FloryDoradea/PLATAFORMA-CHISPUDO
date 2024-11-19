const express = require ('express')
const path = require('path')
const app = express()
app.use(express.static(path.join(__dirname,'public')))

/*app.get('/', (req,res)=>{
    res.send('Dashboard con Nod Js')
})*/

//2. seteamos urlencoded para capturar los datos del formualario
app.use(express.urlencoded({extended:false})); /* funcion para poder interpretar el codigo JSON*/
app.use(express.json());

//3. invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'})

//5. establecer el motor de plantillas ejs
app.set('view engine', 'ejs');

    app.use(express.urlencoded({extended:false}));/* para decirle a nout como se van a captura los datos del formulario */
    app.use(express(express.json));

//6. invocamos a bcryptjs
const bcryptjs = require('bcryptjs');

//7. Variables de session
const session = require('express-session');
app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized:true
}));

//8. Invocamos al modulo de conexion de la BD
//const connection = require('./database/db.js');
const conexion = require('./database/db.js');

//9. Estableciendo las rutas
app.get('/',(req,res)=>{
    res.render('login.ejs'); 
})

//11. Autenticacion, '/auth' este parametro esta en el form de login.ejs
/*app.post('/auth',async(req, res)=>{
    const email= req.body.user;
    const pass= req.body.pass;
    let passwordhaash= await bcryptjs.hash(pass,8);

    //const pass = "Seguridad77"; // Supongamos que esta es la contraseña ingresada por el usuario
    //const hashAlmacenado = "$2b$04$LjlVrO6cAuD9ua/pklPyKuASSNVo1HWtyiNhK4fhYxjDBmCeEMHCG"; // Supongamos que esta es la contraseña hash almacenada en la base de datos

    if(email && pass){
        conexion.query('SELECT * FROM "user" WHERE email = $1', [email], (error, results) => {
            if (error) {
                console.error('Error al ejecutar la consulta:', error);
                return;
            }
            else{
                if (results.rows.length === 0) {
                    // No se encontraron resultados para el usuario en la base de datos
                    //console.log("Usuario no encontrado");

                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario no encontrado y/o password incorrectos",
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer: false,
                        ruta:''
                    });
                } 
                else {
                    const password = results.rows[0].password; // Supongamos que "contraseña_hash" es el nombre de la columna en la base de datos
                   // console.log('Valor del campo "password":', password);

                    // Comparar la contraseña proporcionada con el hash almacenado
                    bcryptjs.compare(pass, password, function(err, result) {
                        if (err) {
                            // Manejar el error --
                            console.error("Error al comparar contraseñas:", err);

                        } else {
                            if (result) {
                                // La contraseña coincide -- console.log("Contraseña válida"); res.send('LOGIN CORRECTO')
                                req.session.loggedin = true  //Variable de autenticacion que se usa en el item 12.
                                req.session.name = results.rows[0].fullName;

                                res.render('login',{
                                    alert:true,
                                    alertTitle:"Conexion Exitosa",
                                    alertMessage: "!LOGIN CORRECTO",
                                    alertIcon: "success",
                                    showConfirmButton: false,
                                    timer: 1500,
                                    ruta: 'home'
                                });
                            } 
                            else {
                                // La contraseña no coincide -- console.log("Contraseña inválida");
                                res.render('login', {
                                    alert: true,
                                    alertTitle: "Error",
                                    alertMessage: "Password incorrecto",
                                    alertIcon: "error",
                                    showConfirmButton: true,
                                    timer: false,
                                    ruta:''
                                });
                            }
                        }
                    })
                }   
            }                            
        } ) 
    }
})*/

//11. Autenticacion, '/auth' este parametro esta en el form de login.ejs
app.post('/auth',async(req, res)=>{
    const user= req.body.user;
    const pass= req.body.pass;
    let passwordhaash= await bcryptjs.hash(pass,8);

    //const pass = "Seguridad77"; // Supongamos que esta es la contraseña ingresada por el usuario
    //const hashAlmacenado = "$2b$04$LjlVrO6cAuD9ua/pklPyKuASSNVo1HWtyiNhK4fhYxjDBmCeEMHCG"; // Supongamos que esta es la contraseña hash almacenada en la base de datos

    if(user && pass){

       // console.log('SELECT * FROM "userplataforma" WHERE "user" = $1');
        conexion.query('SELECT * FROM "userplataforma" WHERE "user" = $1', [user], (error, results) => {
            if (error) {
                console.error('Error al ejecutar la consulta:', error);
                return;
            }
            else{
                if (results.rows.length === 0) {
                    // No se encontraron resultados para el usuario en la base de datos
                    //console.log("Usuario no encontrado");

                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario no encontrado y/o password incorrectos",
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer: false,
                        ruta:''
                    });
                } 
                else {
                    const passwordTemporary = results.rows[0].passwordTemporary; // Supongamos que "contraseña_hash" es el nombre de la columna en la base de datos
                   // console.log('Valor del campo "password":', password);

                    // Comparar la contraseña proporcionada con el hash almacenado
                    bcryptjs.compare(pass, passwordTemporary, function(err, result) {
                        if (err) {
                            // Manejar el error --
                            //console.error("Error al comparar contraseñas:", err);

                            res.render('login', {
                                alert: true,
                                alertTitle: "Error",
                                alertMessage: "En la comparacion de contraseñas:",
                                alertIcon: "error",
                                showConfirmButton: true,
                                timer: false,
                                ruta:''
                            });


                        } else {
                            if (result) {
                                // La contraseña coincide -- console.log("Contraseña válida"); res.send('LOGIN CORRECTO')
                                req.session.loggedin = true  //Variable de autenticacion que se usa en el item 12.
                                req.session.name = results.rows[0].fullName;

                                res.render('login',{
                                    alert:true,
                                    alertTitle:"Conexion Exitosa",
                                    alertMessage: "!LOGIN CORRECTO",
                                    alertIcon: "success",
                                    showConfirmButton: false,
                                    timer: 1500,
                                    ruta: 'home'
                                });
                            } 
                            else {
                                // La contraseña no coincide -- console.log("Contraseña inválida");
                                res.render('login', {
                                    alert: true,
                                    alertTitle: "Error",
                                    alertMessage: "Password incorrecto",
                                    alertIcon: "error",
                                    showConfirmButton: true,
                                    timer: false,
                                    ruta:''
                                });
                            }
                        }
                    })
                }   
            }                            
        } ) 
    }
})


// Se coloca este codigo hasta aca abajo, ya que es global y toma el login cunado esta antes
const expressLayouts = require('express-ejs-layouts')
app.set('view engine', 'ejs')
app.use(expressLayouts)


//utilizamos el router
const router = require('./routes/router')
app.use(router.routes)

//12. Metodo de autenticacion para las paginas
app.get('/', (req,res)=>{
    if(req.session.loggedin){
        res.render('login',{
            login: true,
            name:req.session.name
        });
    }
    else{
        res.render(' ',{
            login: false,
            name:"Debe iniciar sesion"
        })
    }
})

//13. LOGOUT ---destruir la sesion
app.get('/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    })
})




/*const { Client } = require('@googlemaps/google-maps-services-js');

// Inicializar el cliente de la API de Google Maps
const client = new Client({});

// Función para buscar la ubicación de un teléfono
async function buscarUbicacion(telefono) {
  try {
    const response = await client.geocode({
      params: {
        address: telefono,
        key: 'AIzaSyAtxcWn-Snen1_reiGgHMs-p7GjofkBJqI', // Reemplaza con tu API Key de Google Maps
      },
    });

    // Manejar la respuesta
    if (response.data.status === 'OK') {
      const location = response.data.results[0].geometry.location;
      console.log(`La ubicación de ${telefono} es: ${location.lat}, ${location.lng}`);
    } else {
      console.log(`No se pudo encontrar la ubicación de ${telefono}`);
    }
  } catch (error) {
    console.log('Error al buscar la ubicación:', error);
  }
}

// Array de teléfonos a buscar
const telefonos = ['56921541', '51105741', '50164807'];

// Buscar la ubicación de cada teléfono
telefonos.forEach(buscarUbicacion);*/

app.listen(2000,() =>{
    console.log('Server up running in http://Localhost:2000')
})