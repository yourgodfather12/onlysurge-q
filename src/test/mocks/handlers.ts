import { http, HttpResponse } from 'msw';

export const handlers = [
  // Auth handlers
  http.post('*/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'test-token',
      user: {
        id: 'test-user-id',
        email: 'test@example.com'
      }
    });
  }),

  // Content handlers
  http.get('*/rest/v1/content_items', () => {
    return HttpResponse.json([
      {
        id: 'test-content-1',
        title: 'Test Content 1',
        description: 'Test description',
        media_type: 'image',
        media_url: 'test.jpg'
      }
    ]);
  }),

  // Platform handlers
  http.get('*/rest/v1/platform_connections', () => {
    return HttpResponse.json([
      {
        id: 'test-connection-1',
        platform: 'onlyfans',
        username: 'testuser'
      }
    ]);
  }),

  // Analytics handlers
  http.get('*/rest/v1/rpc/get_subscription_analytics', () => {
    return HttpResponse.json({
      revenue: {
        monthly: 1000,
        growth: 10
      },
      subscribers: {
        active: 100,
        growth: 5
      }
    });
  })
];