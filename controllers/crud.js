const conexion = require('../database/db');

//6. invocamos a bcryptjs
const bcryptjs = require('bcryptjs');

/* capturando los datos del formulario 
//agregar un usuario desde el CRUD APP telefono
exports.save=(req,res)=>{
    const user = req.body.user;
    const rol = req.body.rol;
    /*console.log(user + " - " + rol);*/ /*esto para imprimir en consola 

    conexion.query('INSERT INTO user SET ?', {user:user, rol:rol}, (error, results)=>{
        if(error){
            console.log(error);
        }
        else{
            res.redirect('/index')
        }
    })
}*/

//creando el action dentro de nuestro controlador uno para modificar
//Update CRUD mantenimiento usuarios GENERAL chispudo---INDEX.ejs
exports.update =(req,res)=>{
    const id = parseInt(req.body.id);
    const fullName = req.body.fullName;
    const phone  = req.body.phone;
    const isActive  = req.body.isActive;
    conexion.query('UPDATE "user" SET "fullName" = $1, "phone" = $2, "isActive" = $3 WHERE "id" = $4', [fullName, phone, isActive, id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        } else {
            res.redirect('/index');
        }
    });
}

//PROCEDIMIENTO PARA MODIFICAR USUARIOS -- CRUD  DELIVERY, no hace save, 
//eso lo hace desde el el celular, aca solo edita el registro ---editDelivery.ejs
//----------------------------------------------------------------------------------------
exports.updateDelivery =(req,res)=>{
    const id = parseInt(req.body.id);
    const fullName = req.body.fullName;
    const email = req.body.email;
    const phone  = req.body.phone;
    const isActive  = req.body.isActive;

    conexion.query('UPDATE "user" SET "fullName" = $1, email= $2, "phone" = $3, "isActive" = $4 WHERE "id" = $5', [fullName, email, phone, isActive, id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        } else {
            res.redirect('/Delivery');
        }
    });
}

//PROCEDIMIENTO PARA MODIFICAR USUARIOS -- CRUD  RESTARANTES, no hace save, 
//eso lo hace desde el el celular, aca solo edita el registro  ---editRestaurante.ejs
//----------------------------------------------------------------------------------------
exports.updateRestaurante =(req,res)=>{
    const id = parseInt(req.body.id);
    const fullName = req.body.fullName;
    const email = req.body.email;
    const phone  = req.body.phone;
    const isActive  = req.body.isActive;

    conexion.query('UPDATE "user" SET "fullName" = $1, email= $2, "phone" = $3, "isActive" = $4 WHERE "id" = $5', [fullName, email, phone, isActive, id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        } else {
            res.redirect('/Restaurante');
        }
    });
}


//PROCEDIMIENTO PARA MODIFICAR USUARIOS -- CRUD  RESTARANTES, no hace save, 
//eso lo hace desde el el celular, aca solo edita el registro  ---editRestaurante.ejs
// NOTA: No esta la logica de imagen se utiliza codigo especial forbase, ver notas whatsapp y 
// chatgpt
//----------------------------------------------------------------------------------------
exports.updateMenuXRestaurant =(req,res)=>{
   
    const name = req.body.NameProduct?.trim(); // Elimina espacios vacíos alrededor del valor
    const price = req.body.price;
    const description = req.body.description;
    const isActive = req.body.isActive;
    const id = parseInt(req.body.id);
    const companyId = parseInt(req.body.companyId, 10); // Convierte el valor a un entero
    //const image  = req.body.image;
   // const type = req.body.type;

   let errors = [];

   // Validación del lado del servidor
   if (!name || name.length === 0) {
       errors.push('El nombre del producto es obligatorio.');
   }

   if (isNaN(price) || price <= 0) {
    errors.push('El precio debe ser mayor que 0.');
}

   if (!description || description.length === 0) {
       errors.push('La descripción es obligatoria.');
   }

    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'ID inválido.' });
    }

  // console.log('Valores del query:', { name, price, description, isActive, companyId, id });*/

    conexion.query('UPDATE product SET name = $1,  price = $2, description = $3,  "isActive" = $4 WHERE "companyId" = $5 AND id = $6', [name, price, description, isActive, companyId, id], (error, results) => {
        if (error) {
            console.error('Error en la consulta:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        } 
        else {
            res.redirect('/MenuXRestaurant');
        }
    });
}

//PROCEDIMIENTO PARA MODIFICAR RESTAURANTES -- CRUD  RESTARANTES, no hace save, 
// aca solo edita el registro  ---editRestaurants.ejs
// NOTA: No esta la logica de imagen se utiliza codigo especial forbase, ver notas whatsapp y 
// chatgpt
//----------------------------------------------------------------------------------------
exports.updateRestaurants =(req,res)=>{
    const id = parseInt(req.body.id);
    const name = req.body.name?.trim(); // Elimina espacios vacíos alrededor del valor
    const contact = req.body.contact;
    const email = req.body.email;
    const address = req.body.address;
    const isActive = req.body.isActive;
    //const image  = req.body.image;


   let errors = [];

   // Validación del lado del servidor
   if (!name || name.length === 0) {
       errors.push('El nombre del producto es obligatorio.');
   }
    if (!contact || name.contact === 0) {
        errors.push('El nombre del contacto es obligatorio.');
    }

   if (!email || email.length === 0) {
       errors.push('El email es obligatoria.');
   }
   if (!address || address.length === 0) {
    errors.push('La direccion es obligatoria.');
}
    if (!isActive || isActive.length === 0) {
        errors.push('El estado es obligatoria.');
    }

    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'ID inválido.' });
    }

  // console.log('Valores del query:', { name, price, description, isActive, companyId, id });*/

    conexion.query('UPDATE company SET name = $1,  contact = $2, email = $3, address = $4, "isActive" = $5 WHERE  id = $6', [name, contact, email, address, isActive, id], (error, results) => {
        if (error) {
            console.error('Error en la consulta:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        } 
        else {
            res.redirect('/Restaurants');
        }
    });
}

//PROCEDIMIENTO PARA MODIFICAR USUARIOS -- CRUD  CLIENTE, no hace save, 
//eso lo hace desde el el celular, aca solo edita el registro  ---editCliente.ejs
//----------------------------------------------------------------------------------------
exports.updateCliente =(req,res)=>{
    const id = parseInt(req.body.id);
    const fullName = req.body.fullName;
    const email = req.body.email;
    const phone  = req.body.phone;
    const isActive  = req.body.isActive;

    conexion.query('UPDATE "user" SET "fullName" = $1, email= $2, "phone" = $3, "isActive" = $4 WHERE "id" = $5', [fullName, email, phone, isActive, id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        } else {
            res.redirect('/Cliente');
        }
    });
}


 //10. REGISTER.asp
