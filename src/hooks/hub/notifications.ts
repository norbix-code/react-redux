import type { Norbix } from 'norbix';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

// hub.notifications and hub.email/email-templates are split across SDK
// modules. We focus on the EmailTemplates surface here; SMS / Push templates
// follow the same shape — wire them via `injectEndpoints` when needed.

/**
 * `hub.notifications` (email side) — templates CRUD plus module toggle.
 * Tag taxonomy mirrors the cloud admin UI:
 *   - `EmailTemplates/TEMPLATES_LIST`        — list page
 *   - `EmailTemplates/<id>`                  — single template
 */
export const hubNotifications = (b: Builder) => {
  type HN = Norbix['hub']['notifications'];

  type EnableEmail = HN['enableEmail'] extends (...a: never[]) => unknown
    ? HN['enableEmail']
    : never;
  type DisableEmail = HN['disableEmail'] extends (...a: never[]) => unknown
    ? HN['disableEmail']
    : never;

  type GetEmailTemplates = HN['getEmailTemplates'];
  type GetEmailTemplate = HN['getEmailTemplate'];
  type CreateEmailTemplate = HN['createEmailTemplate'];
  type UpdateEmailTemplate = HN['updateEmailTemplate'];
  type DeleteEmailTemplate = HN['deleteEmailTemplate'];
  type GetEmailTemplateAvailableTokens = HN['getEmailTemplateAvailableTokens'];

  const callHN = (norbix: Norbix) => norbix.hub.notifications as HN;

  return {
    // ---- Module toggle ----
    enableEmail: b.mutation<Result<EnableEmail>, Arg<EnableEmail>>({
      query: (args) => (norbix) => callHN(norbix).enableEmail(args),
      invalidatesTags: ['Account', 'Projects', 'Emails'],
    }),
    disableEmail: b.mutation<Result<DisableEmail>, Arg<DisableEmail>>({
      query: (args) => (norbix) => callHN(norbix).disableEmail(args),
      invalidatesTags: ['Account', 'Projects', 'Emails'],
    }),

    // ---- Email Templates ----
    getEmailTemplates: b.query<Result<GetEmailTemplates>, Arg<GetEmailTemplates>>({
      query: (args) => (norbix) => callHN(norbix).getEmailTemplates(args),
      providesTags: [{ type: 'EmailTemplates', id: 'TEMPLATES_LIST' }],
    }),

    getEmailTemplate: b.query<Result<GetEmailTemplate>, Arg<GetEmailTemplate>>({
      query: (args) => (norbix) => callHN(norbix).getEmailTemplate(args),
      providesTags: (_res, _err, arg) => [
        { type: 'EmailTemplates', id: (arg as { id?: string })?.id ?? 'CURRENT' },
      ],
    }),

    getEmailTemplateAvailableTokens: b.query<
      Result<GetEmailTemplateAvailableTokens>,
      Arg<GetEmailTemplateAvailableTokens>
    >({
      query: (args) => (norbix) => callHN(norbix).getEmailTemplateAvailableTokens(args),
      providesTags: [{ type: 'EmailTemplates', id: 'TEST_TOKENS' }],
    }),

    createEmailTemplate: b.mutation<Result<CreateEmailTemplate>, Arg<CreateEmailTemplate>>({
      query: (args) => (norbix) => callHN(norbix).createEmailTemplate(args),
      invalidatesTags: [{ type: 'EmailTemplates', id: 'TEMPLATES_LIST' }],
    }),

    updateEmailTemplate: b.mutation<Result<UpdateEmailTemplate>, Arg<UpdateEmailTemplate>>({
      query: (args) => (norbix) => callHN(norbix).updateEmailTemplate(args),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'EmailTemplates', id: 'TEMPLATES_LIST' },
        { type: 'EmailTemplates', id: (arg as { id?: string })?.id ?? 'CURRENT' },
      ],
    }),

    deleteEmailTemplate: b.mutation<Result<DeleteEmailTemplate>, Arg<DeleteEmailTemplate>>({
      query: (args) => (norbix) => callHN(norbix).deleteEmailTemplate(args),
      invalidatesTags: [{ type: 'EmailTemplates', id: 'TEMPLATES_LIST' }],
    }),
  } as const;
};
