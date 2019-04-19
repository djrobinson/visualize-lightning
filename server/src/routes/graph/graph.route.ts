import { NextFunction, Request, Response } from 'express';
import { logger } from '../../services';
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
      logger.info(`[GraphRoute] Graph returned: ${nodes}.`);
      res.json({ nodes, edges });
    } catch (err) {
      res.status(400).json({ error: err });
    }
    next();
  }
}
