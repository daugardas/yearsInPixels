const mongoose = require(`mongoose`);

const EmotionSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    emotions: [{
            emotion:{
                emotionDate: {
                    type: String,
                },
                emotionValue: Number,
        }
    }]
});

let Emotion = mongoose.model('Emotion', EmotionSchema);
module.exports = Emotion;