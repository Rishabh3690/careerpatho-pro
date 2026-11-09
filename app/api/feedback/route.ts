import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import {
  GOOGLE_APPS_SCRIPT_WEBHOOK_URL,
  GOOGLE_SHEET_LINK,
} from '../../../src/utils/feedbackSyncEngine';

const LOCAL_LOG_PATH = path.join('/tmp', 'careerpatho-feedback-log.json');

function readLocalLog(): Array<Record<string, unknown>> {
  try {
    if (fs.existsSync(LOCAL_LOG_PATH)) {
      const raw = fs.readFileSync(LOCAL_LOG_PATH, 'utf8');
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch {
    // Ignore file read errors
  }
  return [];
}

function appendLocalLog(entry: Record<string, unknown>): void {
  try {
    const existing = readLocalLog();
    existing.unshift(entry);
    fs.writeFileSync(LOCAL_LOG_PATH, JSON.stringify(existing.slice(0, 200), null, 2), 'utf8');
  } catch {
    // Ignore file write errors
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const webhookUrl = process.env.GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_WEBHOOK_URL;
    const sheetUrl = body.sheetUrl || process.env.GOOGLE_SHEET_URL || GOOGLE_SHEET_LINK || '';

    const payloadForAppsScript = {
      category: body.category || 'Feedback',
      message: body.message || '',
      url: body.url || '',
      userAgent: body.userAgent || '',
      screenResolution: body.screenResolution || '',
      appState: body.appState || '',
      sheetUrl,
    };

    // Always store a server-side copy so no feedback is ever lost
    appendLocalLog({
      timestamp: new Date().toISOString(),
      ...payloadForAppsScript,
    });

    // Forward server-to-server to Google Apps Script (bypasses browser CORS & iframe restrictions)
    let sheetSynced = false;
    let appsScriptResponseText = '';

    try {
      const gsRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payloadForAppsScript),
        redirect: 'follow',
      });
      appsScriptResponseText = await gsRes.text();
      try {
        const parsed = JSON.parse(appsScriptResponseText);
        if (parsed && parsed.status === 'success') {
          sheetSynced = true;
        }
      } catch {
        if (gsRes.ok) {
          sheetSynced = true;
        }
      }
    } catch (forwardErr) {
      appsScriptResponseText =
        forwardErr instanceof Error ? forwardErr.message : String(forwardErr);
    }

    return NextResponse.json({
      status: 'success',
      syncedToSheet: sheetSynced,
      serverSaved: true,
      appsScriptResponse: appsScriptResponseText.slice(0, 300),
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: 'error',
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  const entries = readLocalLog();
  return NextResponse.json({
    status: 'ok',
    count: entries.length,
    entries,
  });
}