//Registracion PAGE register.ejs, sincronia en javascrip---async/await para usar decript away---ver para que sirve, se entiende que sirve para capturar
//    valores del formulario---notara: "register: se llama el formulario de register.ejs// 4/5 min 3:47
//Pantalla mantenimientos de usuario de la plataforma register.ejs
exports.Register = async(req, res)=>{    
    const user = req.body.user;
    const name = req.body.name;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passwordhaash = await bcryptjs.hash(pass,8);     //para guardar encriptada la password se utiliza el modulo decript de ash async/await
    conexion.query('INSERT INTO users SET ?', {user:user, name:name,rol:rol, pass:passwordhaash}, async(error,results)=>{
        if(error){
            console.log(error);
        }
        else{
            res.redirect('/register')
    
        }
    })
}


/* PROCESOS CRUD DE LA PLATAFORMA PARA USUARIOS DE LA PLATAFORMA
//-------------------------------------------------------------*/
    //Guarda un registro nuevo 
    exports.saveuserplatform = async(req, res) => {
        const user = req.body.user;
        const name = req.body.name;
        const lastname = req.body.lastname;
        const email = req.body.email;
        const phone1 = req.body.phone1;
        const phone2 = req.body.phone2;
        const roles = req.body.roles;
        const passwordTemporary = req.body.passwordTemporary;
       const isActive = true;

        console.log(user);
        console.log(name);
        console.log(lastname);
        console.log(email);
        console.log(phone1);
        console.log(phone2);
        console.log(roles);
        console.log(passwordTemporary);

        let passwordTemporaryhaash= await bcryptjs.hash(passwordTemporary,8);

        // Validar que los campos existan y que rol sea un string
        //if (!user || !name || !lastname || !email || !phone1 || !phone2 || !roles || typeof roles !== 'string') {
        if (!user || !name || !lastname || !email || !phone1 || !phone2 || !roles|| !passwordTemporary || !isActive) {
            //return res.status(400).send("Veerifique uno de los campos esta vacio.");
            errors.push('Veerifique uno de los campos esta vacio.');
        }


        // Query de inserción
        const query = 'INSERT INTO userplataforma ("user", name, lastname, email, phone1, phone2, roles, "passwordTemporary", "isActive" ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
        const values = [user, name, lastname, email, phone1, phone2, roles, passwordTemporaryhaash,isActive];  // Insertamos directamente user y rol

        conexion.query(query, values, (error, results) => {
            if (error) {
                console.error("Error al insertar en la base de datos:", error);
                return res.status(500).send("Ocurrió un error al guardar el usuario en la plataforma.");
            } else {
                res.redirect('/DetailUserPlatform');
            }
        });
    };

    //Modifiaca un registro consultado un registro nuevo 
    exports.updateUserPlataform =async(req,res)=>{
        const id = parseInt(req.body.id);
        const user = req.body.user;
        const name = req.body.name;
        const lastname = req.body.lastname;
        const email  = req.body.email;
        const phone1  = req.body.phone1;
        const phone2  = req.body.phone2;
        const roles  = req.body.roles;
        const passwordTemporary  = req.body.passwordTemporary;
        const isActive = req.body.isActive;

        let passwordTemporaryhaash= await bcryptjs.hash(passwordTemporary,8);

        conexion.query('UPDATE "userplataforma" SET "user" = $1, name= $2, "lastname" = $3, "email" = $4, "phone1" = $5, "phone2" = $6, "roles" = $7, "passwordTemporary" =$8, "isActive" = $9 WHERE "id" = $10', [user, name, lastname, email, phone1, phone2, roles, passwordTemporaryhaash, isActive, id], (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Error interno del servidor' });
            } else {
                res.redirect('/DetailUserPlatform');
            }
        });
    }

