import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
    name: 'fgbtheatersstoragef2bb9-dev',
    isDefault: true,
    access: (allow) => ({
      'public/*': [
        allow.guest.to(['read']),
        // allow.entity('identity').to(['read', 'write', 'delete'])
      ]
    })
  });