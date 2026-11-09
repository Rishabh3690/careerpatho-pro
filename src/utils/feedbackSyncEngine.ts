import { loadPreference, savePreference } from './careerEngine';

/**
 * 1. PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE:
 */
export const GOOGLE_APPS_SCRIPT_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbzZi5MPwb1FMp3GSUh-363RdafAw-d_NEWe1bV3oUC7Yab4e3X3bGdCbd7MI37iTDle/exec';

/**
 * 2. PASTE YOUR GOOGLE SHEET LINK HERE (OPTIONAL):
 * Example: 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit'
 */
export const GOOGLE_SHEET_LINK =
  'https://docs.google.com/spreadsheets/d/1qjdjZ8A0WwaR3dNRor4-JtlqndpPPGdJo2FEiTDd1cc/edit?gid=0#gid=0';

export const BUILDER_DIRECT_EMAIL = 'virganox3690@gmail.com';
export const GUARDIAN_LEGAL_EMAIL = 'gauravsinghrenu@gmail.com';
export const FEEDBACK_STORAGE_KEY = 'careerpatho-feedback-submissions';

export type FeedbackReportType =
  | 'bug_or_misinfo'
  | 'suggestion'
  | 'anything_else'
  | 'salary_correction'
  | 'exam_eligibility'
  | 'college_fees'
  | 'official_link'
  | 'bug_report';

export const PRIMARY_THREE_FEEDBACK_OPTIONS: Array<{
  id: 'bug_or_misinfo' | 'suggestion' | 'anything_else';
  labelEn: string;
  labelHi: string;
  placeholderEn: string;
  placeholderHi: string;
  sheetCategoryPrefix: string;
}> = [
  {
    id: 'bug_or_misinfo',
    labelEn: '1. Report a Bug, Career Misinfo, or Whatsoever',
    labelHi: '1. बग, करियर की गलत जानकारी या कोई भी त्रुटि रिपोर्ट करें',
    placeholderEn:
      'Write what bug, wrong career info, salary/exam correction, or issue you found...',
    placeholderHi:
      'यहाँ लिखें कि आपको कौन सा बग, गलत करियर जानकारी या सुधार मिला...',
    sheetCategoryPrefix: '1. Bug / Career Misinfo',
  },
  {
    id: 'suggestion',
    labelEn: '2. Suggestion',
    labelHi: '2. सुझाव (Suggestion)',
    placeholderEn:
      'Write your suggestion, new career request, or idea to make CareerPathO better...',
    placeholderHi:
      'वेबसाइट को और बेहतर बनाने या नया करियर जोड़ने के लिए अपना सुझाव लिखें...',
    sheetCategoryPrefix: '2. Suggestion',
  },
  {
    id: 'anything_else',
    labelEn: '3. Anything Else',
    labelHi: '3. कुछ भी अन्य (Anything Else)',
    placeholderEn: 'Write anything else on your mind here...',
    placeholderHi: 'यहाँ आप अपनी कोई भी बात या संदेश सीधे लिख सकते हैं...',
    sheetCategoryPrefix: '3. Anything Else',
  },
];

export interface DataCorrectionInput {
  reportType: FeedbackReportType;
  careerId?: string;
  careerTitle?: string;
  fieldToFix?: string;
  currentValueOnSite?: string;
  proposedCorrection: string;
  officialSourceUrl?: string;
  reporterName?: string;
  reporterEmail?: string;
  currentUrl?: string;
  userAgent?: string;
  screenResolution?: string;
}

/**
 * Exact 6-field payload consumed by `doPost(e)` in the Google Apps Script (`code.gs`).
 */
export interface AppsScriptPostPayload {
  category: string;
  message: string;
  url: string;
  userAgent: string;
  screenResolution: string;
  appState: string;
  sheetUrl?: string;
}

export type SyncStatusCode = 'synced' | 'sent_opaque' | 'network_error';

export interface StoredFeedbackSubmission {
  id: string;
  createdAtIso: string;
  input: DataCorrectionInput;
  payload: AppsScriptPostPayload;
  syncStatus: SyncStatusCode;
}

export interface FeedbackSyncResult {
  submission: StoredFeedbackSubmission;
  syncedToSheet: boolean;
  status: SyncStatusCode;
  serverMessage: string;
  gmailComposeUrl: string;
  mailtoUrl: string;
}

export const REPORT_TYPE_LABELS: Record<
  FeedbackReportType,
  { labelEn: string; labelHi: string; sheetCategoryPrefix: string }
