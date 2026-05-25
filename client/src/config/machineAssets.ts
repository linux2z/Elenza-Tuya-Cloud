export interface MachineProduct {
  id: string;
  name: string;
  tagline: string;
  pid: string;
  assets: {
    hero: string;
    sideView?: string;
    frontView?: string;
  };
  metadata: {
    finish: string;
    accents: string;
    boilerType: string;
  };
}

export const ELENZA_PRODUCTS: Record<string, MachineProduct> = {
  'elenza-pro': {
    id: 'elenza-pro',
    name: 'Elenza Pro',
    tagline: 'Enterprise Smart IoT Espresso System',
    pid: 'zt36shl6ah0sffsj',
    assets: {
      hero: '/assets/machines/elenza-pro/hero-placement.png',
    },
    metadata: {
      finish: 'Matte Black',
      accents: 'Brushed Gold',
      boilerType: 'Dual Thermoblock',
    }
  },
  'elenza-mini': {
    id: 'elenza-mini',
    name: 'Elenza Mini',
    tagline: 'Compact Smart Home Espresso Platform',
    pid: 'zt36shl6ah0sffsj-mini',
    assets: {
      hero: '/assets/machines/elenza-mini/hero.png',
    },
    metadata: {
      finish: 'Brushed Chrome',
      accents: 'Matte Black',
      boilerType: 'Single Thermoblock',
    }
  }
};

export const ACTIVE_MACHINE_KEY = 'elenza-pro';
export const activeMachine = ELENZA_PRODUCTS[ACTIVE_MACHINE_KEY];
