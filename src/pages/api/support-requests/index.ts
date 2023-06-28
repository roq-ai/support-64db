import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { supportRequestValidationSchema } from 'validationSchema/support-requests';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getSupportRequests();
    case 'POST':
      return createSupportRequest();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSupportRequests() {
    const data = await prisma.support_request
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'support_request'));
    return res.status(200).json(data);
  }

  async function createSupportRequest() {
    await supportRequestValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.support_request.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
