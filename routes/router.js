const express = require('express')
const conexion = require('../database/db')
const router = express.Router()

//2. seteamos urlencoded para capturar los datos del formualario
router.use(express.urlencoded({extended:false})); /* funcion para poder interpretar el codigo JSON*/
router.use(express.json());

//6. invocamos a bcryptjs
const bcryptjs = require('bcryptjs');

//Bloque de ruteos con layout para el control del menu principal
const { vistaPrincipal, vistaTables, vistaForm2,vistaReportesUsuarios,vistaRepVariosDelivery }= require ('../controllers/PageControllers')
router.get('/home',vistaPrincipal)
router.get('/tables',vistaTables)
router.get('/form2',vistaForm2)
router.get('/register',vistaRegister)
router.get('/ReportesUsuarios',vistaReportesUsuarios)
router.get('/RepVariosDelivery',vistaRepVariosDelivery)
router.get('/widget',vistaWidget)

//Bloque proceso para utilizacion de fecha
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son indexados desde 0
const day = String(today.getDate()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;
//console.log(formattedDate);
 
//RUTA PARA TRAER TODOS LOS REGISTROS DE LA TABLA -- CRUD GENERAL
router.get('/index', (req, res) => {

    const elementosPorPagina = 15; // Número de elementos por página
    const paginaActual = req.query.page || 1; // Página actual, si no se proporciona, es la página 1
    const offset = (paginaActual - 1) * elementosPorPagina; // Calcular el desplazamiento para la paginación
    //console.log('Query SQL:', 'SELECT id, email, roles FROM "user" ORDER BY id LIMIT $1 OFFSET $2', [elementosPorPagina, offset]);
    conexion.query('SELECT id, "fullName",  email, roles, phone, "isActive", "isEmailConfirmed" FROM "user" ORDER BY "isActive" DESC , id LIMIT $1 OFFSET $2', [elementosPorPagina, offset], (error, results) => {
        if (error) {
            throw error;
        } 
        else {
            // Calcular si hay una página siguiente
            const length = results.rows.length;
            // Renderizar la vista con los resultados y la información de paginación
            res.render('index', { results: results.rows, paginaActual, elementosPorPagina, length });
        }
    });
});

//CONSULTA Y RUTA PARA TRAER TODOS LOS REGISTROS DE LA TABLA USUARIOS -- CRUD  DELIVERY, no hace save, 
//eso lo hace desde el el celular, aca solo edita y elimina de manera logica, no fisica
//----------------------------------------------------------------------------------------
router.get('/Delivery', (req, res) => {
    const elementosPorPagina = 10; // Número de elementos por página
    const paginaActual = req.query.page || 1; // Página actual, si no se proporciona, es la página 1
    const offset = (paginaActual - 1) * elementosPorPagina; // Calcular el desplazamiento para la paginación

    // Primero, cuenta el total de registros
    conexion.query('SELECT COUNT(*) FROM "user" WHERE ARRAY[$1, $2] <@ roles', ["client", "deliveryman"], (error, countResult) => {
        if (error) {
            throw error;
        }

        const totalRegistros = parseInt(countResult.rows[0].count); // Número total de registros
        const totalPaginas = Math.ceil(totalRegistros / elementosPorPagina); // Calcular el número total de páginas

        conexion.query('SELECT id, "fullName",  email, roles, phone, "isActive" FROM "user" WHERE ARRAY[$1, $2] <@ roles ORDER BY id LIMIT $3 OFFSET $4', ["client", "deliveryman", elementosPorPagina, offset],
            (error, results) => {
                if (error) {
                    throw error;
                } else {
                    // Renderizar la vista con los resultados y la información de paginación
                    res.render('Delivery.ejs', {
                        results: 
                            results.rows,
                            paginaActual,
                            elementosPorPagina,
                            totalRegistros,
                            totalPaginas
                    });
                }
            }
        );
    });
 });

//CONSULTA Y RUTA PARA TRAER TODOS LOS REGISTROS DE LA TABLA USUARIOS -- CRUD  DELIVERY, no hace save, 
//eso lo hace desde el celular, aca solo edita y elimina de manera logica, no fisica
//----------------------------------------------------------------------------------------
router.get('/Restaurante', (req, res) => {
    const elementosPorPagina = 10; // Número de elementos por página
    const paginaActual = req.query.page || 1; // Página actual, si no se proporciona, es la página 1
    const offset = (paginaActual - 1) * elementosPorPagina; // Calcular el desplazamiento para la paginación
    //console.log('Query SQL:', 'SELECT id, email, roles FROM "user" ORDER BY id LIMIT $1 OFFSET $2', [elementosPorPagina, offset]);
    conexion.query('SELECT id, "fullName",  email, roles, phone, "isActive" FROM "user" WHERE ARRAY[$1, $2] <@ roles ORDER BY id LIMIT $3 OFFSET $4', ["client", "manager", elementosPorPagina, offset], (error, results) => {
        if (error) {
            throw error;
        } 
        else {
            // Calcular si hay una página siguiente
            const length = results.rows.length;
            // Renderizar la vista con los resultados y la información de paginación
            res.render('Restaurante', { results: results.rows, paginaActual, elementosPorPagina, length });
        }
    });
});

//CONSULTA Y RUTA PARA TRAER TODOS LOS REGISTROS DE LA TABLA USUARIOS -- CRUD  CLIENTE, no hace save, 
//eso lo hace desde el celular, aca solo edita y elimina de manera logica, no fisica
//----------------------------------------------------------------------------------------
router.get('/Cliente', (req, res) => {
    const elementosPorPagina = 20; // Número de elementos por página
    const paginaActual = req.query.page || 1; // Página actual, si no se proporciona, es la página 1
    const offset = (paginaActual - 1) * elementosPorPagina; // Calcular el desplazamiento para la paginación
    //console.log('Query SQL:', 'SELECT id, email, roles FROM "user" ORDER BY id LIMIT $1 OFFSET $2', [elementosPorPagina, offset]);

    conexion.query('SELECT id, "fullName",  email, roles, phone, "isActive" FROM "user"  WHERE ARRAY[$1]::text[] = roles ORDER BY "isActive" DESC, id LIMIT $2 OFFSET $3', ["client", elementosPorPagina, offset], (error, results) => {
  
        if (error) {
            throw error;
        } 
        else {
            // Calcular si hay una página siguiente
            const length = results.rows.length;
            // Renderizar la vista con los resultados y la información de paginación
            res.render('Cliente', { results: results.rows, paginaActual, elementosPorPagina, length });
        }
    });
});

//RUTA PARA CERAR REGISTROS -- CRUD GENERAL
router.get('/create',(req,res)=>{
    res.render('create');
})

//RUTA PARA EDITAR REGISTROS -- CRUD Usuarios
router.get('/edit/:id', (req,res)=>{
    const id = req.params.id;
    conexion.query('SELECT id, "fullName", email, roles, phone, "isActive"  FROM "user" WHERE id=$1', [id],(error,results)=>{
        if(error){
            throw error;
        }
        else{
            res.render('edit',{results: results.rows  [0]});
             
        }
    })
})

//RUTA PARA ELIMINAR EL REGISTRO CRUD Usuarios, no vamos a eliminar fisicamente, solo se le cambiara el estado a false para que no pueda usarse
//por cuestiones de integridad de datos
router.get('/delete/:id',(req,res)=>{
    const id = req.params.id;
    const isActive = false;
    //conexion.query('DELETE FROM user WHERE id=$1', [id],(error,results)=>{
    conexion.query('UPDATE "user" SET "isActive" = $1 WHERE "id" = $2', [isActive, id], (error, results) => {
        if(error){
            throw error;
        }
        else{
            res.redirect('/index');
        }
    })
});


//RUTA PARA EDITAR REGISTROS -- CRUD DELIVERY---editDelivery.ejs
router.get('/editDelivery/:id', (req,res)=>{
    const id = req.params.id;
    conexion.query('SELECT id, "fullName", email, roles, phone, "isActive"  FROM "user" WHERE id=$1', [id],(error,results)=>{
        if(error){
            throw error;
        }
        else{
            res.render('editDelivery',{results: results.rows[0]});
             
        }
    })
})

//RUTA PARA EDITAR REGISTROS -- CRUD RESTAURANTE---editRestaurante.ejs
router.get('/editRestaurante/:id', (req,res)=>{
    const id = req.params.id;
    conexion.query('SELECT id, "fullName", email, roles, phone, "isActive"  FROM "user" WHERE id=$1', [id],(error,results)=>{
        if(error){
            throw error;
        }
        else{
            res.render('editRestaurante',{results: results.rows[0]});
             
        }
    })
})

/* ACA ESTABA MI CODIGO */

//RUTA PARA EDITAR REGISTROS -- CRUD CLIENTE---editRestaurante.ejs
router.get('/editCliente/:id', (req,res)=>{
    const id = req.params.id;
    conexion.query('SELECT id, "fullName", email, roles, phone, "isActive"  FROM "user" WHERE id=$1', [id],(error,results)=>{
        if(error){
            throw error;
        }
        else{
            res.render('editCliente',{results: results.rows[0]});
        }
    })
})

//RUTA PARA ELIMINAR EL REGISTRO CRUD DELIVERY, no vamos a eliminar fisicamente, solo se le cambiara el estado a false para que no pueda usarse
//por cuestiones de integridad de datos---Delivery.ejs
router.get('/deleteDelivery/:id',(req,res)=>{
    const id = req.params.id;
    const isActive = false;
    //conexion.query('DELETE FROM user WHERE id=$1', [id],(error,results)=>{
    conexion.query('UPDATE "user" SET "isActive" = $1 WHERE "id" = $2', [isActive, id], (error, results) => {
        if(error){
            throw error;
        }
        else{
            res.redirect('/Delivery');
        }
    })
});

//RUTA PARA ELIMINAR EL REGISTRO CRUD RESTAURANTE, no vamos a eliminar fisicamente, solo se le cambiara el estado a false para que no pueda usarse
//por cuestiones de integridad de datos---Restaurante.ejs
router.get('/deleteRestaurante/:id',(req,res)=>{
    const id = req.params.id;
    const isActive = false;
    //conexion.query('DELETE FROM user WHERE id=$1', [id],(error,results)=>{
    conexion.query('UPDATE "user" SET "isActive" = $1 WHERE "id" = $2', [isActive, id], (error, results) => {
        if(error){
            throw error;
        }
        else{
            res.redirect('/Restaurante');
        }
    })
});

//RUTA PARA ELIMINAR EL REGISTRO CRUD CLIENTE, no vamos a eliminar fisicamente, solo se le cambiara el estado a false para que no pueda usarse
//por cuestiones de integridad de datos---Cliente.ejs
router.get('/deleteCliente/:id',(req,res)=>{
    const id = req.params.id;
    const isActive = false;
    //conexion.query('DELETE FROM user WHERE id=$1', [id],(error,results)=>{
    conexion.query('UPDATE "user" SET "isActive" = $1 WHERE "id" = $2', [isActive, id], (error, results) => {
        if(error){
            throw error;
        }
        else{
            res.redirect('/Cliente');
        }
    })
});


 /*ESTAMOS HACIENDO EL CRUD, Aca se relacionan nuestros actions de la pagina con cada uno de los METODOS  
   definidos en el objeto crud.ejs */
 const crud = require('../controllers/crud');
 //router.post('/save',crud.save);
 router.post('/update',crud.update);
 router.post('/updateDelivery',crud.updateDelivery);
 router.post('/updateRestaurante',crud.updateRestaurante);
 router.post('/updateCliente',crud.updateCliente);
 router.post('/updateMenuXRestaurant',crud.updateMenuXRestaurant);
 router.post('/updateRestaurants',crud.updateRestaurants);
 router.post('/savecupon',crud.savecupon);
 router.post('/updateCupon',crud.updateCupon);
 //router.post('/deleteMenuXRestaurant',crud.deleteMenuXRestaurant);

//CODIGO PARA CRUD CREACION Y CONSULTA DE USUARIOS PLATAFORMA
//------------------------------------------------------------

    /* Trae todos los registros de la tabla usuarios de la plataforma, esta en layout.ejs -- CRUD */
    router.get('/DetailUserPlatform', (req, res) => {

        const elementosPorPagina = 15; // Número de elementos por página
        const paginaActual = req.query.page || 1; // Página actual, si no se proporciona, es la página 1
        const offset = (paginaActual - 1) * elementosPorPagina; // Calcular el desplazamiento para la paginación
        //console.log('Query SQL:', 'SELECT id, email, roles FROM "user" ORDER BY id LIMIT $1 OFFSET $2', [elementosPorPagina, offset]);
        conexion.query('SELECT id, "user", name, lastname,  email, roles, phone1, phone2, "passwordTemporary", "isActive" FROM "userplataforma" ORDER BY id LIMIT $1 OFFSET $2', [elementosPorPagina, offset], (error, results) => {
            if (error) {
                throw error;
            } 
            else {
                // Calcular si hay una página siguiente
                const length = results.rows.length;
                // Renderizar la vista con los resultados y la información de paginación
                res.render('DetailUserPlatform.ejs', { results: results.rows, paginaActual, elementosPorPagina, length });
            }
        });
    });

    /*Relacionando action de la pagina con cada metodo*/
    router.post('/saveuserplatform',crud.saveuserplatform); 
    router.post('/updateUserPlataform',crud.updateUserPlataform); 

    /*Obtiene el href="/createUsuariosPlataforma" de la pagina UsuariosPlataforma.ejs para ir al formulario,  */
    router.get('/CreateUserPlatform',(req,res)=>{
        res.render('CreateUserPlatform');
    })

    /*Editar registros plataforma desde editUserPlatafor.ejs */
    router.get('/editUserPlatform/:id', (req,res)=>{
        const id = req.params.id;
        conexion.query('SELECT id, "user", name, lastname,  email, roles, phone1, phone2, "passwordTemporary", "isActive" FROM "userplataforma"  WHERE id=$1', [id],(error,results)=>{
            if(error){
                throw error;
            }
            else{
                res.render('editUserPlatform',{results: results.rows  [0]});
                
            }
        })
    })

    //RUTA PARA ELIMINAR EL REGISTRO CRUD CUPON---DetailCuponGeneral.ejs
router.get('/deleteUserPlatform/:id',(req,res)=>{
    
    // const companyId = parseInt(req.params.companyId, 10); // Convierte el valor a un entero
     const id = parseInt(req.params.id, 10); // Convierte el valor a un entero*/
 
     const parsedId = parseInt(id, 10);
     if (isNaN(parsedId)) {
         return res.status(400).json({ error: 'ID inválido.' });
     }
 
     //console.log('Valores del query:', { id, companyId, });
     conexion.query('DELETE FROM userplataforma WHERE id = $1'  , [id], (error, results) => {             
         if(error){
             throw error;
         }
         else{
             res.redirect('/DetailUserPlatform');
         }
         })
 });
 

//FORMULARIO register.ejs, Registracion, sincronia en javascrip---async/await para usar decript away---ver para que sirve, se entiende que sirve para capturar
//    valores del formulario---nota: "register: se llama el formulario de register.ejs// 4/5 min 3:47
router.post('/register', async(req,res)=>{
    const user = req.body.user;
    const name = req.body.name;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passwordhaash = await bcryptjs.hash(pass,8);     //para guardar encriptada la password se utiliza el modulo decript de ash async/await
    conexion.query('INSERT INTO user SET ?', {user:user, name:name,rol:rol, pass:passwordhaash}, async(error,results)=>{
        if(error){
            console.log(error);
        }
        else{
            res.render('register',{    //Usando mensaje con swwetalerter2-->aca el CDN esta al final del body de register.ajs
                alert:true,
                alertTitle:"Registation",
                alertMessage: "Successful Registration",
                alertIcon:'success',
                showConfirmButton: false,
                timer:1500,
                ruta: 'register'
            })
        }       
    })
});


/*CREANDO REPORTE EXCEL DE LA TABLA USUARIOS---ReporteUsuarios.ejs*/
// Ruta para descargar el archivo Excel
const ExcelJS = require('exceljs');
const bodyParser = require('body-parser'); //para analizar las solicitudes POST y acceder a los datos enviados en el cuerpo de la solicitud

// Configurar bodyParser para analizar solicitudes POST
router.use(bodyParser.urlencoded({ extended: true }));

// Ruta para servir el archivo HTML
router.get('/', (req, res) => {
    res.sendFile(__dirname + '/ReportesUsuarios.ejs');
});

router.post('/ReportesUsua', (req, res) => {

    const OpcionSeleccionada = req.body.OpcionReporte;
   // console.log(OpcionSeleccionada);

    // Consulta a la base de datos utilizando una vista
    let query = ''; // Definir la variable query antes del bloque condicional


    if(OpcionSeleccionada === "MotoristasActivos"){  
        query = ` SELECT id, "fullName", email, phone, "isActive", roles, "createdAt", "updatedAt"  FROM "user"
                  WHERE Roles = '{client,deliveryman}' AND "isActive" = 'true';`;
    }

    if(OpcionSeleccionada === "MotoristasBajas"){  
        query = ` SELECT id, "fullName", email, phone, "isActive", roles, "createdAt", "updatedAt"  FROM "user"
                  WHERE Roles = '{client,deliveryman}' AND "isActive" = 'false';`;
    }

    if(OpcionSeleccionada === "RestaurantesActivos"){  
        query = ` SELECT id, "fullName", email, phone, "isActive", roles, "createdAt", "updatedAt"  FROM "user"
                  WHERE Roles = '{client,manager}' AND "isActive" = 'false';`;
    }
    if(OpcionSeleccionada === "RestaurantesBajas"){  
        query = ` SELECT id, "fullName", email, phone, "isActive", roles, "createdAt", "updatedAt"  FROM "user"
                  WHERE Roles = '{client,manager}' AND "isActive" = 'false';`;
    }

    if(OpcionSeleccionada === "ClientesAltas"){  
        query = ` SELECT id, "fullName", email, phone, "isActive", roles, "createdAt", "updatedAt"  FROM "user"
                  WHERE Roles = '{client}' AND "isActive" = 'true';`;
    }
    if(OpcionSeleccionada === "ClientesBajas"){  
        query = ` SELECT id, "fullName", email, phone, "isActive", roles, "createdAt", "updatedAt"  FROM "user"
                  WHERE Roles = '{client}' AND "isActive" = 'false';`;
    }

    if(OpcionSeleccionada === "Todos"){  
        query = ` SELECT id, "fullName", email, phone, "isActive", roles, "createdAt", "updatedAt"  FROM "user";`;
    }

    conexion.query(query, (error, results) => {
        if (error) {
            console.error('Error al consultar la base de datos:', error);
            return res.status(500).send('Error interno del servidor');
        }

        if (results.rows && results.rows.length > 0){

            // Crear un nuevo libro de Excel
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Usuarios');

            // Agregar datos al libro de Excel
            worksheet.columns = [
                { header: 'ID', key: 'id', width: 10 },
                { header: 'Nombre', key: 'fullName', width: 20 },
                { header: 'Email', key: 'email', width: 30 },
                { header: 'Telefono', key: 'phone', width: 20 },
                { header: 'Estado', key: 'isActive', width: 40 },
                { header: 'Roles', key: 'roles', width: 40 },
                { header: 'Creado', key: 'createdAt', width: 40 },
                { header: 'Modificado', key: 'updatedAt', width: 40 }
            ];

            // Agregar filas con los datos de la base de datos
            results.rows.forEach((row) => {  
                worksheet.addRow(row);
            });

            // Enviar el archivo Excel al cliente
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=RepUsu_' + OpcionSeleccionada + '_'+ formattedDate + '_.xlsx');

            workbook.xlsx.write(res)
                .then(() => {
                    res.end();
                })
                .catch((err) => {
                    console.error('Error al escribir el archivo Excel:', err);
                    res.status(500).send('Error interno del servidor');
                });
        }
        else{
            // console.log('Error al escribir el archivo Excel NO HAY DATOS')
            res.render('login',{
                alert:true,
                alertTitle:"VERIFIQUE",
                alertMessage: "NO HAY REGISTROS",
                alertIcon: "ERROR",
                showConfirmButton: TRUE,
                timer: 1500,
                ruta: 'ReportesUsuarios'
            });
        } 
            
    });
});


/* REPORTES VARIOS ORDENES RepVariosDelivery.ejs 
=================================================*/
//const ExcelJS = require('exceljs');
//const bodyParser = require('body-parser'); //para analizar las solicitudes POST y acceder a los datos enviados en el cuerpo de la solicitud

// Ruta para servir el archivo HTML
router.get('/', (req, res) => {
    res.sendFile(__dirname + '/RepVariosDelivery.ejs');
});

router.post('/RepVariosDelivery', (req, res) => {

     // Crear un nuevo libro de Excel
     const workbook = new ExcelJS.Workbook();
     const worksheet = workbook.addWorksheet('Usuarios');

    const OpcionSeleccionada = req.body.OpcionReporte;
    //console.log(OpcionSeleccionada);

    // Consulta a la base de datos utilizando una vista
    let query = ''; // Definir la variable query antes del bloque condicional

    if(OpcionSeleccionada === "OrdenesAtendidas"){  

            // Realiza la consulta MySQL
            query = `SELECT 
            a.id as idorder, 
            "deliverymanId",
            roles,
            "fullName",
            b.email as emailmotorista,
            note, 
       
            "storeId", 
            name,
            c.address as addressstore,
            contact,
            c.email as emailstore,
            c.location as locationstore,
            
            a."userId" as userid,
            a.address as addressclient, 
            status, 
            
            "deliveryFee", 
            total, 
            "deliverymanProfit", 
            "deliveryAppProfit",
            a.location as locationdeliveryman, 
            "notificationsDeliveryman", 
            "notificationsClient",
            "orderedAt" as orderedat, 
            a."createdAt" as createdat
                
            FROM "order" a
        INNER JOIN "user" b
        ON b.id = "deliverymanId"
        and roles = '{client,deliveryman}'
        INNER JOIN "store" c
        ON "storeId" = c.id
        order by a.id, b.email`;
            //if (error) throw error;

            conexion.query(query, (error, results) => {
                if (error) {
                    console.error('Error al consultar la base de datos:', error);
                    return res.status(500).send('Error interno del servidor');
                }

            // Crea un nuevo libro de Excel
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Datos');

            // Agrega los encabezados de columna
            worksheet.columns = [
                { header: 'Id Orden', key: 'idorder', width: 15 },
                { header: 'Id Motorista', key: 'deliverymanId', width: 15 },
                { header: 'Rol', key: 'roles', width: 30 },
                { header: 'Nombres', key: 'fullName', width: 20 },
                { header: 'E-mail Motorista', key: 'emailmotorista', width: 40 },
                { header: 'Notas', key: 'note', width: 40 },
                { header: 'Id restaurante', key: 'storeId', width: 15 },
                { header: 'Nombre Tienda', key: 'name', width: 40 },
                { header: 'Direccion Tienda', key: 'addressstore', width: 40 },
                { header: 'Contacto Tienda', key: 'contact', width: 40 },
                { header: 'E-mail Tienda', key: 'emailstore', width: 40 },
                { header: 'Ubicacion Tienda', key: 'locationstore', width: 60 },
                { header: 'Id Cliente', key: 'userid', width: 15 },
                { header: 'Direccion Cliente', key: 'addressclient', width: 20 },
                { header: 'Estado Orden', key: 'status', width: 15 },
                { header: 'Engrega Free', key: 'deliveryFee', width: 15 },
                { header: 'Total', key: 'total', width: 10 },
                { header: 'deliverymanProfit', key: 'deliverymanProfit', width: 15 },
                { header: 'deliveryAppProfit', key: 'deliveryAppProfit', width: 15 },
                { header: 'Ubicacion Orden', key: 'locationdeliveryman', width: 60 },
                { header: 'Notificaciones Motorista', key: 'notificationsDeliveryman', width: 40 },
                { header: 'Notificaciones Cliente', key: 'notificationsClient', width: 40 },
                { header: 'orderedAt', key: 'orderedat', width: 15 },
                { header: 'createdAt', key: 'createdat', width: 15 }

                
            ];

            // Agrega los datos recuperados de MySQL a las filas de Excel
            results.rows.forEach((row)=> {
                worksheet.addRow(row);
            });

             // Enviar el archivo Excel al cliente
             //res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
             res.setHeader('Content-Disposition', 'attachment; filename=RepUsu_' + OpcionSeleccionada + '_'+ formattedDate + '_.xlsx');
 
             workbook.xlsx.write(res)
                 .then(() => {
                     res.end();
                 })
                 .catch((err) => {
                     console.error('Error al escribir el archivo Excel:', err);
                     res.status(500).send('Error interno del servidor');
                 });
        });
        //conexion.end();
    }
});

router.post('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'RepVariosDelivery.ejs'));
});


