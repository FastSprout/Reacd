import { Carousel } from '../../../components/carousel/index.js';
export const CAROUSEL_EXAMPLES = {
  Carousel: (
    <Carousel
      label="Example slides"
      value={0}
      onValueChange={() => undefined}
      items={[{ id: 'one', label: 'First' }]}
    />
  ),
};
