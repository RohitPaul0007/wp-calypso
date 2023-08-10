import {
	isWpComFreePlan,
	isWpcomEnterpriseGridPlan,
	PLAN_BIENNIAL_PERIOD,
	PLAN_ANNUAL_PERIOD,
	PLAN_TRIENNIAL_PERIOD,
	PlanSlug,
	getPlanSlugForTermVariant,
	TERM_ANNUALLY,
	isWooExpressPlan,
	PLAN_MONTHLY_PERIOD,
} from '@automattic/calypso-products';
import { formatCurrency } from '@automattic/format-currency';
import styled from '@emotion/styled';
import { useTranslate } from 'i18n-calypso';
import { usePlansGridContext } from '../grid-context';

function usePerMonthDescription( {
	planSlug,
	isStrikeoutMonthlyPricingUsedForPromotion,
}: {
	planSlug: PlanSlug;
	isStrikeoutMonthlyPricingUsedForPromotion?: boolean;
} ) {
	const translate = useTranslate();
	const { helpers, gridPlansIndex, intent } = usePlansGridContext();
	const {
		isMonthlyPlan,
		pricing: { currencyCode, originalPrice, discountedPrice, billingPeriod },
	} = gridPlansIndex[ planSlug ];

	if ( isWpComFreePlan( planSlug ) || isWpcomEnterpriseGridPlan( planSlug ) ) {
		return null;
	}

	// shorter pricing descriptions used when promotions are active and strikeout monthly pricing is needed
	// these take precedence over the other pricing descriptions
	if ( isStrikeoutMonthlyPricingUsedForPromotion ) {
		const discountedPriceMonthlyText =
			currencyCode && discountedPrice?.monthly
				? formatCurrency( discountedPrice.monthly, currencyCode, { stripZeros: true } )
				: null;
		const originalPriceMonthlyText =
			currencyCode && originalPrice?.monthly
				? formatCurrency( originalPrice.monthly, currencyCode, { stripZeros: true } )
				: null;
		const priceText = discountedPriceMonthlyText || originalPriceMonthlyText;

		if ( priceText ) {
			if ( PLAN_MONTHLY_PERIOD === billingPeriod ) {
				return translate( '%(priceText)s/month', {
					args: { priceText },
				} );
			}

			if ( PLAN_ANNUAL_PERIOD === billingPeriod ) {
				return translate( '%(priceText)s/month, billed annually', {
					args: { priceText },
				} );
			}

			if ( PLAN_BIENNIAL_PERIOD === billingPeriod ) {
				return translate( '%(priceText)s/month, billed biennially', {
					args: { priceText },
				} );
			}

			if ( PLAN_TRIENNIAL_PERIOD === billingPeriod ) {
				return translate( '%(priceText)s/month, billed triennially', {
					args: { priceText },
				} );
			}
		}

		return null;
	}

	// We want the yearly-variant plan's price to be the raw price the user
	// would pay if they choose an annual plan instead of the monthly one. So pro-rated
	// (or other) credits should not apply.
	const yearlyVariantPlanSlug =
		getPlanSlugForTermVariant( planSlug, TERM_ANNUALLY ) ?? ( '' as PlanSlug );
	const yearlyVariantPricing = helpers?.usePricingMetaForGridPlans( {
		planSlugs: [ yearlyVariantPlanSlug ],
		plansIntent: intent,
		withoutProRatedCredits: true,
	} )[ yearlyVariantPlanSlug ];

	if ( isMonthlyPlan && originalPrice?.monthly && yearlyVariantPricing ) {
		const yearlyVariantMaybeDiscountedPrice =
			yearlyVariantPricing.discountedPrice?.monthly || yearlyVariantPricing.originalPrice?.monthly;

		if (
			yearlyVariantMaybeDiscountedPrice &&
			yearlyVariantMaybeDiscountedPrice < originalPrice.monthly
		) {
			return translate( `Save %(discountRate)s%% by paying annually`, {
				args: {
					discountRate: Math.floor(
						( 100 * ( originalPrice.monthly - yearlyVariantMaybeDiscountedPrice ) ) /
							originalPrice.monthly
					),
				},
			} );
		}

		return null;
	}

	const discountedPriceFullTermText =
		currencyCode && discountedPrice?.full
			? formatCurrency( discountedPrice.full, currencyCode, { stripZeros: true } )
			: null;
	const originalPriceFullTermText =
		currencyCode && originalPrice?.full
			? formatCurrency( originalPrice.full, currencyCode, { stripZeros: true } )
			: null;

	if ( discountedPriceFullTermText ) {
		if ( PLAN_ANNUAL_PERIOD === billingPeriod ) {
			return translate(
				'per month, %(fullTermDiscountedPriceText)s for the first year, Excl. Taxes',
				{
					args: { fullTermDiscountedPriceText: discountedPriceFullTermText },
					comment: 'Excl. Taxes is short for excluding taxes',
				}
			);
		}

		if ( PLAN_BIENNIAL_PERIOD === billingPeriod ) {
			return translate(
				'per month, %(fullTermDiscountedPriceText)s for the first two years, Excl. Taxes',
				{
					args: { fullTermDiscountedPriceText: discountedPriceFullTermText },
					comment: 'Excl. Taxes is short for excluding taxes',
				}
			);
		}

		if ( PLAN_TRIENNIAL_PERIOD === billingPeriod ) {
			return translate(
				'per month, %(fullTermDiscountedPriceText)s for the first three years, Excl. Taxes',
				{
					args: { fullTermDiscountedPriceText: discountedPriceFullTermText },
					comment: 'Excl. Taxes is short for excluding taxes',
				}
			);
		}
	} else if ( originalPriceFullTermText ) {
		if ( PLAN_ANNUAL_PERIOD === billingPeriod ) {
			return translate( 'per month, %(rawPrice)s billed annually, Excl. Taxes', {
				args: { rawPrice: originalPriceFullTermText },
				comment: 'Excl. Taxes is short for excluding taxes',
			} );
		}

		if ( PLAN_BIENNIAL_PERIOD === billingPeriod ) {
			return translate( 'per month, %(rawPrice)s billed every two years, Excl. Taxes', {
				args: { rawPrice: originalPriceFullTermText },
				comment: 'Excl. Taxes is short for excluding taxes',
			} );
		}

		if ( PLAN_TRIENNIAL_PERIOD === billingPeriod ) {
			return translate( 'per month, %(rawPrice)s billed every three years, Excl. Taxes', {
				args: { rawPrice: originalPriceFullTermText },
				comment: 'Excl. Taxes is short for excluding taxes',
			} );
		}
	}

	return null;
}

