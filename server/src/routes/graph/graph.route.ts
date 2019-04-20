import { LightningNode as LightningNodeType } from '@radar/lnrpc';
import { NextFunction, Request, Response } from 'express';
import ChannelEdge from '../../objects/ChannelEdge';
import LightningNode from '../../objects/LightningNode';
import { logger } from '../../services';
import { IpStack } from '../../services/ipstack';
import { Lightning } from '../../services/lnd';
import { BaseRoute } from '../route';

/**
 * @api {get} /graph Graph Request
 * @api {post} /graph/pay Pay Graph Request
 * @apiName Graph
 * @apiGroup Graph
 *
 * @apiSuccess 200
 */
export class GraphRoute extends BaseRoute {
  public static path = '/graph';
  private static instance: GraphRoute;

  /**
   * @class GraphRoute
   * @constructor
   */
  private constructor() {
    super();
    this.describe = this.describe.bind(this);
    this.init();
  }

  private init() {
    logger.info('[GraphRoute] Creating graph route.');
    this.router.get('/describe', this.describe);
  }

  static get router() {
    if (!GraphRoute.instance) {
      GraphRoute.instance = new GraphRoute();
    }
    return GraphRoute.instance.router;
  }

  /**
   * Returns description of latest graph state
   * @class GraphRoute
   * @method get
   * @param req {Request}
   * @param res {Response}
   * @param next {NextFunction}
   */
  private async describe(req: Request, res: Response, next: NextFunction) {
    try {
      const { nodes, edges } = await Lightning.client.describeGraph();
      logger.info(`[GraphRoute] Graph node count: ${nodes.length}.`);
      logger.info(`[GraphRoute] Graph edge count: ${edges.length}.`);

      const geoNodes = this.locateIpAddresses(nodes);

      // TODO: CONVERT TO A BULK UPDATE IF TIME ALLOWS. map instead of forEach, insert all via static method on obj
      nodes.forEach(node => {
        const nodeInstance = new LightningNode();
        nodeInstance.publicKey = node.pubKey;
        nodeInstance.ipAddress = node.addresses ? node.addresses[0].addr : null;
        nodeInstance.network = node.addresses
          ? node.addresses[0].network
          : null;
        nodeInstance.alias = node.alias;
        // nodeInstance.insertIntoDb();
      });

      edges.forEach(edge => {
        const edgeInstance = new ChannelEdge();
        edgeInstance.channelId = edge.channelId;
        edgeInstance.channelPoint = edge.chanPoint;
        edgeInstance.capacity = edge.capacity;
        edgeInstance.lastUpdate = edge.lastUpdate;
        edgeInstance.node1Pub = edge.node1Pub;
        edgeInstance.node2Pub = edge.node2Pub;
        // edgeInstance.insertIntoDb();
      });

      res.json({ nodes, edges });
    } catch (err) {
      res.status(400).json({ error: err });
    }
    next();
  }

  private async locateIpAddresses(nodes: LightningNodeType[]) {
    const ipAddressNodes = nodes.filter(node => !!node.addresses);
    IpStack.getSingleIpLocation(
      ipAddressNodes[0].addresses[0].addr.replace(':9735', ''),
    ).then(res => {
      console.log('What are results', res.data);
    });
  }
}