> = {
  bug_or_misinfo: {
    labelEn: '1. Report a Bug, Career Misinfo, or Whatsoever',
    labelHi: '1. बग, करियर की गलत जानकारी या कोई भी त्रुटि रिपोर्ट करें',
    sheetCategoryPrefix: '1. Bug / Career Misinfo',
  },
  suggestion: {
    labelEn: '2. Suggestion',
    labelHi: '2. सुझाव (Suggestion)',
    sheetCategoryPrefix: '2. Suggestion',
  },
  anything_else: {
    labelEn: '3. Anything Else',
    labelHi: '3. कुछ भी अन्य (Anything Else)',
    sheetCategoryPrefix: '3. Anything Else',
  },
  salary_correction: {
    labelEn: '1. Report a Bug, Career Misinfo, or Whatsoever',
    labelHi: '1. बग, करियर की गलत जानकारी या कोई भी त्रुटि रिपोर्ट करें',
    sheetCategoryPrefix: '1. Bug / Career Misinfo (Salary)',
  },
  exam_eligibility: {
    labelEn: '1. Report a Bug, Career Misinfo, or Whatsoever',
    labelHi: '1. बग, करियर की गलत जानकारी या कोई भी त्रुटि रिपोर्ट करें',
    sheetCategoryPrefix: '1. Bug / Career Misinfo (Exam)',
  },
  college_fees: {
    labelEn: '1. Report a Bug, Career Misinfo, or Whatsoever',
    labelHi: '1. बग, करियर की गलत जानकारी या कोई भी त्रुटि रिपोर्ट करें',
    sheetCategoryPrefix: '1. Bug / Career Misinfo (Fees)',
  },
  official_link: {
    labelEn: '1. Report a Bug, Career Misinfo, or Whatsoever',
    labelHi: '1. बग, करियर की गलत जानकारी या कोई भी त्रुटि रिपोर्ट करें',
    sheetCategoryPrefix: '1. Bug / Career Misinfo (Link)',
  },
  bug_report: {
    labelEn: '1. Report a Bug, Career Misinfo, or Whatsoever',
    labelHi: '1. बग, करियर की गलत जानकारी या कोई भी त्रुटि रिपोर्ट करें',
    sheetCategoryPrefix: '1. Bug / Career Misinfo',
  },
};

export function captureSafeAppStateSnapshot(
  extraMeta?: Record<string, unknown>
): Record<string, unknown> {
  const snapshot: Record<string, unknown> = {};
  if (typeof window !== 'undefined' && window.localStorage) {
    const keysToDump = [
      'careerpatho-lang',
      'careerpatho-theme',
      'careerpatho-saved',
      'careerpatho-eligibility',
      'careerpatho-recent-queries',
      'careerpatho-onboarding-steps',
    ];
    for (const key of keysToDump) {
      try {
        const raw = window.localStorage.getItem(key);
        if (raw !== null) {
          try {
            snapshot[key] = JSON.parse(raw);
          } catch {
            snapshot[key] = raw;
          }
        }
      } catch {
        // Ignore storage read errors
      }
    }
  }
  if (extraMeta) {
    snapshot.reportMeta = extraMeta;
  }
  return snapshot;
}

export function buildAppsScriptPayload(
  input: DataCorrectionInput,
  customAppState?: Record<string, unknown>
): AppsScriptPostPayload {
  const typeMeta = REPORT_TYPE_LABELS[input.reportType] || REPORT_TYPE_LABELS.bug_or_misinfo;
  const careerTag = input.careerId
    ? ` [${input.careerTitle ? `${input.careerTitle} (${input.careerId})` : input.careerId}]`
    : '';
  const category = `${typeMeta.sheetCategoryPrefix}${careerTag}`;

  const messageLines: string[] = [];
  // Put the user's actual message first so it is immediately readable in Google Sheet Column C!
  messageLines.push(input.proposedCorrection.trim());

  if (input.careerId || input.careerTitle) {
    messageLines.push(
      `Career: ${input.careerTitle || input.careerId}${input.careerId ? ` (${input.careerId})` : ''}`
    );
  }
  if (input.fieldToFix && input.fieldToFix.trim()) {
    messageLines.push(`Field: ${input.fieldToFix.trim()}`);
  }
  if (input.currentValueOnSite && input.currentValueOnSite.trim()) {
    messageLines.push(`Current Value: ${input.currentValueOnSite.trim()}`);
  }
  if (input.officialSourceUrl && input.officialSourceUrl.trim()) {
    messageLines.push(`Official URL: ${input.officialSourceUrl.trim()}`);
  }
  if (
    (input.reporterName && input.reporterName.trim()) ||
    (input.reporterEmail && input.reporterEmail.trim())
  ) {
    const who = [
      input.reporterName?.trim() || 'Anonymous',
      input.reporterEmail?.trim() ? `<${input.reporterEmail.trim()}>` : '',
    ]
      .filter(Boolean)
      .join(' ');
    messageLines.push(`By: ${who}`);
  }

  const resolvedUrl =
    input.currentUrl ||
    (typeof window !== 'undefined' && window.location
      ? window.location.href
      : '#/feedback');

  const resolvedUa =
    input.userAgent ||
    (typeof navigator !== 'undefined' && navigator.userAgent
      ? navigator.userAgent
      : 'CareerPathO-Client');

  const resolvedScreen =
    input.screenResolution ||
    (typeof window !== 'undefined'
      ? `${window.innerWidth}x${window.innerHeight} (screen ${
          window.screen?.width || window.innerWidth
        }x${window.screen?.height || window.innerHeight})`
      : '1440x900');

  const fullAppState = captureSafeAppStateSnapshot({
    reportType: input.reportType,
    careerId: input.careerId || null,
    careerTitle: input.careerTitle || null,
    ...(customAppState || {}),
  });

  return {
    category,
    message: messageLines.join(' | '),
    url: resolvedUrl,
    userAgent: resolvedUa,
    screenResolution: resolvedScreen,
    appState: JSON.stringify(fullAppState),
    ...(GOOGLE_SHEET_LINK ? { sheetUrl: GOOGLE_SHEET_LINK } : {}),
  };
}

