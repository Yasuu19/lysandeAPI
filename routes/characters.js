/* Le dossier s'apelle routes car c'est ce qui est utilisé mais c'est le controller (MVC) */

import express  from 'express';
import {createCharacter, modifyCharacter, deleteCharacter, getAllCharacters, getCharacterById} from '../controllers/characters.js'
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
router.get('/:id', getCharacterById);

// Si on exporte pas les routes, le server ne peut pas les utiliser !*/
export default router;