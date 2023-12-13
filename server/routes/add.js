import express from 'express';
import db from '../models/index.js';
import { ValidationError } from '../error.js';
const router = express.Router();
const sequelize = db.sequelize;

router.post('/', async (req, res) => {
  const Policyholder = db.Policyholder;
  try {
    if (!req.body['code'] || !req.body['name'] || !req.body['registration_date']) {
      throw new ValidationError('Missing required field');
    }

    const code = req.body['code'];
    const name = req.body['name'];
    const registration_date = req.body['registration_date'];
    const introducer_code = req.body['introducer_code'];

    let newPolicyholder;

    if (!introducer_code) {
      // just add without introducer
      newPolicyholder = await Policyholder.create({
        code: code,
        name: name,
        registration_date: registration_date,
        depth: 1,
      });

    } else {
      const introducer = await Policyholder.findOne({ where: { code: introducer_code } });
      if (!introducer) {
        //return res.status(404).json({ message: 'Introducer not found' });
        throw new ValidationError('Introducer not found');
      }

      // find position for new holder
      const position = await findNewPosition(introducer);

      // create holder
      newPolicyholder = await Policyholder.create({
        code: code,
        name: name,
        registration_date: registration_date,
        introducer_code: introducer_code,
        depth: position.depth + 1,
        parent_id: position.parentId
      });

      // update introducer's child
      if (position.side === 'left') {
        await Policyholder.update({ lchild_id: newPolicyholder.id }, { where: { id: position.parentId } });
      } else {
        await Policyholder.update({ rchild_id: newPolicyholder.id }, { where: { id: position.parentId } });
      }
    }



    res.status(201).json({ message: 'policyholder added', data: newPolicyholder });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        message: error.message,
      });
    } else {
      console.error('Error adding new policyholder:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

async function findNewPosition(introducer) {
  const maxDepth = introducer.depth + 9;
  let queue = [introducer];

  while (queue.length > 0) {
    let currentNode = queue.shift();

    if (!currentNode.lchild_id || !currentNode.rchild_id) {
      return {
        parentId: currentNode.id,
        side: !currentNode.lchild_id ? 'left' : 'right',
        depth: currentNode.depth
      };
    }

    if (currentNode.depth < maxDepth) {
      const children = await sequelize.query(`
        SELECT id, depth, lchild_id, rchild_id 
        FROM Policyholders 
        WHERE parent_id = :parentId
      `, {
        replacements: { parentId: currentNode.id },
        type: sequelize.QueryTypes.SELECT
      });

      queue.push(...children); // push all children to the queue
    }
  }

  throw new Error('No available position found');
}


export default router;
