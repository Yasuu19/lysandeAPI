/* Logique métier */
import Character from '../models/character.js';

export async function createCharacter (req, res) {
    console.log("Création du personnage en cours...");
        const character = new Character({
            player : req.body.player,
            name : req.body.name,
            race : req.body.race,
            job : req.body.job,
            level : req.body.level,
            img : req.body.img,
            culte : req.body.culte,
            x : req.body.x,
            y : req.body.y,
            map : req.body.map,
            group : req.body.group,
            quest : req.body.quest,
            story : req.body.story,
            moral : req.body.moral,
            law : req.body.law,
            gold : req.body.gold,
        });
        try {
            const newCharacter = await character.save();
            res.status(201).json({ message : `Character ${character.name} created` });
        } catch (err) {
                console.log(`{${err}}`)
                res.status(400).json(`Error when creating a new character ${err}`);
        }

};

// NE MARCHE PAS
export async function modifyCharacter (req, res) {
    async (req, res) => {
        try {
            //1st arg find the object on id, and 2nd arg correspond Second arg correspond to new object version
            await Character.updateOne({_id : req.params.id }, { name : req.body.name, _id : req.params.id})
            res.status(200).json({message : "Character updated"} );
        }
        catch (err) {
            console.log(`{${err}}`)
            res.status(400).json(`${err}`);
        }
    }
}

export  async function deleteCharacter (req, res) {
    try {
        await Character.deleteOne({ _id : req.params.id});
        res.status(200).json({ message : "Character deleted"});
    }
    catch(err) {
        res.status(400).json({err});
    }
}

export const getAllCharacters = async (req, res) => {
    try {
        //Send back all characters find in the DB
        const characters = await Character.find({});
        res.status(200).json({characters : characters});
    } catch (err) {
        console.log(`{${err}}`)
        res.status(400).json(`${err}`);
        //.redirect('/');
    }
}

// NE MARCHE PAS

//export async function getCharacter{{
//    }
//}