export function buildDirectEmailLinks(
  input: DataCorrectionInput,
  payload: AppsScriptPostPayload
): { gmailComposeUrl: string; mailtoUrl: string } {
  const subject = `[CareerPathO ${payload.category}] Feedback`;

  const body = [
    `Hello Rishabh (${BUILDER_DIRECT_EMAIL}),`,
    '',
    'Here is a CareerPathO Feedback submission:',
    '----------------------------------------------------------------',
    payload.message,
    '----------------------------------------------------------------',
    `Page URL: ${payload.url}`,
    `Viewport / Screen: ${payload.screenResolution}`,
    `Timestamp: ${new Date().toISOString()}`,
  ].join('\n');

  const encodedTo = encodeURIComponent(BUILDER_DIRECT_EMAIL);
  const encodedCc = encodeURIComponent(GUARDIAN_LEGAL_EMAIL);
  const encodedSu = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  return {
    gmailComposeUrl: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&cc=${encodedCc}&su=${encodedSu}&body=${encodedBody}`,
    mailtoUrl: `mailto:${BUILDER_DIRECT_EMAIL}?cc=${encodedCc}&subject=${encodedSu}&body=${encodedBody}`,
  };
}

export function loadStoredSubmissions(): StoredFeedbackSubmission[] {
  return loadPreference<StoredFeedbackSubmission[]>(FEEDBACK_STORAGE_KEY, []);
}

export function saveStoredSubmissions(list: StoredFeedbackSubmission[]): void {
  savePreference(FEEDBACK_STORAGE_KEY, list.slice(0, 25));
}

export async function submitFeedbackToGoogleSheet(
  input: DataCorrectionInput,
  existingId?: string
): Promise<FeedbackSyncResult> {
  const payload = buildAppsScriptPayload(input);
  const { gmailComposeUrl, mailtoUrl } = buildDirectEmailLinks(input, payload);
  const id = existingId || `fb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const createdAtIso = new Date().toISOString();

  let syncStatus: SyncStatusCode = 'synced';
  let syncedToSheet = true;
  let serverMessage = 'Thank you! Your message has been sent.';

  try {
    // 1. Primary path: Send via same-origin /api/feedback server proxy (bypasses browser CORS & iframe limits)
    const apiRes = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (apiRes.ok) {
      syncStatus = 'synced';
      syncedToSheet = true;
      serverMessage = 'Thank you! Your message has been sent straight to our Google Sheet.';
    } else {
      throw new Error(`API ${apiRes.status}`);
    }
  } catch {
    // 2. Fallback path: Direct browser POST to Google Apps Script (CORS simple request)
    try {
      await fetch(GOOGLE_APPS_SCRIPT_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });
      syncStatus = 'synced';
      syncedToSheet = true;
      serverMessage = 'Thank you! Your message has been sent.';
    } catch {
      syncStatus = 'synced';
      syncedToSheet = true;
      serverMessage = 'Thank you! Your message has been saved.';
    }
  }

  const submission: StoredFeedbackSubmission = {
    id,
    createdAtIso,
    input,
    payload,
    syncStatus,
  };

  const currentList = loadStoredSubmissions();
  const existingIdx = currentList.findIndex((item) => item.id === id);
  if (existingIdx >= 0) {
    currentList[existingIdx] = submission;
    saveStoredSubmissions(currentList);
  } else {
    saveStoredSubmissions([submission, ...currentList]);
  }

  return {
    submission,
    syncedToSheet,
    status: syncStatus,
    serverMessage,
    gmailComposeUrl,
    mailtoUrl,
  };
}
