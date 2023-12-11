import express from 'express';
import db from '../models/index.js';
import { ValidationError, NotFoundError } from '../error.js';
const router = express.Router();
const sequelize = db.sequelize;
const DATA_DEPTH = 4;

router.get('/', async (req, res) => {
  const code = req.query.code;
  try {
    if (!code) {
      throw new ValidationError('Missing required field');
    }

    const mainNodes = await sequelize.query(`
      SELECT id, code, name, registration_date, introducer_code, depth, lchild_id, rchild_id
      FROM Policyholders
      WHERE code = :code
    `, {
      replacements: { code: code },
      type: sequelize.QueryTypes.SELECT
    });


    if (!mainNodes) {
      throw new NotFoundError('Policyholder not found');
    }

    const mainNode = mainNodes[0];
    const treeNodes = await findHolders(mainNode);

    res.json(prepareTreeSimple(treeNodes, mainNode.id));
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        message: error.message,
      });
    } else if (error instanceof NotFoundError) {
      return res.status(404).json({
        message: error.message,
      });
    } else {
      console.error('Error finding policyholders:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

//Endpoint： /api/policyholders/{code}/top
router.get('/:code/top', async (req, res) => {
  const code = req.params.code;
  try {
    if (!code) {
      throw new ValidationError('Missing required field');
    }

    const mainNodes = await sequelize.query(`
      SELECT id, code, name, registration_date, introducer_code, depth, lchild_id, rchild_id
      FROM Policyholders
      WHERE id = ( SELECT parent_id FROM Policyholders WHERE code = :code )
    `, {
      replacements: { code: code },
      type: sequelize.QueryTypes.SELECT
    });


    if (!mainNodes) {
      throw new NotFoundError('Policyholder not found');
    }

    const mainNode = mainNodes[0];
    const treeNodes = await findHolders(mainNode);

    res.json(prepareTreeSimple(treeNodes, mainNode.id));
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        message: error.message,
      });
    } else if (error instanceof NotFoundError) {
      return res.status(404).json({
        message: error.message,
      });
    } else {
      console.error('Error finding policyholders:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});


async function findHolders(mainNode) {
  const originDepth = mainNode.depth;
  let currentDepth = originDepth;
  const maxDepth = currentDepth + DATA_DEPTH;
  let treeNodes = {
    [currentDepth - originDepth]: {
      [mainNode.id]: mainNode
    }
  };
  let parentIds = [];
  parentIds.push(mainNode.id)
  currentDepth++;

  while (currentDepth < maxDepth) {
    let nodes = await sequelize.query(`
      SELECT id, code, name, registration_date, introducer_code, depth, lchild_id, rchild_id
      FROM Policyholders
      WHERE depth = :currentDepth AND parent_id IN (:parentIds)
      `, {
      replacements: { currentDepth: currentDepth, parentIds: parentIds },
      type: sequelize.QueryTypes.SELECT
    });

    treeNodes[currentDepth - originDepth] = {}; // make a obj to save currentDepth's node
    for (let i = 0; i < nodes.length; i++) {
      treeNodes[currentDepth - originDepth][nodes[i].id] = nodes[i];
    }

    parentIds = []; // clear parentIds for saving currentDepth's child ids
    nodes.map(node => {
      parentIds.push(node.id);
    })

    currentDepth++;
  }

  return treeNodes ;
}

function prepareTreeSimple(treeNodes, mainNodeId) {
  const mainNode = treeNodes[0][mainNodeId];
  let treeSimple = {
    "code": mainNode.code,
    "name": mainNode.name,
    "registration_date": mainNode.registration_date,
    "introducer_code": mainNode.introducer_code,
    "l": null,
    "r": null,
  };

  if (treeNodes[1] === undefined) {
    return treeSimple;
  }

  if (mainNode.lchild_id !== null) {
    treeSimple.l = collectChildsSimple(treeNodes, mainNode.lchild_id, 1);
  }
  if (mainNode.rchild_id !== null) {
    treeSimple.r = collectChildsSimple(treeNodes, mainNode.rchild_id, 1);
  }

  return treeSimple;
}

function collectChildsSimple(treeNodes, childId, depth) {  // collect childs in array 
  if (depth < DATA_DEPTH) {
    const childNode = treeNodes[depth][childId];
    let childs = [];
    let child = {
      "code": childNode.code,
      "name": childNode.name,
      "registration_date": childNode.registration_date,
      "introducer_code": childNode.introducer_code,
    };
    childs.push(child);
    if (childNode.lchild_id !== null) {
      childs = childs.concat(collectChildsSimple(treeNodes, childNode.lchild_id, depth + 1));
    }
    if (childNode.rchild_id !== null) {
      childs = childs.concat(collectChildsSimple(treeNodes, childNode.rchild_id, depth + 1));
    }
    return childs;
  } else {
    return [];
  }
}

export default router;