/* PROCESOS CRUD DE CUPONES DE LA PLATAFORMA
//-------------------------------------------------------------*/
//Guarda un registro nuevo 
exports.savecupon = (req, res) => {
    const fechainicio = req.body.fechainicio;
    const fechafin = req.body.fechafin;
    const monto = req.body.monto;
    const descripcion = req.body.descripcion;
    const imagencupon = req.body.imagencupon;
   // const estado = req.body.estado;
    const estado = 'activo';
    const usuario = req.body.usuario;

   
    console.log(fechainicio);
    console.log(fechafin);
    console.log(monto);
    console.log(descripcion);
    console.log(imagencupon);
    console.log(estado);
    console.log(usuario);

    // Validar que los campos existan y que rol sea un string
    //if (!user || !name || !lastname || !email || !phone1 || !phone2 || !roles || typeof roles !== 'string') {
    if (!fechainicio || !fechafin || !monto || !descripcion  ||  !estado || !usuario ) {
        return res.status(400).send("Veerifique uno de los campos esta vacio.");
    }

    // Query de inserción
    const query = 'INSERT INTO cupones (fechainicio, fechafin, monto, descripcion, imagencupon, estado, "usuario" ) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    const values = [fechainicio, fechafin, monto, descripcion, imagencupon, estado, usuario];  // Insertamos directamente user y rol

    conexion.query(query, values, (error, results) => {
        if (error) {
            console.error("Error al insertar en la base de datos:", error);
            return res.status(500).send("Ocurrió un error al guardar el usuario en la plataforma.");
        } else {
            res.redirect('/DetailCuponGeneral');
        }
    });
};

//PROCEDIMIENTO PARA MODIFICAR CUPONES -- CRUD  CUPONES
// NOTA: No esta la logica de imagen se utiliza codigo especial forbase, ver notas whatsapp y 
// chatgpt
//----------------------------------------------------------------------------------------
exports.updateCupon =(req,res)=>{
    const fechainicio = req.body.fechainicio;
    const fechafin = req.body.fechafin;
    const monto = req.body.monto;
    const descripcion = req.body.descripcion;
    const imagencupon = req.body.imagencupon;
    const estado = req.body.estado;
    const usuario = req.body.usuario;
    const id = parseInt(req.body.id);
    //const image  = req.body.image;

   let errors = [];

   // Validación del lado del servidor
   if (!fechainicio || fechainicio.length === 0 || fechainicio.length === "") {
       errors.push('La fecha inicio es obligatoria.');
   }
   if (!fechafin || fechafin.length === 0 || fechafin.length === "") {
    errors.push('La fecha fin es obligatoria.');
   }

   if (!monto || monto.length === 0) {
       errors.push('El monto es obligatoria.');
   }
   if (!descripcion || descripcion.length === 0) {
      errors.push('La descripcion es obligatoria.');
   }
   /* if (!imagencupon || imagencupon.length === 0) {
        errors.push('La imagencupon es obligatoria.');
    }*/

    if (!estado || estado.length === 0) {
        errors.push('El estado es obligatorio.');
    }

    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'ID inválido.' });
    }
 
        // Si hay errores, responde con un código de estado 400 y el mensaje de error
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }


  //console.log('Valores del query:', { fechainicio, fechafin, monto, descripcion, imagencupon, estado, id });

    conexion.query('UPDATE cupones SET fechainicio = $1,  fechafin = $2, monto = $3, descripcion = $4, imagencupon = $5, estado = $6 WHERE  id = $7', [fechainicio, fechafin, monto, descripcion, imagencupon, estado, id], (error, results) => {
        if (error) {
            console.error('Error en la consulta:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        } 
        else {
            res.redirect('/DetailCuponGeneral');
        }
    });

    //res.json({ message: "Cupón actualizado exitosamente" });
}
//module.exports={ routes: router}