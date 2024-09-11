import { NextResponse } from 'next/server';

// Define users and passwords
const authorizedUsers = {
  'chandan': 'Crusade',
  'pavan': 'Pavan',
};

export function middleware(req) {
  // Get the Authorization header manually
  const authHeader = req.headers.get('authorization');
  console.log('Authorization header:', authHeader); // For debugging

  // If there's no Authorization header, respond with a 401 Unauthorized
  if (!authHeader) {
    const response = new NextResponse('Access denied', { status: 401 });
    response.headers.set('WWW-Authenticate', 'Basic realm="Log Viewer"');
    return response;
  }

  // Extract and decode the Base64 credentials
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = atob(base64Credentials).split(':');
  const username = credentials[0];
  const password = credentials[1];

  console.log('Parsed username:', username, 'Parsed password:', password); // For debugging

  // Verify the username and password
  if (authorizedUsers[username] !== password) {
    const response = new NextResponse('Access denied', { status: 401 });
    response.headers.set('WWW-Authenticate', 'Basic realm="Log Viewer"');
    return response;
  }

  // If authentication is successful, proceed with the request
  return NextResponse.next();
}

// Apply middleware to API routes
export const config = {
  matcher: '/api/logs/:path*', // Applies to all API routes for logs
};
