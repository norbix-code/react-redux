// AUTO-GENERATED — full coverage of `norbix.hub.notifications` (123 endpoints).
// Synced from the norbix core SDK surface. Re-run the hook sync to refresh.
import type { Norbix } from 'norbix';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type GetUserNotificationPreferences = Norbix['hub']['notifications']['getUserNotificationPreferences'];
type UpdateUserNotificationsPreferences = Norbix['hub']['notifications']['updateUserNotificationsPreferences'];
type DisableEmail = Norbix['hub']['notifications']['disableEmail'];
type EnableEmail = Norbix['hub']['notifications']['enableEmail'];
type SaveEmailValidationIntegration = Norbix['hub']['notifications']['saveEmailValidationIntegration'];
type TestEmailValidationIntegration = Norbix['hub']['notifications']['testEmailValidationIntegration'];
type AttachFileToTemplate = Norbix['hub']['notifications']['attachFileToTemplate'];
type CreateEmailTemplate = Norbix['hub']['notifications']['createEmailTemplate'];
type DeleteEmailTemplate = Norbix['hub']['notifications']['deleteEmailTemplate'];
type GetEmailTemplate = Norbix['hub']['notifications']['getEmailTemplate'];
type GetEmailTemplates = Norbix['hub']['notifications']['getEmailTemplates'];
type GetMjml = Norbix['hub']['notifications']['getMjml'];
type GetSystemEmailTemplate = Norbix['hub']['notifications']['getSystemEmailTemplate'];
type GetSystemEmailTemplates = Norbix['hub']['notifications']['getSystemEmailTemplates'];
type GetEmailTemplateAvailableTokens = Norbix['hub']['notifications']['getEmailTemplateAvailableTokens'];
type UpdateEmailTemplate = Norbix['hub']['notifications']['updateEmailTemplate'];
type DeleteEmailSignature = Norbix['hub']['notifications']['deleteEmailSignature'];
type GetEmailSignature = Norbix['hub']['notifications']['getEmailSignature'];
type GetEmailSignatures = Norbix['hub']['notifications']['getEmailSignatures'];
type SaveEmailSignature = Norbix['hub']['notifications']['saveEmailSignature'];
type GetEmailSettings = Norbix['hub']['notifications']['getEmailSettings'];
type ConfirmEmailIntegrationHumanDelivery = Norbix['hub']['notifications']['confirmEmailIntegrationHumanDelivery'];
type DeleteEmailIntegration = Norbix['hub']['notifications']['deleteEmailIntegration'];
type DisableEmailIntegration = Norbix['hub']['notifications']['disableEmailIntegration'];
type EnableEmailIntegration = Norbix['hub']['notifications']['enableEmailIntegration'];
type GetEmailIntegration = Norbix['hub']['notifications']['getEmailIntegration'];
type GetEmailIntegrations = Norbix['hub']['notifications']['getEmailIntegrations'];
type SaveEmailIntegration = Norbix['hub']['notifications']['saveEmailIntegration'];
type SetEmailsIntegrationAsDefault = Norbix['hub']['notifications']['setEmailsIntegrationAsDefault'];
type TestEmailIntegration = Norbix['hub']['notifications']['testEmailIntegration'];
type ArchiveEmailTemplate = Norbix['hub']['notifications']['archiveEmailTemplate'];
type CloneEmailTemplate = Norbix['hub']['notifications']['cloneEmailTemplate'];
type UnArchiveEmailTemplate = Norbix['hub']['notifications']['unArchiveEmailTemplate'];
type DeleteEmailFooter = Norbix['hub']['notifications']['deleteEmailFooter'];
type GetEmailFooter = Norbix['hub']['notifications']['getEmailFooter'];
type GetEmailFooters = Norbix['hub']['notifications']['getEmailFooters'];
type SaveEmailFooter = Norbix['hub']['notifications']['saveEmailFooter'];
type CreateEmailCampaign = Norbix['hub']['notifications']['createEmailCampaign'];
type DeleteEmailCampaign = Norbix['hub']['notifications']['deleteEmailCampaign'];
type GetEmailCampaign = Norbix['hub']['notifications']['getEmailCampaign'];
type GetEmailCampaigns = Norbix['hub']['notifications']['getEmailCampaigns'];
type GetEmailCampaignBatches = Norbix['hub']['notifications']['getEmailCampaignBatches'];
type GetEmailCampaignBatchNotification = Norbix['hub']['notifications']['getEmailCampaignBatchNotification'];
type GetEmailCampaignBatchNotifications = Norbix['hub']['notifications']['getEmailCampaignBatchNotifications'];
type GetEmailCampaignStatistics = Norbix['hub']['notifications']['getEmailCampaignStatistics'];
type PreviewEmailNotification = Norbix['hub']['notifications']['previewEmailNotification'];
type GetEmailCampaignMessage = Norbix['hub']['notifications']['getEmailCampaignMessage'];
type GetEmailCampaignMessages = Norbix['hub']['notifications']['getEmailCampaignMessages'];
type DisableSms = Norbix['hub']['notifications']['disableSms'];
type EnableSms = Norbix['hub']['notifications']['enableSms'];
type ArchiveSmsTemplate = Norbix['hub']['notifications']['archiveSmsTemplate'];
type CloneSmsTemplate = Norbix['hub']['notifications']['cloneSmsTemplate'];
type CreateSmsTemplate = Norbix['hub']['notifications']['createSmsTemplate'];
type DeleteSmsTemplate = Norbix['hub']['notifications']['deleteSmsTemplate'];
type GetSmsTemplate = Norbix['hub']['notifications']['getSmsTemplate'];
type GetSmsTemplates = Norbix['hub']['notifications']['getSmsTemplates'];
type GetSmsMessageContentTokens = Norbix['hub']['notifications']['getSmsMessageContentTokens'];
type UnArchiveSmsTemplate = Norbix['hub']['notifications']['unArchiveSmsTemplate'];
type UpdateSmsTemplate = Norbix['hub']['notifications']['updateSmsTemplate'];
type GetSmsSettings = Norbix['hub']['notifications']['getSmsSettings'];
type ConfirmSmsIntegrationHumanDelivery = Norbix['hub']['notifications']['confirmSmsIntegrationHumanDelivery'];
type DeleteSmsIntegration = Norbix['hub']['notifications']['deleteSmsIntegration'];
type DisableSmsIntegration = Norbix['hub']['notifications']['disableSmsIntegration'];
type EnableSmsIntegration = Norbix['hub']['notifications']['enableSmsIntegration'];
type GetSmsIntegration = Norbix['hub']['notifications']['getSmsIntegration'];
type GetSmsIntegrations = Norbix['hub']['notifications']['getSmsIntegrations'];
type SaveSmsIntegration = Norbix['hub']['notifications']['saveSmsIntegration'];
type SetSmsIntegrationAsDefault = Norbix['hub']['notifications']['setSmsIntegrationAsDefault'];
type TestSmsIntegration = Norbix['hub']['notifications']['testSmsIntegration'];
type CreateSmsCampaign = Norbix['hub']['notifications']['createSmsCampaign'];
type DeleteSmsCampaign = Norbix['hub']['notifications']['deleteSmsCampaign'];
type GetSmsCampaign = Norbix['hub']['notifications']['getSmsCampaign'];
type GetSmsCampaigns = Norbix['hub']['notifications']['getSmsCampaigns'];
type GetSmsCampaignBatches = Norbix['hub']['notifications']['getSmsCampaignBatches'];
type GetSmsCampaignBatchNotification = Norbix['hub']['notifications']['getSmsCampaignBatchNotification'];
type GetSmsCampaignBatchNotifications = Norbix['hub']['notifications']['getSmsCampaignBatchNotifications'];
type GetSmsCampaignStatistics = Norbix['hub']['notifications']['getSmsCampaignStatistics'];
type PreviewSmsNotification = Norbix['hub']['notifications']['previewSmsNotification'];
type GetSmsCampaignMessage = Norbix['hub']['notifications']['getSmsCampaignMessage'];
type GetSmsCampaignMessages = Norbix['hub']['notifications']['getSmsCampaignMessages'];
type DisablePush = Norbix['hub']['notifications']['disablePush'];
type EnablePush = Norbix['hub']['notifications']['enablePush'];
type ArchivePushTemplate = Norbix['hub']['notifications']['archivePushTemplate'];
type ClonePushTemplate = Norbix['hub']['notifications']['clonePushTemplate'];
type CreatePushTemplate = Norbix['hub']['notifications']['createPushTemplate'];
type DeletePushTemplate = Norbix['hub']['notifications']['deletePushTemplate'];
type GetPushTemplate = Norbix['hub']['notifications']['getPushTemplate'];
type GetPushTemplates = Norbix['hub']['notifications']['getPushTemplates'];
type GetPushMessageContentTokens = Norbix['hub']['notifications']['getPushMessageContentTokens'];
type UnArchivePushTemplate = Norbix['hub']['notifications']['unArchivePushTemplate'];
type UpdatePushTemplate = Norbix['hub']['notifications']['updatePushTemplate'];
type GetPushSettings = Norbix['hub']['notifications']['getPushSettings'];
type ConfirmPushIntegrationHumanDelivery = Norbix['hub']['notifications']['confirmPushIntegrationHumanDelivery'];
type DeletePushIntegration = Norbix['hub']['notifications']['deletePushIntegration'];
type DisablePushIntegration = Norbix['hub']['notifications']['disablePushIntegration'];
type EnablePushIntegration = Norbix['hub']['notifications']['enablePushIntegration'];
type GetPushIntegration = Norbix['hub']['notifications']['getPushIntegration'];
type GetPushIntegrations = Norbix['hub']['notifications']['getPushIntegrations'];
type SavePushIntegration = Norbix['hub']['notifications']['savePushIntegration'];
type SetPushIntegrationAsDefault = Norbix['hub']['notifications']['setPushIntegrationAsDefault'];
type TestPushIntegration = Norbix['hub']['notifications']['testPushIntegration'];
type RegisterCodeMashAppPushIntegration = Norbix['hub']['notifications']['registerCodeMashAppPushIntegration'];
type RegisterDevice = Norbix['hub']['notifications']['registerDevice'];
type CreatePushCampaign = Norbix['hub']['notifications']['createPushCampaign'];
type DeletePushCampaign = Norbix['hub']['notifications']['deletePushCampaign'];
type GetPushCampaign = Norbix['hub']['notifications']['getPushCampaign'];
type GetPushCampaigns = Norbix['hub']['notifications']['getPushCampaigns'];
type GetPushCampaignBatches = Norbix['hub']['notifications']['getPushCampaignBatches'];
type GetPushCampaignBatchNotification = Norbix['hub']['notifications']['getPushCampaignBatchNotification'];
type GetPushCampaignBatchNotifications = Norbix['hub']['notifications']['getPushCampaignBatchNotifications'];
type GetPushCampaignStatistics = Norbix['hub']['notifications']['getPushCampaignStatistics'];
type GetPushCampaignMessage = Norbix['hub']['notifications']['getPushCampaignMessage'];
type GetPushCampaignMessages = Norbix['hub']['notifications']['getPushCampaignMessages'];
type CreateContact = Norbix['hub']['membership']['createContact'];
type DeleteContact = Norbix['hub']['membership']['deleteContact'];
type GetContact = Norbix['hub']['membership']['getContact'];
type GetAllContacts = Norbix['hub']['membership']['getAllContacts'];
type MergeContacts = Norbix['hub']['membership']['mergeContacts'];
type GrantContactConsent = Norbix['hub']['notifications']['grantContactConsent'];
type UnsubscribeContact = Norbix['hub']['notifications']['unsubscribeContact'];
type AddContactIdentity = Norbix['hub']['membership']['addContactIdentity'];
type PromoteContactIdentity = Norbix['hub']['membership']['promoteContactIdentity'];
type RemoveContactIdentity = Norbix['hub']['membership']['removeContactIdentity'];

