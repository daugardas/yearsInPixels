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
                    required: true,
                },
                emotionValue: [{
                    mood: {
                        type: Number,
                        required: true,
                    },
                    moodPercentage: {
                        type: Number,
                        required: true,
                    }
                }]
        }
    }]
});

let Emotion = mongoose.model('Emotion', EmotionSchema);
module.exports = Emotion;