// `norbix.hub.integrations` — the keyless cloud connection setup.
// Hand-written like the generated factories; 1:1 with the core SDK method.
import type { Norbix } from '@norbix.ai/ts';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type GetKeylessIntegrationSetup = Norbix['hub']['integrations']['getKeylessIntegrationSetup'];

/**
 * `hub.integrations` — helpers shared by the integrations of every module.
 *
 * `getKeylessIntegrationSetup` (`GET /{version}/integrations/keyless/setup`)
 * returns what a developer pastes into the cloud account before saving a
 * keyless files / email / code integration: the integration id to save with,
 * the issuer, subject and audience, whether keyless is available (with the
 * reason when not), the setup script and `templates` — templates: ready
 * CloudFormation / Bicep / Terraform files for this integration. It reads nothing cached elsewhere
 * and changes nothing, so it carries no cache tags.
 */
export const hubIntegrations = (b: Builder) => ({
  getKeylessIntegrationSetup: b.query<
    Result<GetKeylessIntegrationSetup>,
    Arg<GetKeylessIntegrationSetup>
  >({
    query: (args) => (norbix) => norbix.hub.integrations.getKeylessIntegrationSetup(args),
  }),
});
