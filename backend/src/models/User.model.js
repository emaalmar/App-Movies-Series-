import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true,
<<<<<<< HEAD
    }
=======
    },
/*     avatar:{
        type: File,
        default: null
    },
    number:{
        type: Number,
        default: null
    } */
>>>>>>> entrega-inicial
}, {
    timestamps: true
}
)

export default mongoose.model("User", userSchema);