//Librairie qui permet de se connecter à la BDD Mongo DB
import mongoose from 'mongoose';

//Same as table in NoSQL DB
const characterSchema = new mongoose.Schema ({
    name : {
        type : String,
        required : true
    },
    img : {
        type : String,
        required : true
    },
    level : {
        type : Number,
        required : true
    }
})
//Character is the name of the table in DB
export default mongoose.model('Character', characterSchema)

