import { create } from 'zustand';

const useOrgStore = create((set) => ({
    org: null,
    setOrg: (org) => set({ org }),
}));

export default useOrgStore;
