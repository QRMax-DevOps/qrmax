const express = require('express');
const router = express.Router();
const {
  putDisplay,
  postDisplay,
  patchDisplay,
  deleteDisplay
} = require('../controllers/displayController');
const { protect } = require('../middleware/authStoreMiddleware');

router.put('/', protect, putDisplay); //done
router.post('/', protect, postDisplay); //done
router.patch('/', protect, patchDisplay); //done
router.delete('/', protect, deleteDisplay); //done

/*Media
router.put('/Media', protect, putDisplayMedia);
router.post('/Media', protect, postDisplayMedia);
router.patch('/Media', protect, patchDisplayMedia);
router.delete('/Media', protect, deleteDisplayMedia);
*/

  /*Media/File
  router.post('/Media/File', protect, postDisplayMediaFile);
  */

  /*Media/Listen
  router.post('/Media/Listen', protect, postDisplayMediaListen);
  */

  /*Media/Refresh
  router.post('/Media/Refresh', protect, postDisplayMediaRefresh);
  */

  /*Media/Positions
  router.put('/Media/Positions', protect, putDisplayMediaPositions);
  router.post('/Media/Positions', protect, postDisplayMediaPositions);
  router.patch('/Media/Positions', protect, patchDisplayMediaPositions);
  router.delete('/Media/Positions', protect, deleteDisplayMediaPositions);
  */

  /*Media/BaseMedia
  router.put('/Media/BaseMedia', protect, putDisplayMediaBaseMedia);
  router.post('/Media/BaseMedia', protect, postDisplayMediaBaseMedia);
  */

/*Settings
router.put('/Settings', protect, putDisplaySettings);
router.patch('/Settings', protect, patchDisplaySettings);
*/

/*Interactions
router.post('/Interactions', protect, postDisplayInteractions);
*/

module.exports = router;