//ruta de mi pagina mapa
router.get('/maps', (req,res)=>{
    res.render('maps.ejs');
});
 
/*CONSULTAS PARA EL MODULO DE MANTENIMIENTOS CRUD RESTAURANTE 
--------------------------------------------------------------*/

    //MENU MANTENIMIENTOS
    router.get('/SearchRestaurant', (req,res)=>{
        res.render('SearchRestaurant.ejs');
    });


 // Consulta el menú de todos los restaurantes
router.get('/Restaurants', (req, res) => {
    const elementosPorPagina = 20; // Número de elementos por página
    const paginaActual = parseInt(req.query.page) || 1; // Página actual, si no se proporciona, es la página 1
    const offset = (paginaActual - 1) * elementosPorPagina; // Calcular el desplazamiento para la paginación

    // Primero, cuenta el total de registros
    conexion.query('SELECT COUNT(*) FROM "user" A INNER JOIN company B ON A.id = "userId" AND ARRAY[$1, $2] <@ roles', ["client", "manager"], (error, countResult) => {
        if (error) {
            throw error;
        }

        const totalRegistros = parseInt(countResult.rows[0].count); // Número total de registros
        const totalPaginas = Math.ceil(totalRegistros / elementosPorPagina); // Calcular el número total de páginas

        // Luego, realiza la consulta paginada
        conexion.query('SELECT B."id" as "idCompany" , B.name as "companyName", B.email, B.address, B.contact, B.image, B."createdAt", A.id as "idUser", "fullName", A.email, phone, A."isActive", roles, A."createdAt", "isEmailConfirmed" FROM "user" A INNER JOIN company B ON A.id = "userId" AND ARRAY[$1, $2] <@ roles ORDER BY B.id LIMIT $3 OFFSET $4',["client", "manager", elementosPorPagina, offset],
            (error, results) => {
                if (error) {
                    throw error;
                } else {
                    // Renderizar la vista con los resultados y la información de paginación
                    res.render('Restaurants.ejs', {
                        results: 
                            results.rows,
                            paginaActual,
                            elementosPorPagina,
                            totalRegistros,
                            totalPaginas
                    });
                }
            }
        );
    });
});

    //Edita los registros del restaurante- CRUD RESTAURANTES---editRestaurants.ejs
    router.get('/editRestaurants/:id', (req,res)=>{
        const id = req.params.id;
        conexion.query('SELECT id,  name, contact, image, email, address, location, "createdAt", "updatedAt","userId", "isActive" FROM company WHERE id=$1', [id],(error,results)=>{
            if(error){
                throw error;
            }
            else{
                //console.log(results.isActive);
                if (!results.isActive) {
                    console.log("El valor de isActive es inesperado:", results.isActive);
                }
                res.render('editRestaurants.ejs',{results: results.rows[0]});
                
            }
        })
    })

    //RUTA PARA ELIMINAR UN RESTAURANTE FISICAMENTE, esto no podra deshaserse
    //por cuestiones de integridad de datos---Delivery.ejs
    router.get('/deleteRestaurant/:id/',(req,res)=>{
       
        const id = parseInt(req.params.id, 10); // Convierte el valor a un entero*/

        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        //console.log('Valores del query:', { id, companyId, });
        conexion.query('DELETE FROM company WHERE id = $1'  , [id], (error, results) => {             
            if(error){
                throw error;
            }
            else{
                res.redirect('/Restaurants');
            }
         })
    });

    //Consulta el menu por restaurante
    router.get('/MenuXRestaurants', (req, res) => {
        const elementosPorPagina = 20; // Número de elementos por página
        const paginaActual = req.query.page || 1; // Página actual, si no se proporciona, es la página 1
        const offset = (paginaActual - 1) * elementosPorPagina; // Calcular el desplazamiento para la paginación
        conexion.query('SELECT "companyId", A.name AS "NameCompany", A.address, B.id, B.name AS "NameProduct", B.description, B.image, type, price, B."isActive", B."createdAt", B."updatedAt", "deletedAt" FROM company A INNER JOIN product B ON A.id = "companyId" ORDER BY "companyId", B.id LIMIT $1 OFFSET $2', [elementosPorPagina, offset], (error, results) => {
            if (error) {
                throw error;
            } 
            else {
                // Calcular si hay una página siguiente
                const length = results.rows.length;
                // Renderizar la vista con los resultados y la información de paginación
                res.render('MenuXRestaurant.ejs', { results: results.rows, paginaActual, elementosPorPagina, length });
            }
        });
    });
    //Consulta el menu por restaurante
    router.post('/SearchMenuXRestaurante',(req,res)=>{
        const IdRestaurante = req.body.id;
        const elementosPorPagina = 20; // Número de elementos por página
        const paginaActual = req.body.page || 1; // Página actual, si no se proporciona, es la página 1
        const offset = (paginaActual - 1) * elementosPorPagina; // Calcular el desplazamiento para la paginación
        // console.log('Query SQL:', 'SELECT "companyId", A.name AS "NameCompany", A.address, B.id, B.name AS "NameProduct", B.description, B.image, type, price, B."createdAt", B."updatedAt", "deletedAt" FROM company A INNER JOIN product B ON A.id = "companyId" AND "companyId"  = $1 ORDER BY B.id  LIMIT $2 OFFSET $3', ["companyId", elementosPorPagina, offset]);
        conexion.query('SELECT "companyId", A.name AS "NameCompany", A.address, B.id, B.name AS "NameProduct", B.description, B.image, type, price, B."isActive", B."createdAt", B."updatedAt", "deletedAt" FROM company A INNER JOIN product B  ON A.id = "companyId" WHERE "companyId"  = $1 ORDER BY B.id  LIMIT $2 OFFSET $3', [IdRestaurante,elementosPorPagina, offset], (error, results) => {
            if (error) {
                throw error;
            } 
            else {
                // Calcular si hay una página siguiente
                const length = results.rows.length;
                // Renderizar la vista con los resultados y la información de paginación
                res.render('MenuXRestaurant.ejs', { results: results.rows, paginaActual, elementosPorPagina, length });
            }
        });
    });
    
    //Edita los registros del menu-- CRUD DEL LOS MENUS DEL RESTAURANTE---editRestaurante.ejs
    router.get('/editMenuXRestaurant/:id', (req,res)=>{
        const id = req.params.id;
            conexion.query('SELECT "companyId", A.name AS "NameCompany", A.address, B.id, B.name AS "NameProduct", B."isActive", B.description, B.image, type, price, B."createdAt", B."updatedAt", "deletedAt" FROM company A INNER JOIN product B ON A.id = "companyId" WHERE B.id=$1', [id],(error,results)=>{
            if(error){
                throw error;
            }
            else{
                //console.log(results.isActive);
                if (!results.isActive) {
                    console.log("El valor de isActive es inesperado:", results.isActive);
                }
                res.render('editMenuXRestaurant.ejs',{results: results.rows[0]});
                
            }
        })
    })

