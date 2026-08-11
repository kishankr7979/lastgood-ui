import { useQuery } from "@tanstack/react-query";
import { getOrganizationCount } from "../service/organization";

export const MAX_BETA_ORGS = 20;

export const useOrganizationCount = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["organizationCount"],
    queryFn: getOrganizationCount,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  const count = typeof data === 'number' ? data : 0;
  const isLimitReached = count >= MAX_BETA_ORGS;

  return {
    count,
    maxOrgs: MAX_BETA_ORGS,
    isLimitReached,
    isLoading,
    isError,
    error,
    refetch,
  };
};
