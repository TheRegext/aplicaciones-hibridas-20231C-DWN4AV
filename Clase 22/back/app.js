import express from 'express'
import ProductRoute from './routes/products.routes.js'
import ProductRouteApi from './api/routes/products.api.routes.js'
import AccountRoute from './api/routes/account.api.routes.js'
import cors from 'cors'
import multer from 'multer'
import sharp from 'sharp'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'products_img')
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

//const upload = multer({ dest: 'uploads/' })

async function resizeImage(req, res, next) {
    return sharp(req.file.path)
        .resize(150)
        .jpeg({ quality: 50 })
        .toFile('products_img/' + req.file.originalname + '_thumbnail.jpg')
        .then(function (newFileInfo) {
            console.log("Se creo el thumbnail")
            next()
        })
        .catch(function (err) {
            console.log("Error al crear el thumbnail")
            console.log(err)
            res.status(500).send("Error al crear el thumbnail")
        })
}


const app = express() // el server
app.use(cors())

app.use(express.urlencoded({ extended: true })) // para poder leer el body de las solicitudes POST de un formulario
app.use('/api', express.json()) // interpreta el body como JSON

app.use('/', express.static('public'))
app.use('/products/img', [], express.static('products_img'))

app.use('/', ProductRoute)
app.use('/api', ProductRouteApi)
app.use('/api', AccountRoute)



app.get('/upload', [], function (req, res) {
    res.sendFile(path.resolve('/img/avatars/' + req.acocunt._id + '.jpg'))
})

app.post('/upload', [upload.single('imagen_principal'), resizeImage], function (req, res) {

    console.log("Body:", req.body)
    console.log("File: ", req.file)
    //ProductService.addImage(idProducto, req.file.path)

    console.log("Se subio el archivo")

    res.send("OK")
})







app.listen(2023, function () {
    console.log('Servidor levantado! http://localhost:2023')
})
