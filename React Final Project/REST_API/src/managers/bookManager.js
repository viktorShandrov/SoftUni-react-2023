const models = require("../models/allModels")
const {isOwnedByUser, isAdmin} = require("../managerUtils/managerUtil");
const mongoose = require("mongoose");
const {model} = require("mongoose");
const {storage} = require("../utils/firebase")


const  { v4 } = require("uuid") ;
const {
    ref,
    uploadBytes,
    getDownloadURL,
} = require("firebase/storage") ;
const {createBookStripeProduct, deleteProduct} = require("./stripeManager");


exports.getBook =async(bookId,userId)=>{
    const user = await models.userModel.findById(userId)
    if(user.role!=="admin"){
        await isOwnedByUser(userId,bookId,models.bookModel,"ownedBy")
    }
    const book = (await models.bookModel.findById(bookId)).toObject()
    delete book.ownedBy
   return  book

}
exports.getBookDetails =async(bookId,userId)=>{
    let book
    try{
         book = await models.bookModel.findById(bookId).populate("reviews.writtenBy")
    }catch (error){
        throw new Error("Няма такава книга")
    }
    book = book.toObject()

    if(book.chapters&&book.chapters.length>0){
        book.firstChapter = book.chapters[0]
    }

    delete book.chapters


    book.isBookOwnedByUser = exports.isBookOwnedByUser(book,userId)
    book.similarBooks = await getSimilarBooks(book)
    book.similarBooks.splice(book.similarBooks.findIndex((currBook=>book._id===currBook._id)),1)

    if (book.reviews){
        for (const review of book.reviews) {
            if(!review.writtenBy) {
                //TODO:to be deleted in DB
                const reviewIndex = book.reviews.indexOf(review)
                book.reviews.splice(reviewIndex,1)
                continue
            }
            review.writtenBy = {
                imageURL:review.writtenBy.imageURL,
                username:review.writtenBy.username
            }
            if(review.likedBy){
                review.isLikedByUser = review.likedBy.some((id)=>id.equals(userId))
                delete review.likedBy
            }
        }
    }

    book.isWishedByUser = book.wishedBy.some(id=>id.equals(userId))

    delete book.ownedBy
    delete book.wishedBy

    return book

}
exports.getBookForFree = async(userId,bookId)=>{
    const user = await models.userModel.findById(userId)
    if(!user.inventory.freeBook) throw new Error("Нямате достатъчно безплатни книги в инвентара")

    await exports.bookIsPurchased(userId,bookId)

    user.inventory.freeBook--

        user.markModified("inventory")
    if (user.isModified("inventory")) {
    }


    return user.save()
}
exports.writeReview = async (bookId,userId,stars,text)=>{
    const book = await models.bookModel.findById(bookId)
    const user = await models.userModel.findById(userId)

    if(!exports.isBookOwnedByUser(book,userId)&&user.role!=="admin") throw new Error("Не притежавате книгата")

    if(!book.toObject().hasOwnProperty("reviews")) book.reviews = []

    if(book.reviews.some((review)=>review.writtenBy.equals(userId))) throw new Error("Вече сте оценили книгата")

    book.reviews.push({
        stars,
        text,
        writtenBy:userId
    })
    const rationPoints = book.reviews.map(review=>review.stars).reduce((acc,curr)=>acc+=curr,0)
    book.rating = Math.ceil(rationPoints/book.reviews.length)

    return book.save()
}

exports.addOrRemoveFromWishlist =async (bookId,userId) =>{
    const book = await models.bookModel.findById(bookId)
    let isWishedByUser
    if(book.wishedBy.includes(userId)){
        const index = book.wishedBy.indexOf(userId)
        book.wishedBy.splice(index,1)
        isWishedByUser = false
    }else{
        book.wishedBy.push(userId)
        isWishedByUser = true
    }
    await book.save()
    return isWishedByUser
}

exports.likeOrDislikeFeedback =async (bookId,reviewId,userId) =>{
    const book = await models.bookModel.findById(bookId)
    const review = book.reviews.find((review)=>review._id.equals(reviewId))

    let isLikedByUser

    if(!review.likedBy) review.likedBy = []

    if(review.likedBy.includes(userId)){
        const index = review.likedBy.indexOf(userId)
        review.likedBy.splice(index,1)
        isLikedByUser = false
    }else{
        review.likedBy.push(userId)
        isLikedByUser = true
    }
    await book.save()

    return isLikedByUser
}

async function getSimilarBooks(book){
    const genre = book.genre
    return (await models.bookModel.find({genre}).limit(10)).map(book=>
    {
        book = book.toObject()
        delete book.chapters
        return book
    })
}
exports.isBookOwnedByUser = (book,userId)=>{
    return book.ownedBy.some(id=>id.toString()===userId.toString())
}





exports.getAllBooks =async(userId)=>{
    const books =await models.bookModel.find()
    const payload =[]
    for (let book of books) {
        book = book.toObject()
        book.isBookOwnedByUser = exports.isBookOwnedByUser(book,userId)
        delete book.ownedBy
        payload.push(book)
    }
   return  payload

}
exports.editBook =async(bookId,bookData,userId)=>{
   await isAdmin(null,userId)
   let book = await models.bookModel.findById(bookId)
    for (const object of Object.entries(bookData)) {
        book[object[0]] = object[1]
    }
   return book.save()
}
exports.bookIsPurchased =async (userId,bookId)=>{
    const book = await models.bookModel.findById(bookId)
    if(!book.ownedBy.some((id)=>id.equals(userId))){
        book.ownedBy.push(userId)
    }
    return book.save()
}
exports.deleteBook =async(bookId,userId)=>{
   await isAdmin(null,userId)
   await deleteBookChapters(bookId)
    const book = await models.bookModel.findById(bookId)
    await deleteProduct(book.stripeProductId)
   return models.bookModel.findByIdAndDelete(bookId)
}
async function deleteBookChapters(bookId){
    const chapters = await models.chapterModel.find({bookId})
    for (const chapter of chapters) {
        console.log(chapter)
        await chapter.delete()
    }
}
    exports.uploadFile =async (bucketName,image) => {
        if (!image) throw new Error("Няма избрана снимка за качване");

        const allowedExtensions = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
        };
        const  fileExtension = allowedExtensions[image.mimetype]
        if(!fileExtension) throw new Error("Типа на снимката трябва да е jpg или png")

        // @ts-ignore
        const imageRef = ref(storage, `${bucketName}/${image.originalname + v4()}.${fileExtension}`);
        const snapshot = await uploadBytes(imageRef, image.buffer)
        const url = await getDownloadURL(snapshot.ref)
        return url
    };
exports.addImageToBook =async(bookId,userId,image)=>{
   await isAdmin(null,userId)

    const imageUrl = await exports.uploadFile("images",image)

    const book = await models.bookModel.findById(bookId)
    book.image = imageUrl
   return book.save()
}
exports.getFilteringData =async(userId)=>{
    const authors = new Set()
    const genres =new Set()
    const books = await models.bookModel.find({})
    for (const book of books) {
        authors.add(book.author)
        genres.add(book.genre)
    }
    return {
        authors:[...authors],
        genres:[...genres]
    }
}
exports.createBook =async(bookData,userId)=>{
   await isAdmin(null,userId)
    const book =  await models.bookModel.create(
       {
           ...bookData,
           ownedBy:[],
           chapters:[],
           length:0,
       }
       )

    await createBookStripeProduct(book)
    return book
}