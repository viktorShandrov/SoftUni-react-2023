
const models = require("../models/allModels")
const utils = require("../utils/utils")
const {isOwnedByUser, isAdmin} = require("../managerUtils/managerUtil");
const allModels = require("../models/allModels");
// Change this line to use dynamic import
import('random-words')
    .then(async (randomWordsModule )=>{
        const randomWords = randomWordsModule.default;

        exports.generateTest =async(userId,testType,chapterId)=>{
            if(testType === utils.testTypes.randomWords){
                //12 words
                return randomWords.generate(12)

            }else if(testType === utils.testTypes.textWords){
                //12 words from text
                const chapter = await allModels.chapterModel.findById(chapterId)
                const splitedChapter = chapter.split(/\s+/);

                const filteredWords = splitedChapter.filter(word => !utils.commonWords.includes(word.toLowerCase()));

                function getRandomWord(wordsArray) {
                    const randomIndex = Math.floor(Math.random() * wordsArray.length);
                    return wordsArray[randomIndex];
                }
                const testWords = []

                for (let i = 1; i < 12; i++) {
                    testWords.push(getRandomWord(filteredWords))
                }

                return testWords
            }if(testType === utils.testTypes.textQuestions){
                // 3 questions from the text
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });


exports.getAllWords =async(userId)=>{
   return  models.wordModel.find({unknownBy:userId})
}

exports.deleteWord =async(wordId,userId)=>{
    await isOwnedByUser(userId,wordId,models.wordModel,"unknownBy")
   return models.bookModel.findByIdAndDelete(wordId)
}
exports.createWords =async(words,userId)=>{
    const fetch = await import("node-fetch")
    for (const word of words) {
        const wordRecord = await allModels.wordModel.findOne({word})
        if(wordRecord){
            wordRecord.unknownFor.push(userId)
            await wordRecord.save()
        }else{


            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: word,
                    source: 'en',
                    target: 'bg',
                    format: 'text',
                }),
            };

                const response = await fetch.default(`https://translation.googleapis.com/language/translate/v2?key=${utils.GoogleTranslateAPI_KEY}`, requestOptions);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                const translatedText = data.data.translations[0].translatedText;


            await models.wordModel.create(
                {
                    unknownFor:[userId],
                    word,
                    translatedText
                }
            )
        }

    }







}

