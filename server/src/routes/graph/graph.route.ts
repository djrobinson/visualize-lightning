import { LightningNode as LightningNodeType, NodeAddress } from '@radar/lnrpc';
import { NextFunction, Request, Response } from 'express';
import ChannelEdge from '../../objects/ChannelEdge';
import IpGeoLookup from '../../objects/IpGeoLookup';
import LightningNode from '../../objects/LightningNode';
import RoutingPolicy from '../../objects/RoutingPolicy';
import { logger } from '../../services';
import { IpStack } from '../../services/ipstack';
import { Lightning } from '../../services/lnd';
import { BaseRoute } from '../route';

/**
 * @api {get} /graph Graph Request
 * @apiName Graph
 * @apiGroup Graph
 *
 * @apiSuccess 200
 */
export class GraphRoute extends BaseRoute {
  public static path: string = '/graph';
  private static instance: GraphRoute;
  private ipv6Regex: RegExp = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/g;
  private ipv4Regex: RegExp = /((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/g;

  private ignoredIps = ['0.0.0.0', '127.0.0.1', 'X.X.X.X'];

  /**
   * @class GraphRoute
   * @constructor
   */
  private constructor() {
    super();
    this.describe = this.describe.bind(this);
    this.locateIpAddresses = this.locateIpAddresses.bind(this);
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
  public async describe(req: Request, res: Response, next: NextFunction) {
    try {
      const { nodes, edges } = await Lightning.client.describeGraph();
      logger.info(`[GraphRoute] Graph node count: ${nodes.length}.`);
      logger.info(`[GraphRoute] Graph edge count: ${edges.length}.`);

      const geoNodes = await this.locateIpAddresses(nodes);

      geoNodes.forEach((geoRes: any) => {
        const geo = geoRes.data;
        const ipGeoInstance = new IpGeoLookup();
        ipGeoInstance.ip = geo['ip'];
        ipGeoInstance.type = geo['type'];
        ipGeoInstance.continentCode = geo['continent_code'];
        ipGeoInstance.continentName = geo['continent_name'];
        ipGeoInstance.countryCode = geo['country_code'];
        ipGeoInstance.countryName = geo['country_name'];
        ipGeoInstance.regionCode = geo['region_code'];
        ipGeoInstance.regionName = geo['region_name'];
        ipGeoInstance.city = geo['city'];
        ipGeoInstance.zip = geo['zip'];
        ipGeoInstance.latitude = geo['latitude'];
        ipGeoInstance.longitude = geo['longitude'];
        ipGeoInstance.countryFlag = geo['location']['country_flag'];
        ipGeoInstance.countryFlagEmoji = geo['location']['country_flag_emoji'];
        ipGeoInstance.upsertRecord();
      });

      // TODO: CONVERT TO A BULK UPDATE IF TIME ALLOWS. map instead of forEach, insert all via static method on obj
      nodes.forEach(node => {
        const nodeInstance = new LightningNode();
        nodeInstance.publicKey = node.pubKey;
        nodeInstance.ipAddress = node.addresses
          ? this.ipAddressHelper(node)
          : null;
        nodeInstance.alias = node.alias;
        nodeInstance.color = node.color;
        nodeInstance.upsertRecord();
      });

      edges.forEach(edge => {
        const edgeInstance = new ChannelEdge();
        edgeInstance.channelId = edge.channelId;
        edgeInstance.channelPoint = edge.chanPoint;
        edgeInstance.capacity = edge.capacity;
        edgeInstance.lastUpdate = edge.lastUpdate;
        edgeInstance.node1Pub = edge.node1Pub;
        edgeInstance.node2Pub = edge.node2Pub;
        edgeInstance.upsertRecord();
        const node1Policy = new RoutingPolicy();
        node1Policy.policyOwnerPublicKey = edge.node1Pub;
        if (edge.node1Policy) {
          node1Policy.policyId = `${edge.channelId}-${edge.node1Pub}`;
          node1Policy.timeLockDelta = edge.node1Policy.timeLockDelta || 0;
          node1Policy.minHtlc = edge.node1Policy.minHtlc;
          node1Policy.feeBaseMsat = edge.node1Policy.feeBaseMsat;
          node1Policy.feeRateMilliMsat = edge.node1Policy.feeRateMilliMsat;
          node1Policy.disabled = edge.node1Policy.disabled;
          node1Policy.upsertRecord();
        }
        const node2Policy = new RoutingPolicy();
        node2Policy.policyOwnerPublicKey = edge.node2Pub;
        if (edge.node2Policy) {
          node2Policy.policyId = `${edge.channelId}-${edge.node2Pub}`;
          node2Policy.timeLockDelta = edge.node2Policy.timeLockDelta || 0;
          node2Policy.minHtlc = edge.node2Policy.minHtlc;
          node2Policy.feeBaseMsat = edge.node2Policy.feeBaseMsat;
          node2Policy.feeRateMilliMsat = edge.node2Policy.feeRateMilliMsat;
          node2Policy.disabled = edge.node2Policy.disabled;
          node2Policy.upsertRecord();
        }
      });
      res.json({ nodes, edges });
    } catch (err) {
      res.status(400).json({ error: err });
    }
    next();
  }

  // TODO: GET THAT IP RES TYPE ARRAY RETURNING HERE
  private async locateIpAddresses(nodes: LightningNodeType[]) {
    const cleanIps = nodes.reduce((acc, node) => {
      if (!!node.addresses) {
        const ip = this.ipAddressHelper(node);
        if (ip) {
          acc.push(ip);
        }
      }
      return acc;
    }, []);
    const cleanedIpForTesting = cleanIps.slice(0, 2);
    const ipRes = await IpStack.gatherIpAddresses(cleanIps);
    return ipRes;
  }

  public ipAddressHelper(nodes: LightningNodeType) {
    const ips = nodes.addresses;
    const cleanIps = ips.reduce((acc, ip) => {
      const cleanedIpv6 = ip.addr.match(this.ipv6Regex);
      if (cleanedIpv6 && cleanedIpv6.length) {
        const cleanIp = cleanedIpv6[0];
        if (this.ignoredIps.indexOf(cleanIp) === -1) {
          acc.push(cleanIp);
        }
      }
      const cleanedIpv4 = ip.addr.match(this.ipv4Regex);
      if (cleanedIpv4 && cleanedIpv4.length) {
        const cleanIp = cleanedIpv4[0];
        if (this.ignoredIps.indexOf(cleanIp) === -1) {
          acc.push(cleanIp);
        }
      }
      return acc;
    }, []);
    if (cleanIps.length) {
      // Is there ever a case where a node could have multiple externalips?
      return cleanIps[0];
    }
    return null;
  }
}
