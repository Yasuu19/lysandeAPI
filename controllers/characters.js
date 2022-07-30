/* Logique métier */
import Character from '../models/character.js';

const formatPosition = (character) => {
    return (character.x && character.y && character.map && character.group)?
    {
        coordinates : {
            x : character.x,
            y : character.y
        },
        map : character.map,
        group : character.group
    } : undefined;
}

export async function createCharacter (req, res) {
    console.log("Création du personnage en cours...");
    if (Object.keys(req.body).length){
        const character = new Character({
            player : req.body.player,
            name : req.body.name,
            race : req.body.race,
            job : req.body.job,
            level : req.body.level,
            img : 'https://nnsprod.com/naheulbeuk/images/gob.png',
            culte : req.body.culte,
            x : (req.body.positions && req.body.positions.coordinates) ? req.body.positions.coordinates.x : undefined,
            y : (req.body.positions && req.body.positions.coordinates) ? req.body.positions.coordinates.y : undefined,
            map : req.body.positions ? req.body.positions.map : undefined,
            group : req.body.positions ? req.body.positions.group : undefined,
            quest : req.body.quest,
            story : req.body.story,
            moral : req.body.alignment ? req.body.alignment.moral : undefined,
            law : req.body.alignment ? req.body.alignment.law : undefined,
            gold : req.body.gold,
        });
        try {
            const newCharacter = await character.save();
            res.status(201).json(newCharacter);
        } catch (err) {
                console.log(`{${err}}`)
                res.status(400).json(`Error when creating a new character ${err}`);
        }
    }
    else {
        res.status(400).json(`Body is required`);
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
        res.status(200).json(characters.map(el => {
            return ({
                id : el._id,
                player : el.player, 
                name : el.name,
                race : el.race,
                job : el.job,
                level : el.level,
                img : el.img,
                culte : el.culte,
                positions : formatPosition(el),
                quest : el.quest,
                story : el.story,
                alignment : {
                    moral : el.moral,
                    law : el.law
                },
                gold : el.gold,
            })
        }));
    } catch (err) {
        console.log(`{${err}}`)
        res.status(400).json(`${err}`);
    }
}


export const getCharacterById = async (req, res) => {
    try {
        //Cherche dans le model Character le character correspondants aux critères entrés dans find
        const character = await Character.findOne({_id : req.params.id});
        res.status(200).json({
            id : character._id,
            player : character.player, 
            name : character.name,
            race : character.race,
            job : character.job,
            level : character.level,
            img : character.img,
            culte : character.culte,
            positions : formatPosition(character),
            quest : character.quest,
            story : character.story,
            alignment : {
                moral : character.moral,
                law : character.law
            },
            gold : character.gold,
        });
    } catch (err) {
        console.log(`{${err}}`)
        res.status(404).json(`${err}`);
    }
}