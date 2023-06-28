const mapping: Record<string, string> = {
  companies: 'company',
  'support-requests': 'support_request',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
