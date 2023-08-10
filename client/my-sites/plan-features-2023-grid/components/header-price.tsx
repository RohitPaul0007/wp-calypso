import { isWpcomEnterpriseGridPlan, type PlanSlug } from '@automattic/calypso-products';
import styled from '@emotion/styled';
import { useTranslate } from 'i18n-calypso';
import PlanPrice from 'calypso/my-sites/plan-price';
import { usePlansGridContext } from '../grid-context';
import PlanFeatures2023GridBillingTimeframe from './billing-timeframe';

interface PlanFeatures2023GridHeaderPriceProps {
	planSlug: PlanSlug;
	isLargeCurrency: boolean;
	isPlanUpgradeCreditEligible: boolean;
	currentSitePlanSlug?: string | null;
	siteId?: number | null;
}

const PricesGroup = styled.div< { isLargeCurrency: boolean } >`
	justify-content: flex-end;
	display: flex;
	flex-direction: ${ ( props ) => ( props.isLargeCurrency ? 'column' : 'row-reverse' ) };
	align-items: ${ ( props ) => ( props.isLargeCurrency ? 'flex-start' : 'flex-end' ) };
	gap: 4px;
`;

const Badge = styled.div< { isPromoPrice?: boolean } >`
	white-space: nowrap;
	font-size: 0.75rem;
	font-weight: 500;
	letter-spacing: 0.2px;
	line-height: 1.25rem;
	border-radius: 4px;
	height: 21px;
	display: inline-block;
	width: fit-content;
	text-align: ${ ( { isPromoPrice } ) => ( isPromoPrice ? 'left' : 'center' ) };
	padding: ${ ( { isPromoPrice } ) => ( isPromoPrice ? '0 6px' : '0 12px' ) };
	background-color: ${ ( { isPromoPrice } ) =>
		isPromoPrice ? 'var( --studio-blue-0 )' : 'var( --studio-green-0 )' };
	color: ${ ( { isPromoPrice } ) =>
		isPromoPrice ? 'var( --studio-blue-40 )' : 'var( --studio-green-40 )' };
	text-decoration: ${ ( { isPromoPrice } ) => ( isPromoPrice ? 'line-through' : 'none' ) };
`;

const HeaderPriceContainer = styled.div`
	padding: 0 20px;
	margin: 0 0 4px 0;

	.plan-comparison-grid & {
		padding: 0;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	.plan-price {
		color: var( --studio-gray-100 );
		margin: 0;
		line-height: 1;
		display: flex;
		font-family: Recoleta, sans-serif;
	}

	.plan-price__currency-symbol,
	.plan-price.is-discounted .plan-price__currency-symbol {
		font-size: 14px;
		color: var( --studio-gray-100 );
		margin-top: 2px;
	}

	.plan-price__integer {
		font-size: 44px;
	}

	.plan-price__term {
		font-size: 12px;
		font-weight: 400;
	}

	.plan-price.is-original {
		color: var( --studio-gray-20 );

		text-decoration: line-through;
		text-decoration-thickness: 1px;
		font-family: 'SF Pro Text', sans-serif;
		margin-bottom: 5px;
		font-size: 18px;

		&::before {
			display: none;
		}

		.plan-price__currency-symbol,
		.plan-price__tax-amount {
			color: var( --color-text-subtle );
		}

		.plan-price__integer {
			font-size: 18px;
		}
		.plan-price__currency-symbol {
			font-size: 8px;
		}
	}

	.plan-price.is-discounted {
		color: var( --color-neutral-70 );

		.plans-grid-2023__html-price-display-wrapper {
			color: inherit;
		}
	}

	.plan-price.is-large-currency {
		.plan-price__integer {
			font-size: 30px;
		}
		&.is-original {
			.plan-price__integer {
				font-size: 16px;
			}
		}
	}
	.plan-features-2023-grid__badge {
		margin-bottom: 10px;
	}
`;

const PlanFeatures2023GridHeaderPrice = ( {
	planSlug,
	isLargeCurrency,
	isPlanUpgradeCreditEligible,
}: PlanFeatures2023GridHeaderPriceProps ) => {
	const translate = useTranslate();
	const { gridPlansIndex } = usePlansGridContext();
	const {
		pricing: { currencyCode, originalPrice, discountedPrice, promoPrice },
	} = gridPlansIndex[ planSlug ];
	const shouldShowDiscountedPrice = Boolean( discountedPrice.monthly );
	const isPricedPlan = null !== originalPrice.monthly;

	if ( isWpcomEnterpriseGridPlan( planSlug ) ) {
		return null;
	}

	return (
		<>
			{ isPricedPlan ? (
				<HeaderPriceContainer>
					{ promoPrice && (
						<>
							<Badge className="plan-features-2023-grid__badge" isPromoPrice={ true }>
								<PlanFeatures2023GridBillingTimeframe
									planSlug={ planSlug }
									isStrikeoutMonthlyPricingUsedForPromotion={ true }
								/>
							</Badge>
							<PlanPrice
								currencyCode={ currencyCode }
								rawPrice={ promoPrice.price }
								displayPerMonthNotation={ false }
								isLargeCurrency={ isLargeCurrency }
								priceDisplayWrapperClassName="plans-grid-2023__html-price-display-wrapper"
							/>
						</>
					) }
					{ ! promoPrice && shouldShowDiscountedPrice && (
						<>
							<Badge className="plan-features-2023-grid__badge">
								{ isPlanUpgradeCreditEligible
									? translate( 'Credit applied' )
									: translate( 'One time discount' ) }
							</Badge>
							<PricesGroup isLargeCurrency={ isLargeCurrency }>
								<PlanPrice
									currencyCode={ currencyCode }
									rawPrice={ originalPrice.monthly }
									displayPerMonthNotation={ false }
									isLargeCurrency={ isLargeCurrency }
									priceDisplayWrapperClassName="plans-grid-2023__html-price-display-wrapper"
									original
								/>
								<PlanPrice
									currencyCode={ currencyCode }
									rawPrice={ discountedPrice.monthly }
									displayPerMonthNotation={ false }
									isLargeCurrency={ isLargeCurrency }
									priceDisplayWrapperClassName="plans-grid-2023__html-price-display-wrapper"
									discounted
								/>
							</PricesGroup>
						</>
					) }
					{ ! promoPrice && ! shouldShowDiscountedPrice && (
						<PlanPrice
							currencyCode={ currencyCode }
							rawPrice={ originalPrice.monthly }
							displayPerMonthNotation={ false }
							isLargeCurrency={ isLargeCurrency }
							priceDisplayWrapperClassName="plans-grid-2023__html-price-display-wrapper"
						/>
					) }
				</HeaderPriceContainer>
			) : null }
		</>
	);
};

export default PlanFeatures2023GridHeaderPrice;