const DiscountPromotion = styled.div`
	text-transform: uppercase;
	font-weight: 600;
	color: #306e27;
	font-size: $font-body-extra-small;
	margin-top: 6px;
`;

interface Props {
	planSlug: PlanSlug;
	// for shorter pricing descriptions used when promotions are active and strikeout monthly pricing is needed
	isStrikeoutMonthlyPricingUsedForPromotion?: boolean;
}

const PlanFeatures2023GridBillingTimeframe = ( {
	planSlug,
	isStrikeoutMonthlyPricingUsedForPromotion,
}: Props ) => {
	const translate = useTranslate();
	const { gridPlansIndex } = usePlansGridContext();
	const { isMonthlyPlan, billingTimeframe, pricing } = gridPlansIndex[ planSlug ];
	const perMonthDescription = usePerMonthDescription( {
		planSlug,
		isStrikeoutMonthlyPricingUsedForPromotion,
	} );
	const description =
		( ! isStrikeoutMonthlyPricingUsedForPromotion && pricing.promoPrice?.description ) ||
		perMonthDescription ||
		billingTimeframe;

	if ( isWooExpressPlan( planSlug ) && isMonthlyPlan && ! pricing.promoPrice ) {
		return (
			<div>
				<div>{ billingTimeframe }</div>
				<DiscountPromotion>{ perMonthDescription }</DiscountPromotion>
			</div>
		);
	}

	if ( isWpcomEnterpriseGridPlan( planSlug ) ) {
		const price = formatCurrency( 25000, 'USD' );

		return (
			<div className="plan-features-2023-grid__vip-price">
				{ translate( 'Starts at {{b}}%(price)s{{/b}} yearly', {
					args: { price },
					components: { b: <b /> },
					comment: 'Translators: the price is in US dollars for all users (US$25,000)',
				} ) }
			</div>
		);
	}

	return <div>{ description }</div>;
};

export default PlanFeatures2023GridBillingTimeframe;
