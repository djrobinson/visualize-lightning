import { LightningNode as LightningNodeType, NodeAddress } from '@radar/lnrpc';
import { NextFunction, Request, Response } from 'express';
import ChannelEdge from '../../objects/ChannelEdge';
import LightningNode from '../../objects/LightningNode';
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
  private ipRegex: RegExp = /((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/g;

  /**
   * @class GraphRoute
   * @constructor
   */
  private constructor() {
    super();
    this.ips = this.ips.bind(this);
    this.init();
  }

  private init() {
    logger.info('[NetworkRoute] Creating network route.');
    this.router.get('/ips', this.ips);
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
      const edges = await LightningNode.getNodesAndEdgesIpsIpOnly();
      res.json({ edges });
    } catch (err) {
      res.status(400).json({ error: err });
    }
    next();
  }
}
