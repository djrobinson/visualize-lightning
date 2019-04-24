import { LightningNode as LightningNodeType, NodeAddress } from '@radar/lnrpc';
import { NextFunction, Request, Response } from 'express';
import ChannelEdge from '../../objects/ChannelEdge';
import LightningNode from '../../objects/LightningNode';
import RoutingPolicy from '../../objects/RoutingPolicy';
import { logger } from '../../services';
import { BaseRoute } from '../route';

/**
 * @api {get} /networkmap NetworkMap Request
 * @apiName NetworkMap
 * @apiGroup NetworkMap
 *
 * @apiSuccess 200
 */
export class NetworkMapRoute extends BaseRoute {
  public static path: string = '/networkmap';
  private static instance: NetworkMapRoute;

  /**
   * @class GraphRoute
   * @constructor
   */
  private constructor() {
    super();
    this.ips = this.ips.bind(this);
    this.activeChannels = this.activeChannels.bind(this);
    this.init();
  }

  private init() {
    logger.info('[NetworkRoute] Creating network route.');
    this.router.get('/ips', this.ips);
    this.router.get('/northpole', this.northPole);
    this.router.post('/arcs', this.activeChannels);
    this.router.post('/policy', this.getChannelPolicy);
  }

  static get router() {
    if (!NetworkMapRoute.instance) {
      NetworkMapRoute.instance = new NetworkMapRoute();
    }
    return NetworkMapRoute.instance.router;
  }

  /**
   * Returns prestructured network from the point of
   * @method get
   * @param req {Request}
   * @param res {Response}
   * @param next {NextFunction}
   */
  public async ips(req: Request, res: Response, next: NextFunction) {
    try {
      const nodes = await LightningNode.getNodesIpOnly();
      res.json({ nodes });
    } catch (err) {
      res.status(400).json({ error: err });
    }
    next();
  }

  public async northPole(req: Request, res: Response, next: NextFunction) {
    try {
      const nodes = await LightningNode.getNorthPoleNodes();
      res.json({ nodes });
    } catch (err) {
      res.status(400).json({ error: err });
    }
    next();
  }

  public async activeChannels(req: Request, res: Response, next: NextFunction) {
    try {
      const publicKey = req.body.publicKey;
      const mapChannels = await ChannelEdge.getActiveArcs(publicKey);
      res.json({ mapChannels });
    } catch (err) {
      res.status(400).json({ error: err });
    }
    next();
  }

  public async getChannelPolicy(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const publicKey = req.body.publicKey;
      const channelId = req.body.channelId;
      const policy = await RoutingPolicy.getByChannelAndPubKey(
        channelId,
        publicKey,
      );
      res.json({ policy });
    } catch (err) {
      res.status(400).json({ error: err });
    }
    next();
  }
}
