import { StarIcon } from 'lucide-react';
import { INPUT_RATING_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/input-rating-policy.js';

export function RatingStars({ value, length }: { value: number; length: number }) {
  return Array.from({ length }, (_, index) => {
    const filled = value - index;
    return (
      <span className="reacd-rating-star" key={index} aria-hidden="true">
        <StarIcon />
        {filled >= INPUT_RATING_POLICY.half ? (
          <StarIcon
            className="reacd-rating-star-fill"
            data-half={filled < INPUT_RATING_POLICY.step}
          />
        ) : null}
      </span>
    );
  });
}
