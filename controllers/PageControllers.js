vistaPrincipal = (req,res)=>{
    res.render('home.ejs')
}

vistaTables = (req,res)=>{
    res.render('tables.ejs')
}

vistaForm2 = (req,res)=>{
    res.render('form2.ejs')
}

vistaRegister = (req,res)=>{
    res.render('register.ejs')
}
vistaReportesUsuarios = (req,res)=>{  
    res.render('ReportesUsuarios.ejs')
}

vistaRepVariosDelivery = (req,res)=>{  
    res.render('RepVariosDelivery.ejs')
}

vistaWidget = (req,res)=>{  
    res.render('widget.ejs')
}

module.exports = {
    vistaPrincipal,
    vistaTables,
    vistaForm2,
    vistaRegister,
    vistaReportesUsuarios,
    vistaRepVariosDelivery,
    vistaWidget
}