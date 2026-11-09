import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GOOGLE_APPS_SCRIPT_WEBHOOK_URL,
  GOOGLE_SHEET_LINK,
  BUILDER_DIRECT_EMAIL,
  GUARDIAN_LEGAL_EMAIL,
  buildAppsScriptPayload,
  buildDirectEmailLinks,
} from './feedbackSyncEngine';

test('feedbackSyncEngine constants match Rishabh Singh Google Apps Script endpoint and virganox3690@gmail.com', () => {
  assert.equal(
    GOOGLE_APPS_SCRIPT_WEBHOOK_URL,
    'https://script.google.com/macros/s/AKfycbzZi5MPwb1FMp3GSUh-363RdafAw-d_NEWe1bV3oUC7Yab4e3X3bGdCbd7MI37iTDle/exec'
  );
  assert.equal(
    GOOGLE_SHEET_LINK,
    'https://docs.google.com/spreadsheets/d/1qjdjZ8A0WwaR3dNRor4-JtlqndpPPGdJo2FEiTDd1cc/edit?gid=0#gid=0'
  );
  assert.equal(BUILDER_DIRECT_EMAIL, 'virganox3690@gmail.com');
  assert.equal(GUARDIAN_LEGAL_EMAIL, 'gauravsinghrenu@gmail.com');
});

test('buildAppsScriptPayload formats exact 6 fields required by code.gs doPost(e) with user message first', () => {
  const input = {
    reportType: 'bug_or_misinfo' as const,
    careerId: 'btech-cse',
    careerTitle: 'B.Tech CSE',
    proposedCorrection: 'Updated NIRF 2026 engineering report shows ₹13.5–23.5 LPA at top 25 NIT/IIT institutes.',
    currentUrl: 'https://careerpatho.in/#/feedback?career=btech-cse',
    userAgent: 'TestBrowser/1.0',
    screenResolution: '390x844',
  };

  const payload = buildAppsScriptPayload(input, { customFlag: true });
  assert.equal(payload.category, '1. Bug / Career Misinfo [B.Tech CSE (btech-cse)]');
  assert.ok(payload.message.startsWith('Updated NIRF 2026 engineering report shows'));
  assert.ok(payload.message.includes('Career: B.Tech CSE (btech-cse)'));
  assert.equal(payload.url, 'https://careerpatho.in/#/feedback?career=btech-cse');
  assert.equal(payload.userAgent, 'TestBrowser/1.0');
  assert.equal(payload.screenResolution, '390x844');

  const parsedAppState = JSON.parse(payload.appState);
  assert.equal(parsedAppState.reportMeta.careerId, 'btech-cse');
  assert.equal(parsedAppState.reportMeta.customFlag, true);
});

test('buildDirectEmailLinks builds valid Gmail Compose and mailto URLs to virganox3690@gmail.com', () => {
  const input = {
    reportType: 'bug_report' as const,
    proposedCorrection: 'Found a minor alignment issue on 360px screen.',
  };
  const payload = buildAppsScriptPayload(input);
  const links = buildDirectEmailLinks(input, payload);

  assert.ok(links.gmailComposeUrl.startsWith('https://mail.google.com/mail/?view=cm&fs=1&to='));
  assert.ok(links.gmailComposeUrl.includes(encodeURIComponent('virganox3690@gmail.com')));
  assert.ok(links.gmailComposeUrl.includes(encodeURIComponent('gauravsinghrenu@gmail.com')));
  assert.ok(links.mailtoUrl.startsWith('mailto:virganox3690@gmail.com'));
});
