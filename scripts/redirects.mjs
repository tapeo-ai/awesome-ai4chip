import { base, withBase } from './site.mjs';

// Keep shared URLs working when a resource moves to a new category.
export const movedPages = {
  'guide': '#guide',
  'environments': 'resources/ai-model/harbor-examples',
  'environments/index': 'resources/ai-model/harbor-examples',
  'environments/fw_c14_overcomplete_banks_v1': 'resources/ai-model/harbor-examples',
  'tutorials': '#guide',
  'guide/index': '#guide',
  'guide/tutorials': '#guide',
  'guide/eda-101': 'resources/eda/eda-101',
  'resources/data': 'resources/ai-model/data',
  'resources/benchmarks': 'resources/ai-model/benchmark',
  'resources/models/llm': 'resources/ai-model/training',
  'resources/models/circuit': 'resources/eda/optimization',
  'resources/optimization': 'resources/eda/optimization',
  'resources/tools': 'resources/eda/open-source',
  'resources/products': 'resources/eda/closed-source',
  'resources/agents': 'resources/eda/ai-eda',
  'resources/codesign/models-hardware': 'resources/chip-for-ai/hardware-aware-ml',
  'resources/codesign/chips-cim': 'resources/chip-for-ai/dsa',
  'resources/codesign/architecture-infra': 'resources/chip-for-ai/dse',
  'resources/codesign/kernels': 'resources/chip-for-ai/kernel-optimization',
};

export function pageRedirects(siteBase = base) {
  return Object.fromEntries(['', 'en/'].flatMap(prefix =>
    Object.entries(movedPages).map(([from, to]) =>
      [`/${prefix}${from}`, withBase(`/${prefix}${to}`, siteBase)])));
}
