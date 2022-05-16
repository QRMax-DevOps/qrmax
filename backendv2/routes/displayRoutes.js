const express = require('express');
const router = express.Router();
const {
  putDisplay,
  postDisplay,
  patchDisplay,
  deleteDisplay,
  putDisplayMedia,
  postDisplayMedia,
  patchDisplayMedia,
  deleteDisplayMedia,
  postDisplayMediaFile,
  postDisplaySettings,
  patchDisplaySettings,
  postDisplayMediaRefresh,
  putDisplayMediaBaseMedia,
  postDisplayMediaBaseMedia,
  postDisplayMediaListen,
} = require('../controllers/displayController');
const { protect } = require('../middleware/authStoreMiddleware');

router.put('/', protect, putDisplay); //done
router.post('/', protect, postDisplay); //done
router.patch('/', protect, patchDisplay); //done
router.delete('/', protect, deleteDisplay); //done

//Media
router.put('/Media', protect, putDisplayMedia); //done
router.post('/Media', protect, postDisplayMedia); //done
router.patch('/Media', protect, patchDisplayMedia); //done
router.delete('/Media', protect, deleteDisplayMedia); //done

  //Media/File
  router.post('/Media/File', protect, postDisplayMediaFile); //done

  //Media/Listen
  router.post('/Media/Listen', protect, postDisplayMediaListen);

  //Media/Refresh
  router.post('/Media/Refresh', protect, postDisplayMediaRefresh); //done

  /*Media/Positions
  router.put('/Media/Positions', protect, putDisplayMediaPositions);
  router.post('/Media/Positions', protect, postDisplayMediaPositions);
  router.patch('/Media/Positions', protect, patchDisplayMediaPositions);
  router.delete('/Media/Positions', protect, deleteDisplayMediaPositions);
  */

  //Media/BaseMedia
  router.put('/Media/BaseMedia', protect, putDisplayMediaBaseMedia); //done
  router.post('/Media/BaseMedia', protect, postDisplayMediaBaseMedia); //done

//Settings
router.post('/Settings', protect, postDisplaySettings); //done
router.patch('/Settings', protect, patchDisplaySettings); //done

/*Interactions
router.post('/Interactions', protect, postDisplayInteractions);
*/

module.exports = router;
