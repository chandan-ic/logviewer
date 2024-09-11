import { promises as fs } from 'fs';
import path from 'path';
import logPaths from '@/config/services'; // Import your services.json or JS config

export async function GET(req, { params }) {
  const { service } = params;

  // Validate if the service is valid
  const logDir = logPaths[service];
  if (!logDir) {
    return new Response(JSON.stringify({ error: 'Invalid service name' }), { status: 400 });
  }

  try {
    const files = await fs.readdir(logDir);
    const logFiles = files.filter((file) => file.endsWith('.log'));
    return new Response(JSON.stringify({ logFiles }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Unable to read log files' }), { status: 500 });
  }
}
