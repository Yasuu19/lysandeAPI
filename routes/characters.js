/* Le dossier s'apelle routes car c'est ce qui est utilisé mais c'est le controller (MVC) */

import express  from 'express';
import {createCharacter} from '../controllers/characters.js'
import {modifyCharacter} from '../controllers/characters.js'
import {deleteCharacter} from '../controllers/characters.js'
import {getAllCharacters} from '../controllers/characters.js'
//import {getCharacter} from '../controllers/characters.js'
import bodyParser from 'body-parser'
import Character from '../models/character.js';


const router = express.Router(); 


/*POST en premier car GET intercepte tous les / car pas de verbe spécifique */

//Create Player Route
//For creating the character
router.post('/',  createCharacter);

//Update character Route
router.put('/:id', modifyCharacter);

//Delete specific character Route
router.delete('/:id', deleteCharacter);

//All characters Route
router.get('/', getAllCharacters);

//Get specific character Route
router.get('/:id', async function (req, res) {
        try {
            //Cherche dans le model Character le character correspondants aux critères entrés dans find
            const characters = await Character.findOne({_id : req.params.id});
            res.status(200).json({characters : characters});
        } catch (err) {
            console.log(`{${err}}`)
            res.status(404).json(`${err}`);
        }
    });
// Si on exporte pas les routes, le server ne peut pas les utiliser !*/

export default router;