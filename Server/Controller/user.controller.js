
const { userModel } = require("../Model/user.model")
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary')
const { productModel } = require("../Model/admin.model")
const SECRET = process.env.JWT_SECRET
const EMAIL = process.env.EMAIL
const PASSWORD = process.env.PASSWORD
const CLOUD_NAME = process.env.CLOUD_NAME
const API_KEY = process.env.API_KEY
const API_SECRET = process.env.API_SECRET
const getLandingPage = (req, res) => {
    res.send(`Welcome to e-commerce site`)
}
cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET
});

const signup = (req, res) => {
    const userDetails = req.body
    // var transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: "jfixcoding@gmail.com",
    //         pass: "<FIXgufaith996.com/>"
    //     }
    // });
    const userEmail = userDetails.email

    userModel.findOne({ email: userDetails.email }, (err, user) => {
        if (err) {
            console.log(`error dey`);
        } else {
            if (user) {
                res.send({ message: `user already exist`, status: false })
            }
            else {
                const form = new userModel(userDetails)
                form.save((err) => {
                    if (err) {
                        res.status(501).send({ message: `error occur not registered`, status: false })
                    } else {
                        // var mailMessage = {
                        //     from: 'adeoyejohn293@gmail.com',
                        //     to: userEmail,
                        //     subject: 'Registration successfull!',
                        //     text: 'Welcome to JFIX E-commerce site'
                        // }
                        // transporter.sendMail(mailMessage, (err, info) => {
                        //     if (err) {
                        //         console.log(err);
                        //     }
                        // else {
                        // console.log(info.response);
                        res.status(200).send({ message: `Registration successfull`, status: true, })
                        // }
                        // })
                    }
                })
            }
        }
    })
}
const signin = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    userModel.findOne({ email: email }, (err, user) => {
        if (err) {
            console.log(`internal error`);
        }
        else {
            if (!user) {
                console.log(`no account of this details is with us`);
                res.send({ message: `No account of this details is with us`, status: false })
            }
            else {
                user.validatePassword(password, (err, same) => {
                    if (err) {
                        console.log(`issue occur`);
                    }
                    else {
                        if (same) {
                            const token = jwt.sign({ email }, SECRET, { expiresIn: '6h' })
                            res.send({ message: 'authenticated successfull', status: true, token })
                        }
                        else {
                            res.send({ message: 'incorrect password', status: false })
                        }
                    }
                })
            }
        }
    })
}
const home = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    jwt.verify(token, SECRET, (err, result) => {
        if (err) {
            res.send({ message: `user is unathorized`, status: false })
        } else {
            userModel.findOne({ email: result.email }, (err, userDetails) => {
                if (err) {
                    res.send({ message: `Network error, please check your connection`, status: false })
                }
                else {
                    res.send({ message: `user authorized`, status: true, userDetails })
                }
            })
        }
    })
}
const getUser = (req, res) => {
    const userId = req.body.userId
    userModel.findOne({ '_id': userId }, (err, user) => {
        if (err) {
            res.send({ message: `User unidentified`, status: false })
        } else {
            res.send({ user, status: true })
        }
    })
}
const getCart = (req, res) => {
    const userId = req.body.userId
    userModel.findOne({ "_id": userId }, (err, user) => {
        if (err) {
            console.log(`Can't find the user`);
            res.send({ message: `internal server error`, status: false })
        } else {
            let totalPrice = 0;
            user.cartProduct.map((eachProduct) => {
                totalPrice += parseInt(eachProduct.productPrice)
            })
            res.send({ message: `Cart products`, products: user.cartProduct, status: true, totalPrice })
        }
    })
}
const cartProduct = (req, res) => {
    const productImage = req.body.productImage
    const productTitle = req.body.title
    const productVariation = req.body.productVariation
    const productPrice = req.body.price * productVariation
    const userId = req.body.userId
    userModel.findOneAndUpdate({ '_id': userId }, { $push: { 'cartProduct': { productImage, productPrice, productTitle, productVariation } } }, (err, updatedVersion) => {
        if (err) {
            res.send({ message: `Internal server error`, status: false })
            console.log(`err dey for here`);
        }
        else {
            res.send({ message: `Product added to your cart`, status: true })
        }
    })
}
const removeCartItem = (req, res) => {
    const userId = req.body.userId;
    const productImage = req.body.productImage
    userModel.findOne({ '_id': userId }, (err, result) => {
        if (err) {
            console.log(err);
            console.log(`There's an error`);
        } else {
            const thisUser = result
            let found = thisUser.cartProduct.filter(thisOne =>
                productImage != thisOne.productImage
            )
            if (found) {
                userModel.findOneAndUpdate({ '_id': userId }, { 'cartProduct': found }, (err, productRemains) => {
                    if (err) {
                        console.log(`An error occur in the updating of the remaining product`);
                    } else {
                        console.log(productRemains);
                    }
                })
            }
        }
    })
}

const saveProfile = (req, res) => {
    const userDetails = req.body
    const profilePhoto = userDetails.profilePhoto
    const userId = req.body.userId
    const userEmail = req.body.email
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const contact = req.body.contact
    cloudinary.v2.uploader.upload(profilePhoto, (err, result) => {
        if (err) {
            console.log(`Unable to upload, due to internal server error`);
        } else {
            const uploadedPhoto = result.secure_url
            userModel.findOneAndUpdate({ 'email': userEmail }, { $set: {'profilePhoto': uploadedPhoto,  'firstname': firstname, 'lastname': lastname, 'contact': contact } }, (err, result) => {
                if (err) {
                    console.log(err);
                    console.log(`error dey`);
                } else {
                    console.log(result);
                }
            })
        }
    })
}
const product=(req, res)=>{
    productModel.find((err, result)=>{
        if(err){
            res.send({message: `Internal server error`, status: false})
        }else{
            res.send({result, status: true})
        }
    })
}

module.exports = { getLandingPage, signup, signin, home,getUser, getCart, cartProduct, removeCartItem, saveProfile, product }