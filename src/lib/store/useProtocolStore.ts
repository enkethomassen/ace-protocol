'use client';

import { create } from 'zustand';

interface ProtocolUiState {
  isSimulationMode: boolean;
  isOnboarded: boolean;
  setSimulationMode: (value: boolean) => void;
  setOnboarded: (value: boolean) => void;
}

export const useProtocolStore = create<ProtocolUiState>((set) => ({
  isSimulationMode: true,
  isOnboarded: false,
  setSimulationMode: (value) => set({ isSimulationMode: value }),
  setOnboarded: (value) => set({ isOnboarded: value }),
}));