//RUTA PARA ELIMINAR EL REGISTRO CRUD DELIVERY, no vamos a eliminar fisicamente, solo se le cambiara el estado a false para que no pueda usarse
//por cuestiones de integridad de datos---Delivery.ejs
router.get('/deleteMenuXRestaurant/:id/:companyId',(req,res)=>{
    
    const companyId = parseInt(req.params.companyId, 10); // Convierte el valor a un entero
    const id = parseInt(req.params.id, 10); // Convierte el valor a un entero*/

    const parsedcompanyId = parseInt(companyId, 10);
    if (isNaN(parsedcompanyId)) {
        return res.status(400).json({ error: 'ID company inválido.' });
    }

    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'ID inválido.' });
    }

    //console.log('Valores del query:', { id, companyId, });
    conexion.query('DELETE FROM product WHERE "companyId" = $1 AND id = $2'  , [companyId, id], (error, results) => {             
        if(error){
            throw error;
        }
        else{
            res.redirect('/MenuXRestaurant');
        }
        })
});


    //CONSULTA Y RUTA PARA TRAER TODOS LOS REGISTROS DE LA TABLA USUARIOS -- CRUD  DELIVERY, no hace save, 
//eso lo hace desde el celular, aca solo edita y elimina de manera logica, no fisica
//----------------------------------------------------------------------------------------
router.get('/DetailCuponGeneral', (req, res) => {
    const elementosPorPagina = 20; // Número de elementos por página
    const paginaActual = parseInt(req.query.page) || 1; // Página actual, si no se proporciona, es la página 1
    const offset = (paginaActual - 1) * elementosPorPagina; // Calcular el desplazamiento para la paginación

    // Primero, cuenta el total de registros
    conexion.query('SELECT COUNT(*) FROM "cupones" ', (error, countResult) => {
        if (error) {
            throw error;
        }

        const totalRegistros = parseInt(countResult.rows[0].count); // Número total de registros
        const totalPaginas = Math.ceil(totalRegistros / elementosPorPagina); // Calcular el número total de páginas

        // Luego, realiza la consulta paginada
        conexion.query('SELECT id, fechainicio, fechafin, monto, descripcion, estado, "createdAt", "usuario"  FROM "cupones"  ORDER BY id LIMIT $1 OFFSET $2',[ elementosPorPagina, offset],
            (error, results) => {
                if (error) {
                    throw error;
                } else {

                    // Convertir las fechas a formato YYYY-MM-DD
                    results.rows.forEach(row => {
                        row.fechainicio = row.fechainicio.toISOString().split('T')[0];  // Solo la parte de la fecha 2022-11-29T22:45:56.371Z
                        row.fechafin = row.fechafin.toISOString().split('T')[0];        // Solo la parte de la fecha
                        //row.createdAt = row.createdAt.toISOString().split('T')[0];
                    });

                    // Renderizar la vista con los resultados y la información de paginación
                    res.render('DetailCuponGeneral.ejs', {
                        results: 
                            results.rows,
                            paginaActual,
                            elementosPorPagina,
                            totalRegistros,
                            totalPaginas
                    });
                }
            }
        );
    });
});

