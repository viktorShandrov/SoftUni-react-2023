const models = require("../models/allModels")
const {isOwnedByUser, isAdmin} = require("../managerUtils/managerUtil");

exports.getChapter =async(chapterId,userId)=>{
   return  models.chapterModel.findById(chapterId)

}
exports.editChapter =async(chapterId,bookId,text,userId)=>{
   await isAdmin(null,userId)
   const chapter = await models.chapterModel.findById(chapterId)
   chapter.bookId = bookId
   chapter.text = text
   return chapter.save()
}
exports.deleteChapter =async(chapterId,userId)=>{
   await isAdmin(null,userId)
    const chapter = await models.chapterModel.findById(chapterId)
    const book = await models.bookModel.findById(chapter.book)
    book.chapters.splice(book.chapters.findIndex(el=>el.equals(chapter._id)),1)
    await book.save()
   return models.chapterModel.findByIdAndDelete(chapterId)
}
exports.createChapter =async(bookId,text,userId)=>{
   await isAdmin(null,userId)
   const chapter = await models.chapterModel.create(
       {
          book:bookId,
          text,
       }
       )
   const book = await models.bookModel.findById(bookId)
   book.chapters.push(chapter._id)
   return book.save()
}