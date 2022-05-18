/* Le dossier s'apelle routes car c'est ce qui est utilisé mais c'est le controller (MVC) */

import express  from 'express';
import Character from '../models/character.js';
import bodyParser from 'body-parser'

const router = express.Router(); 


/*POST en premier car GET intercepte tous les / car pas de verbe spécifique */

//Create Player Route
//For creating the character
router.post('/', async (req, res) => {
    const character = new Character({
        name : req.body.name,
        img : req.body.img,
        level : req.body.level
    });
    try {
        const newCharacter = await character.save();
        res.status(201).json({ message : `Character ${character.name} created` });
    } 
    //Executed code when an error is catched
    catch (err) {
        console.log(`{${err}}`)
        res.status(400).json(`Error when creating a new character ${err}`);
    }
});

//Update character Route
router.put('/:id', async (req, res) => {
    try {
        //1st arg find the object on id, and 2nd arg correspond Second arg correspond to new object version
        await Character.updateOne({_id : req.params.id }, { name : req.body.name, _id : req.params.id})
        res.status(200).json({message : "Character updated"} );
    }
    catch (err) {
        console.log(`{${err}}`)
        res.status(400).json(`${err}`);
    }
});

//Delete specific character Route
router.delete('/:id', async (req, res) =>{
    try {
        await Character.deleteOne({ _id : req.params.id});
        res.status(200).json({ message : "Character deleted"});
    }
    catch(err) {
        res.status(400).json({err});
    }
} );

//All characters Route
router.get('/', async (req, res) => {
    try {
        //Send back all characters find in the DB
        const characters = await Character.find({});
        res.status(200).json({characters : characters});
    } catch (err) {
        console.log(`{${err}}`)
        res.status(400).json(`${err}`);
        //.redirect('/');
    }
});

//Get specific character Route
router.get('/:id', async (req, res) => {
    try {
        //Cherche dans le model Charcter le character correspondants aux critères entrés dans find
        const characters = await Character.findOne({_id : req.params.id});
        res.status(200).json({characters : characters});
    } catch (err) {
        console.log(`{${err}}`)
        res.status(404).json(`${err}`);
    }
});
// Si on exporte pas les routes, le server ne peut pas les utiliser !*/

export default router;