//Edita los registros del cupon- CRUD CUPON---editCupon.ejs
router.get('/editCupon/:id', (req,res)=>{
    const id = req.params.id;
    conexion.query('SELECT id, fechainicio, fechafin, monto, descripcion, imagencupon, estado, usuario, "createdAt", "updatedAt" FROM cupones WHERE id=$1', [id],(error,results)=>{
        if(error){
            throw error;
        }
        else{
            //console.log(results.isActive);
            /*if (!results.isActive) {
                console.log("El valor de isActive es inesperado:", results.isActive);
            }*/
            results.rows.forEach(row => {
                row.fechainicio = row.fechainicio.toISOString().split('T')[0];  // Solo la parte de la fecha 2022-11-29T22:45:56.371Z
                row.fechafin = row.fechafin.toISOString().split('T')[0];        // Solo la parte de la fecha
                //row.createdAt = row.createdAt.toISOString().split('T')[0];
            });

            res.render('editCupon.ejs',{results: results.rows[0]});
        }
    })
});

//RUTA PARA ELIMINAR EL REGISTRO CRUD CUPON---DetailCuponGeneral.ejs
router.get('/deleteCupon/:id',(req,res)=>{
    
   // const companyId = parseInt(req.params.companyId, 10); // Convierte el valor a un entero
    const id = parseInt(req.params.id, 10); // Convierte el valor a un entero*/

    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'ID inválido.' });
    }

    //console.log('Valores del query:', { id, companyId, });
    conexion.query('DELETE FROM cupones WHERE id = $1'  , [id], (error, results) => {             
        if(error){
            throw error;
        }
        else{
            res.redirect('/DetailCuponGeneral');
        }
        })
});

router.get('/CreateNewCupon',(req,res)=>{
    res.render('CreateNewCupon.ejs');
})
//exportamos a router
module.exports={ routes: router}


