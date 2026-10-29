import { atom, useAtom } from 'jotai';
import { App, Section, Toggle, VStack } from 'reacd';
import { PricingPlanExample } from '../../docs/examples/pricing-plan.js';
import { PricingPlansExample } from '../../docs/examples/pricing-plans.js';
import { PricingTableExample } from '../../docs/examples/pricing-table.js';

const rtlAtom = atom(false);

export function PricingExamples() {
  const [rtl, setRtl] = useAtom(rtlAtom);
  return (
    <Section title="Pricing components">
      <Toggle label="Pricing RTL" checked={rtl} onCheckedChange={setRtl} />
      <App direction={rtl ? 'rtl' : 'ltr'} language="en">
        <VStack>
          <PricingPlanExample />
          <PricingPlansExample />
          <PricingTableExample />
        </VStack>
      </App>
    </Section>
  );
}
