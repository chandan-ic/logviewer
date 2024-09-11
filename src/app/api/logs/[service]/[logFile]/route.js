import { promises as fs } from 'fs';
import path from 'path';
import logPaths from '@/config/services'; // Import your services.json or JS config

export async function GET(req, { params }) {
  const { service, logFile } = params;

  // Validate the service
  const logDir = logPaths[service];
  if (!logDir) {
    return new Response(JSON.stringify({ error: 'Invalid service name' }), { status: 400 });
  }

  // Validate and read the log file
  const filePath = path.join(logDir, logFile);
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return new Response(content, { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Unable to read log file' }), { status: 500 });
  }
}