/**
 * `hub.notifications` — 123 endpoints, 1:1 with the core SDK.
 */
export const hubNotifications = (b: Builder) => ({
  getUserNotificationPreferences: b.query<Result<GetUserNotificationPreferences>, Arg<GetUserNotificationPreferences>>({
    query: (args) => (norbix) => norbix.hub.notifications.getUserNotificationPreferences(args),
    providesTags: ['Account'],
  }),

  updateUserNotificationsPreferences: b.mutation<Result<UpdateUserNotificationsPreferences>, Arg<UpdateUserNotificationsPreferences>>({
    query: (args) => (norbix) => norbix.hub.notifications.updateUserNotificationsPreferences(args),
    invalidatesTags: ['Emails'],
  }),

  disableEmail: b.mutation<Result<DisableEmail>, Arg<DisableEmail>>({
    query: (args) => (norbix) => norbix.hub.notifications.disableEmail(args),
    invalidatesTags: ['Emails'],
  }),

  enableEmail: b.mutation<Result<EnableEmail>, Arg<EnableEmail>>({
    query: (args) => (norbix) => norbix.hub.notifications.enableEmail(args),
    invalidatesTags: ['Emails'],
  }),

  saveEmailValidationIntegration: b.mutation<Result<SaveEmailValidationIntegration>, Arg<SaveEmailValidationIntegration>>({
    query: (args) => (norbix) => norbix.hub.notifications.saveEmailValidationIntegration(args),
    invalidatesTags: ['EmailIntegrations'],
  }),

  testEmailValidationIntegration: b.mutation<Result<TestEmailValidationIntegration>, Arg<TestEmailValidationIntegration>>({
    query: (args) => (norbix) => norbix.hub.notifications.testEmailValidationIntegration(args),
    invalidatesTags: ['EmailIntegrations'],
  }),

  attachFileToTemplate: b.mutation<Result<AttachFileToTemplate>, Arg<AttachFileToTemplate>>({
    query: (args) => (norbix) => norbix.hub.notifications.attachFileToTemplate(args),
    invalidatesTags: ['Emails'],
  }),

  createEmailTemplate: b.mutation<Result<CreateEmailTemplate>, Arg<CreateEmailTemplate>>({
    query: (args) => (norbix) => norbix.hub.notifications.createEmailTemplate(args),
    invalidatesTags: ['EmailTemplates'],
  }),

  deleteEmailTemplate: b.mutation<Result<DeleteEmailTemplate>, Arg<DeleteEmailTemplate>>({
    query: (args) => (norbix) => norbix.hub.notifications.deleteEmailTemplate(args),
    invalidatesTags: ['EmailTemplates'],
  }),

  getEmailTemplate: b.query<Result<GetEmailTemplate>, Arg<GetEmailTemplate>>({
    query: (args) => (norbix) => norbix.hub.notifications.getEmailTemplate(args),
    providesTags: ['EmailTemplates'],
  }),

  getEmailTemplates: b.query<Result<GetEmailTemplates>, Arg<GetEmailTemplates>>({
    query: (args) => (norbix) => norbix.hub.notifications.getEmailTemplates(args),
    providesTags: ['EmailTemplates'],
  }),

  getMjml: b.query<Result<GetMjml>, Arg<GetMjml>>({
    query: (args) => (norbix) => norbix.hub.notifications.getMjml(args),
    providesTags: ['Emails'],
  }),

  getSystemEmailTemplate: b.query<Result<GetSystemEmailTemplate>, Arg<GetSystemEmailTemplate>>({
    query: (args) => (norbix) => norbix.hub.notifications.getSystemEmailTemplate(args),
    providesTags: ['EmailTemplates'],
  }),

  getSystemEmailTemplates: b.query<Result<GetSystemEmailTemplates>, Arg<GetSystemEmailTemplates>>({
    query: (args) => (norbix) => norbix.hub.notifications.getSystemEmailTemplates(args),
    providesTags: ['EmailTemplates'],
  }),

  getEmailTemplateAvailableTokens: b.query<Result<GetEmailTemplateAvailableTokens>, Arg<GetEmailTemplateAvailableTokens>>({
    query: (args) => (norbix) => norbix.hub.notifications.getEmailTemplateAvailableTokens(args),
    providesTags: ['EmailTemplates'],
  }),

  updateEmailTemplate: b.mutation<Result<UpdateEmailTemplate>, Arg<UpdateEmailTemplate>>({
    query: (args) => (norbix) => norbix.hub.notifications.updateEmailTemplate(args),
    invalidatesTags: ['EmailTemplates'],
  }),

  deleteEmailSignature: b.mutation<Result<DeleteEmailSignature>, Arg<DeleteEmailSignature>>({
    query: (args) => (norbix) => norbix.hub.notifications.deleteEmailSignature(args),
    invalidatesTags: ['EmailSignatures'],
  }),

  getEmailSignature: b.query<Result<GetEmailSignature>, Arg<GetEmailSignature>>({
    query: (args) => (norbix) => norbix.hub.notifications.getEmailSignature(args),
    providesTags: ['EmailSignatures'],
  }),

  getEmailSignatures: b.query<Result<GetEmailSignatures>, Arg<GetEmailSignatures>>({
    query: (args) => (norbix) => norbix.hub.notifications.getEmailSignatures(args),
    providesTags: ['EmailSignatures'],
  }),

  saveEmailSignature: b.mutation<Result<SaveEmailSignature>, Arg<SaveEmailSignature>>({
    query: (args) => (norbix) => norbix.hub.notifications.saveEmailSignature(args),
    invalidatesTags: ['EmailSignatures'],
  }),

  getEmailSettings: b.query<Result<GetEmailSettings>, Arg<GetEmailSettings>>({
    query: (args) => (norbix) => norbix.hub.notifications.getEmailSettings(args),
    providesTags: ['EmailSettings'],
  }),

  confirmEmailIntegrationHumanDelivery: b.mutation<Result<ConfirmEmailIntegrationHumanDelivery>, Arg<ConfirmEmailIntegrationHumanDelivery>>({
    query: (args) => (norbix) => norbix.hub.notifications.confirmEmailIntegrationHumanDelivery(args),
    invalidatesTags: ['EmailIntegrations'],
  }),

  deleteEmailIntegration: b.mutation<Result<DeleteEmailIntegration>, Arg<DeleteEmailIntegration>>({
    query: (args) => (norbix) => norbix.hub.notifications.deleteEmailIntegration(args),
    invalidatesTags: ['EmailIntegrations'],
  }),

  disableEmailIntegration: b.mutation<Result<DisableEmailIntegration>, Arg<DisableEmailIntegration>>({
    query: (args) => (norbix) => norbix.hub.notifications.disableEmailIntegration(args),
    invalidatesTags: ['EmailIntegrations'],
  }),

  enableEmailIntegration: b.mutation<Result<EnableEmailIntegration>, Arg<EnableEmailIntegration>>({
    query: (args) => (norbix) => norbix.hub.notifications.enableEmailIntegration(args),
    invalidatesTags: ['EmailIntegrations'],
  }),

  getEmailIntegration: b.query<Result<GetEmailIntegration>, Arg<GetEmailIntegration>>({
    query: (args) => (norbix) => norbix.hub.notifications.getEmailIntegration(args),
    providesTags: ['EmailIntegrations'],
  }),

  getEmailIntegrations: b.query<Result<GetEmailIntegrations>, Arg<GetEmailIntegrations>>({
    query: (args) => (norbix) => norbix.hub.notifications.getEmailIntegrations(args),
    providesTags: ['EmailIntegrations'],
  }),

  saveEmailIntegration: b.mutation<Result<SaveEmailIntegration>, Arg<SaveEmailIntegration>>({
    query: (args) => (norbix) => norbix.hub.notifications.saveEmailIntegration(args),
    invalidatesTags: ['EmailIntegrations'],
  }),

  setEmailsIntegrationAsDefault: b.mutation<Result<SetEmailsIntegrationAsDefault>, Arg<SetEmailsIntegrationAsDefault>>({
    query: (args) => (norbix) => norbix.hub.notifications.setEmailsIntegrationAsDefault(args),
    invalidatesTags: ['Emails'],
  }),

  testEmailIntegration: b.mutation<Result<TestEmailIntegration>, Arg<TestEmailIntegration>>({
    query: (args) => (norbix) => norbix.hub.notifications.testEmailIntegration(args),
    invalidatesTags: ['EmailIntegrations'],
  }),

  archiveEmailTemplate: b.mutation<Result<ArchiveEmailTemplate>, Arg<ArchiveEmailTemplate>>({
    query: (args) => (norbix) => norbix.hub.notifications.archiveEmailTemplate(args),
    invalidatesTags: ['EmailTemplates'],
  }),

  cloneEmailTemplate: b.mutation<Result<CloneEmailTemplate>, Arg<CloneEmailTemplate>>({
    query: (args) => (norbix) => norbix.hub.notifications.cloneEmailTemplate(args),
    invalidatesTags: ['EmailTemplates'],
  }),

  unArchiveEmailTemplate: b.mutation<Result<UnArchiveEmailTemplate>, Arg<UnArchiveEmailTemplate>>({
    query: (args) => (norbix) => norbix.hub.notifications.unArchiveEmailTemplate(args),
    invalidatesTags: ['EmailTemplates'],
  }),

  deleteEmailFooter: b.mutation<Result<DeleteEmailFooter>, Arg<DeleteEmailFooter>>({
    query: (args) => (norbix) => norbix.hub.notifications.deleteEmailFooter(args),
    invalidatesTags: ['EmailFooters'],
  }),

  getEmailFooter: b.query<Result<GetEmailFooter>, Arg<GetEmailFooter>>({
    query: (args) => (norbix) => norbix.hub.notifications.getEmailFooter(args),
    providesTags: ['EmailFooters'],
  }),

  getEmailFooters: b.query<Result<GetEmailFooters>, Arg<GetEmailFooters>>({
    query: (args) => (norbix) => norbix.hub.notifications.getEmailFooters(args),
    providesTags: ['EmailFooters'],
  }),

  saveEmailFooter: b.mutation<Result<SaveEmailFooter>, Arg<SaveEmailFooter>>({
    query: (args) => (norbix) => norbix.hub.notifications.saveEmailFooter(args),
    invalidatesTags: ['EmailFooters'],
  }),

  createEmailCampaign: b.mutation<Result<CreateEmailCampaign>, Arg<CreateEmailCampaign>>({
    query: (args) => (norbix) => norbix.hub.notifications.createEmailCampaign(args),
    invalidatesTags: ['EmailCampaigns'],
  }),

  deleteEmailCampaign: b.mutation<Result<DeleteEmailCampaign>, Arg<DeleteEmailCampaign>>({
    query: (args) => (norbix) => norbix.hub.notifications.deleteEmailCampaign(args),
    invalidatesTags: ['EmailCampaigns'],
  }),

  getEmailCampaign: b.query<Result<GetEmailCampaign>, Arg<GetEmailCampaign>>({
    query: (args) => (norbix) => norbix.hub.notifications.getEmailCampaign(args),
    providesTags: ['EmailCampaigns'],
  }),

  getEmailCampaigns: b.query<Result<GetEmailCampaigns>, Arg<GetEmailCampaigns>>({
    query: (args) => (norbix) => norbix.hub.notifications.getEmailCampaigns(args),
    providesTags: ['EmailCampaigns'],
  }),

  getEmailCampaignBatches: b.query<Result<GetEmailCampaignBatches>, Arg<GetEmailCampaignBatches>>({
    query: (args) => (norbix) => norbix.hub.notifications.getEmailCampaignBatches(args),
    providesTags: ['EmailCampaigns'],
  }),

  getEmailCampaignBatchNotification: b.query<Result<GetEmailCampaignBatchNotification>, Arg<GetEmailCampaignBatchNotification>>({
    query: (args) => (norbix) => norbix.hub.notifications.getEmailCampaignBatchNotification(args),
    providesTags: ['EmailCampaigns'],
  }),

  getEmailCampaignBatchNotifications: b.query<Result<GetEmailCampaignBatchNotifications>, Arg<GetEmailCampaignBatchNotifications>>({
    query: (args) => (norbix) => norbix.hub.notifications.getEmailCampaignBatchNotifications(args),
    providesTags: ['EmailCampaigns'],
  }),

  getEmailCampaignStatistics: b.query<Result<GetEmailCampaignStatistics>, Arg<GetEmailCampaignStatistics>>({
    query: (args) => (norbix) => norbix.hub.notifications.getEmailCampaignStatistics(args),
    providesTags: ['EmailCampaigns'],
  }),

  previewEmailNotification: b.query<Result<PreviewEmailNotification>, Arg<PreviewEmailNotification>>({
    query: (args) => (norbix) => norbix.hub.notifications.previewEmailNotification(args),
    providesTags: ['Emails'],
  }),

  getEmailCampaignMessage: b.query<Result<GetEmailCampaignMessage>, Arg<GetEmailCampaignMessage>>({
    query: (args) => (norbix) => norbix.hub.notifications.getEmailCampaignMessage(args),
    providesTags: ['EmailCampaigns'],
  }),

  getEmailCampaignMessages: b.query<Result<GetEmailCampaignMessages>, Arg<GetEmailCampaignMessages>>({
    query: (args) => (norbix) => norbix.hub.notifications.getEmailCampaignMessages(args),
    providesTags: ['EmailCampaigns'],
  }),

  disableSms: b.mutation<Result<DisableSms>, Arg<DisableSms>>({
    query: (args) => (norbix) => norbix.hub.notifications.disableSms(args),
    invalidatesTags: ['Sms'],
  }),

  enableSms: b.mutation<Result<EnableSms>, Arg<EnableSms>>({
    query: (args) => (norbix) => norbix.hub.notifications.enableSms(args),
    invalidatesTags: ['Sms'],
  }),

  archiveSmsTemplate: b.mutation<Result<ArchiveSmsTemplate>, Arg<ArchiveSmsTemplate>>({
    query: (args) => (norbix) => norbix.hub.notifications.archiveSmsTemplate(args),
    invalidatesTags: ['SmsTemplates'],
  }),

  cloneSmsTemplate: b.mutation<Result<CloneSmsTemplate>, Arg<CloneSmsTemplate>>({
    query: (args) => (norbix) => norbix.hub.notifications.cloneSmsTemplate(args),
    invalidatesTags: ['SmsTemplates'],
  }),

  createSmsTemplate: b.mutation<Result<CreateSmsTemplate>, Arg<CreateSmsTemplate>>({
    query: (args) => (norbix) => norbix.hub.notifications.createSmsTemplate(args),
    invalidatesTags: ['SmsTemplates'],
  }),

  deleteSmsTemplate: b.mutation<Result<DeleteSmsTemplate>, Arg<DeleteSmsTemplate>>({
    query: (args) => (norbix) => norbix.hub.notifications.deleteSmsTemplate(args),
    invalidatesTags: ['SmsTemplates'],
  }),

  getSmsTemplate: b.query<Result<GetSmsTemplate>, Arg<GetSmsTemplate>>({
    query: (args) => (norbix) => norbix.hub.notifications.getSmsTemplate(args),
    providesTags: ['SmsTemplates'],
  }),

  getSmsTemplates: b.query<Result<GetSmsTemplates>, Arg<GetSmsTemplates>>({
    query: (args) => (norbix) => norbix.hub.notifications.getSmsTemplates(args),
    providesTags: ['SmsTemplates'],
  }),

  getSmsMessageContentTokens: b.query<Result<GetSmsMessageContentTokens>, Arg<GetSmsMessageContentTokens>>({
    query: (args) => (norbix) => norbix.hub.notifications.getSmsMessageContentTokens(args),
    providesTags: ['Sms'],
  }),

  unArchiveSmsTemplate: b.mutation<Result<UnArchiveSmsTemplate>, Arg<UnArchiveSmsTemplate>>({
    query: (args) => (norbix) => norbix.hub.notifications.unArchiveSmsTemplate(args),
    invalidatesTags: ['SmsTemplates'],
  }),

  updateSmsTemplate: b.mutation<Result<UpdateSmsTemplate>, Arg<UpdateSmsTemplate>>({
    query: (args) => (norbix) => norbix.hub.notifications.updateSmsTemplate(args),
    invalidatesTags: ['SmsTemplates'],
  }),

  getSmsSettings: b.query<Result<GetSmsSettings>, Arg<GetSmsSettings>>({
    query: (args) => (norbix) => norbix.hub.notifications.getSmsSettings(args),
    providesTags: ['SmsSettings'],
  }),

  confirmSmsIntegrationHumanDelivery: b.mutation<Result<ConfirmSmsIntegrationHumanDelivery>, Arg<ConfirmSmsIntegrationHumanDelivery>>({
    query: (args) => (norbix) => norbix.hub.notifications.confirmSmsIntegrationHumanDelivery(args),
    invalidatesTags: ['SmsIntegrations'],
  }),

  deleteSmsIntegration: b.mutation<Result<DeleteSmsIntegration>, Arg<DeleteSmsIntegration>>({
    query: (args) => (norbix) => norbix.hub.notifications.deleteSmsIntegration(args),
    invalidatesTags: ['SmsIntegrations'],
  }),

  disableSmsIntegration: b.mutation<Result<DisableSmsIntegration>, Arg<DisableSmsIntegration>>({
    query: (args) => (norbix) => norbix.hub.notifications.disableSmsIntegration(args),
    invalidatesTags: ['SmsIntegrations'],
  }),

  enableSmsIntegration: b.mutation<Result<EnableSmsIntegration>, Arg<EnableSmsIntegration>>({
    query: (args) => (norbix) => norbix.hub.notifications.enableSmsIntegration(args),
    invalidatesTags: ['SmsIntegrations'],
  }),

  getSmsIntegration: b.query<Result<GetSmsIntegration>, Arg<GetSmsIntegration>>({
    query: (args) => (norbix) => norbix.hub.notifications.getSmsIntegration(args),
    providesTags: ['SmsIntegrations'],
  }),

  getSmsIntegrations: b.query<Result<GetSmsIntegrations>, Arg<GetSmsIntegrations>>({
    query: (args) => (norbix) => norbix.hub.notifications.getSmsIntegrations(args),
    providesTags: ['SmsIntegrations'],
  }),

  saveSmsIntegration: b.mutation<Result<SaveSmsIntegration>, Arg<SaveSmsIntegration>>({
    query: (args) => (norbix) => norbix.hub.notifications.saveSmsIntegration(args),
    invalidatesTags: ['SmsIntegrations'],
  }),

  setSmsIntegrationAsDefault: b.mutation<Result<SetSmsIntegrationAsDefault>, Arg<SetSmsIntegrationAsDefault>>({
    query: (args) => (norbix) => norbix.hub.notifications.setSmsIntegrationAsDefault(args),
    invalidatesTags: ['SmsIntegrations'],
  }),

  testSmsIntegration: b.mutation<Result<TestSmsIntegration>, Arg<TestSmsIntegration>>({
    query: (args) => (norbix) => norbix.hub.notifications.testSmsIntegration(args),
    invalidatesTags: ['SmsIntegrations'],
  }),

  createSmsCampaign: b.mutation<Result<CreateSmsCampaign>, Arg<CreateSmsCampaign>>({
    query: (args) => (norbix) => norbix.hub.notifications.createSmsCampaign(args),
    invalidatesTags: ['SmsCampaigns'],
  }),

  deleteSmsCampaign: b.mutation<Result<DeleteSmsCampaign>, Arg<DeleteSmsCampaign>>({
    query: (args) => (norbix) => norbix.hub.notifications.deleteSmsCampaign(args),
    invalidatesTags: ['SmsCampaigns'],
  }),

  getSmsCampaign: b.query<Result<GetSmsCampaign>, Arg<GetSmsCampaign>>({
    query: (args) => (norbix) => norbix.hub.notifications.getSmsCampaign(args),
    providesTags: ['SmsCampaigns'],
  }),

  getSmsCampaigns: b.query<Result<GetSmsCampaigns>, Arg<GetSmsCampaigns>>({
    query: (args) => (norbix) => norbix.hub.notifications.getSmsCampaigns(args),
    providesTags: ['SmsCampaigns'],
  }),

  getSmsCampaignBatches: b.query<Result<GetSmsCampaignBatches>, Arg<GetSmsCampaignBatches>>({
    query: (args) => (norbix) => norbix.hub.notifications.getSmsCampaignBatches(args),
    providesTags: ['SmsCampaigns'],
  }),

  getSmsCampaignBatchNotification: b.query<Result<GetSmsCampaignBatchNotification>, Arg<GetSmsCampaignBatchNotification>>({
    query: (args) => (norbix) => norbix.hub.notifications.getSmsCampaignBatchNotification(args),
    providesTags: ['SmsCampaigns'],
  }),

  getSmsCampaignBatchNotifications: b.query<Result<GetSmsCampaignBatchNotifications>, Arg<GetSmsCampaignBatchNotifications>>({
    query: (args) => (norbix) => norbix.hub.notifications.getSmsCampaignBatchNotifications(args),
    providesTags: ['SmsCampaigns'],
  }),

  getSmsCampaignStatistics: b.query<Result<GetSmsCampaignStatistics>, Arg<GetSmsCampaignStatistics>>({
    query: (args) => (norbix) => norbix.hub.notifications.getSmsCampaignStatistics(args),
    providesTags: ['SmsCampaigns'],
  }),

  previewSmsNotification: b.query<Result<PreviewSmsNotification>, Arg<PreviewSmsNotification>>({
    query: (args) => (norbix) => norbix.hub.notifications.previewSmsNotification(args),
    providesTags: ['Sms'],
  }),

  getSmsCampaignMessage: b.query<Result<GetSmsCampaignMessage>, Arg<GetSmsCampaignMessage>>({
    query: (args) => (norbix) => norbix.hub.notifications.getSmsCampaignMessage(args),
    providesTags: ['SmsCampaigns'],
  }),

  getSmsCampaignMessages: b.query<Result<GetSmsCampaignMessages>, Arg<GetSmsCampaignMessages>>({
    query: (args) => (norbix) => norbix.hub.notifications.getSmsCampaignMessages(args),
    providesTags: ['SmsCampaigns'],
  }),

  disablePush: b.mutation<Result<DisablePush>, Arg<DisablePush>>({
    query: (args) => (norbix) => norbix.hub.notifications.disablePush(args),
    invalidatesTags: ['Push'],
  }),

  enablePush: b.mutation<Result<EnablePush>, Arg<EnablePush>>({
    query: (args) => (norbix) => norbix.hub.notifications.enablePush(args),
    invalidatesTags: ['Push'],
  }),

  archivePushTemplate: b.mutation<Result<ArchivePushTemplate>, Arg<ArchivePushTemplate>>({
    query: (args) => (norbix) => norbix.hub.notifications.archivePushTemplate(args),
    invalidatesTags: ['PushTemplates'],
  }),

  clonePushTemplate: b.mutation<Result<ClonePushTemplate>, Arg<ClonePushTemplate>>({
    query: (args) => (norbix) => norbix.hub.notifications.clonePushTemplate(args),
    invalidatesTags: ['PushTemplates'],
  }),

  createPushTemplate: b.mutation<Result<CreatePushTemplate>, Arg<CreatePushTemplate>>({
    query: (args) => (norbix) => norbix.hub.notifications.createPushTemplate(args),
    invalidatesTags: ['PushTemplates'],
  }),

  deletePushTemplate: b.mutation<Result<DeletePushTemplate>, Arg<DeletePushTemplate>>({
    query: (args) => (norbix) => norbix.hub.notifications.deletePushTemplate(args),
    invalidatesTags: ['PushTemplates'],
  }),

  getPushTemplate: b.query<Result<GetPushTemplate>, Arg<GetPushTemplate>>({
    query: (args) => (norbix) => norbix.hub.notifications.getPushTemplate(args),
    providesTags: ['PushTemplates'],
  }),

  getPushTemplates: b.query<Result<GetPushTemplates>, Arg<GetPushTemplates>>({
    query: (args) => (norbix) => norbix.hub.notifications.getPushTemplates(args),
    providesTags: ['PushTemplates'],
  }),

  getPushMessageContentTokens: b.query<Result<GetPushMessageContentTokens>, Arg<GetPushMessageContentTokens>>({
    query: (args) => (norbix) => norbix.hub.notifications.getPushMessageContentTokens(args),
    providesTags: ['Push'],
  }),

  unArchivePushTemplate: b.mutation<Result<UnArchivePushTemplate>, Arg<UnArchivePushTemplate>>({
    query: (args) => (norbix) => norbix.hub.notifications.unArchivePushTemplate(args),
    invalidatesTags: ['PushTemplates'],
  }),

  updatePushTemplate: b.mutation<Result<UpdatePushTemplate>, Arg<UpdatePushTemplate>>({
    query: (args) => (norbix) => norbix.hub.notifications.updatePushTemplate(args),
    invalidatesTags: ['PushTemplates'],
  }),

  getPushSettings: b.query<Result<GetPushSettings>, Arg<GetPushSettings>>({
    query: (args) => (norbix) => norbix.hub.notifications.getPushSettings(args),
    providesTags: ['Push'],
  }),

  confirmPushIntegrationHumanDelivery: b.mutation<Result<ConfirmPushIntegrationHumanDelivery>, Arg<ConfirmPushIntegrationHumanDelivery>>({
    query: (args) => (norbix) => norbix.hub.notifications.confirmPushIntegrationHumanDelivery(args),
    invalidatesTags: ['PushIntegrations'],
  }),

  deletePushIntegration: b.mutation<Result<DeletePushIntegration>, Arg<DeletePushIntegration>>({
    query: (args) => (norbix) => norbix.hub.notifications.deletePushIntegration(args),
    invalidatesTags: ['PushIntegrations'],
  }),

  disablePushIntegration: b.mutation<Result<DisablePushIntegration>, Arg<DisablePushIntegration>>({
    query: (args) => (norbix) => norbix.hub.notifications.disablePushIntegration(args),
    invalidatesTags: ['PushIntegrations'],
  }),

  enablePushIntegration: b.mutation<Result<EnablePushIntegration>, Arg<EnablePushIntegration>>({
    query: (args) => (norbix) => norbix.hub.notifications.enablePushIntegration(args),
    invalidatesTags: ['PushIntegrations'],
  }),

  getPushIntegration: b.query<Result<GetPushIntegration>, Arg<GetPushIntegration>>({
    query: (args) => (norbix) => norbix.hub.notifications.getPushIntegration(args),
    providesTags: ['PushIntegrations'],
  }),

  getPushIntegrations: b.query<Result<GetPushIntegrations>, Arg<GetPushIntegrations>>({
    query: (args) => (norbix) => norbix.hub.notifications.getPushIntegrations(args),
    providesTags: ['PushIntegrations'],
  }),

  savePushIntegration: b.mutation<Result<SavePushIntegration>, Arg<SavePushIntegration>>({
    query: (args) => (norbix) => norbix.hub.notifications.savePushIntegration(args),
    invalidatesTags: ['PushIntegrations'],
  }),

  setPushIntegrationAsDefault: b.mutation<Result<SetPushIntegrationAsDefault>, Arg<SetPushIntegrationAsDefault>>({
    query: (args) => (norbix) => norbix.hub.notifications.setPushIntegrationAsDefault(args),
    invalidatesTags: ['PushIntegrations'],
  }),

  testPushIntegration: b.mutation<Result<TestPushIntegration>, Arg<TestPushIntegration>>({
    query: (args) => (norbix) => norbix.hub.notifications.testPushIntegration(args),
    invalidatesTags: ['PushIntegrations'],
  }),

  registerCodeMashAppPushIntegration: b.mutation<Result<RegisterCodeMashAppPushIntegration>, Arg<RegisterCodeMashAppPushIntegration>>({
    query: (args) => (norbix) => norbix.hub.notifications.registerCodeMashAppPushIntegration(args),
    invalidatesTags: ['PushIntegrations'],
  }),

  registerDevice: b.mutation<Result<RegisterDevice>, Arg<RegisterDevice>>({
    query: (args) => (norbix) => norbix.hub.notifications.registerDevice(args),
    invalidatesTags: ['Push'],
  }),

  createPushCampaign: b.mutation<Result<CreatePushCampaign>, Arg<CreatePushCampaign>>({
    query: (args) => (norbix) => norbix.hub.notifications.createPushCampaign(args),
    invalidatesTags: ['PushCampaigns'],
  }),

  deletePushCampaign: b.mutation<Result<DeletePushCampaign>, Arg<DeletePushCampaign>>({
    query: (args) => (norbix) => norbix.hub.notifications.deletePushCampaign(args),
    invalidatesTags: ['PushCampaigns'],
  }),

  getPushCampaign: b.query<Result<GetPushCampaign>, Arg<GetPushCampaign>>({
    query: (args) => (norbix) => norbix.hub.notifications.getPushCampaign(args),
    providesTags: ['PushCampaigns'],
  }),

  getPushCampaigns: b.query<Result<GetPushCampaigns>, Arg<GetPushCampaigns>>({
    query: (args) => (norbix) => norbix.hub.notifications.getPushCampaigns(args),
    providesTags: ['PushCampaigns'],
  }),

  getPushCampaignBatches: b.query<Result<GetPushCampaignBatches>, Arg<GetPushCampaignBatches>>({
    query: (args) => (norbix) => norbix.hub.notifications.getPushCampaignBatches(args),
    providesTags: ['PushCampaigns'],
  }),

  getPushCampaignBatchNotification: b.query<Result<GetPushCampaignBatchNotification>, Arg<GetPushCampaignBatchNotification>>({
    query: (args) => (norbix) => norbix.hub.notifications.getPushCampaignBatchNotification(args),
    providesTags: ['PushCampaigns'],
  }),

  getPushCampaignBatchNotifications: b.query<Result<GetPushCampaignBatchNotifications>, Arg<GetPushCampaignBatchNotifications>>({
    query: (args) => (norbix) => norbix.hub.notifications.getPushCampaignBatchNotifications(args),
    providesTags: ['PushCampaigns'],
  }),

  getPushCampaignStatistics: b.query<Result<GetPushCampaignStatistics>, Arg<GetPushCampaignStatistics>>({
    query: (args) => (norbix) => norbix.hub.notifications.getPushCampaignStatistics(args),
    providesTags: ['PushCampaigns'],
  }),

  getPushCampaignMessage: b.query<Result<GetPushCampaignMessage>, Arg<GetPushCampaignMessage>>({
    query: (args) => (norbix) => norbix.hub.notifications.getPushCampaignMessage(args),
    providesTags: ['PushCampaigns'],
  }),

  getPushCampaignMessages: b.query<Result<GetPushCampaignMessages>, Arg<GetPushCampaignMessages>>({
    query: (args) => (norbix) => norbix.hub.notifications.getPushCampaignMessages(args),
    providesTags: ['PushCampaigns'],
  }),

  createContact: b.mutation<Result<CreateContact>, Arg<CreateContact>>({
    query: (args) => (norbix) => norbix.hub.membership.createContact(args),
    invalidatesTags: ['Contacts'],
  }),

  deleteContact: b.mutation<Result<DeleteContact>, Arg<DeleteContact>>({
    query: (args) => (norbix) => norbix.hub.membership.deleteContact(args),
    invalidatesTags: ['Contacts'],
  }),

  getContact: b.query<Result<GetContact>, Arg<GetContact>>({
    query: (args) => (norbix) => norbix.hub.membership.getContact(args),
    providesTags: ['Contacts'],
  }),

  getAllContacts: b.query<Result<GetAllContacts>, Arg<GetAllContacts>>({
    query: (args) => (norbix) => norbix.hub.membership.getAllContacts(args),
    providesTags: ['Contacts'],
  }),

  mergeContacts: b.mutation<Result<MergeContacts>, Arg<MergeContacts>>({
    query: (args) => (norbix) => norbix.hub.membership.mergeContacts(args),
    invalidatesTags: ['Contacts'],
  }),

  grantContactConsent: b.mutation<Result<GrantContactConsent>, Arg<GrantContactConsent>>({
    query: (args) => (norbix) => norbix.hub.notifications.grantContactConsent(args),
    invalidatesTags: ['Contacts'],
  }),

  unsubscribeContact: b.mutation<Result<UnsubscribeContact>, Arg<UnsubscribeContact>>({
    query: (args) => (norbix) => norbix.hub.notifications.unsubscribeContact(args),
    invalidatesTags: ['Contacts'],
  }),

  addContactIdentity: b.mutation<Result<AddContactIdentity>, Arg<AddContactIdentity>>({
    query: (args) => (norbix) => norbix.hub.membership.addContactIdentity(args),
    invalidatesTags: ['Contacts'],
  }),

  promoteContactIdentity: b.mutation<Result<PromoteContactIdentity>, Arg<PromoteContactIdentity>>({
    query: (args) => (norbix) => norbix.hub.membership.promoteContactIdentity(args),
    invalidatesTags: ['Contacts'],
  }),

  removeContactIdentity: b.mutation<Result<RemoveContactIdentity>, Arg<RemoveContactIdentity>>({
    query: (args) => (norbix) => norbix.hub.membership.removeContactIdentity(args),
    invalidatesTags: ['Contacts'],
  }),
});
