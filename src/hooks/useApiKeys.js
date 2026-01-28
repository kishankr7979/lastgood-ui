import { useQuery } from '@tanstack/react-query';
import { useOrganization } from './useOrganization';
import { getAPIKeyByOrg } from '../service/api-key';

export const useApiKeys = () => {
    const { data: organization } = useOrganization();

    const { data: apiKeys, isLoading, error, refetch } = useQuery({
        queryKey: ['apiKeys', organization?.id],
        queryFn: () => getAPIKeyByOrg(organization.id),
        enabled: !!organization?.id,
        retry: false,
    });

    const hasApiKeys = !!(apiKeys && apiKeys.key_hash);

    return { apiKeys, hasApiKeys, isLoading, error, refetch };
};
