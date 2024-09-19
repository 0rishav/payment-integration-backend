import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter the content title"],
    },
    description: {
        type: String,
        required: [true, "Please enter the content description"],
    },
    type: {
        type: String,
        enum: ['Free', 'Intermediate', 'Advanced'],
        required: [true, "Please specify the content type"],
    },
    content: {
        type: String,
        required: [true, "Please enter the content"],
    },
}, { timestamps: true });

const ContentModel = mongoose.model('Content', contentSchema);

export default ContentModel;
