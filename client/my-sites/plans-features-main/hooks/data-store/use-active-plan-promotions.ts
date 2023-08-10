import {
	type PlanSlug,
	TYPE_PERSONAL,
	TYPE_PREMIUM,
	findPlansKeys,
} from '@automattic/calypso-products';
import { type TranslateResult, useTranslate } from 'i18n-calypso';
import { useSelector } from 'react-redux';
import type { PlansIntent } from 'calypso/my-sites/plan-features-2023-grid/hooks/npm-ready/data-store/use-grid-plans';
import type { IAppState } from 'calypso/state/types';

export interface Promotion {
	productSlug: string;
	active: boolean;
	price: number;
	description?: TranslateResult;
	// plan-types is general, so TYPE_PERSONAL will match all personal plans (monthly, yearly, biennially, etc.)
	applicablePlanTypes?: string[];
	// plan-slugs is specific, so PLAN_PERSONAL will only match the yearly personal plan
	applicablePlanSlugs?: PlanSlug[];
	applicablePlansIntents: PlansIntent[];
}

interface Props {
	planSlugs: PlanSlug[];
	plansIntent: PlansIntent;
}

export type UseActivePlanPromotion = ( props: Props ) => {
	[ planSlug: string ]: Promotion;
};

/**
 * Returns matching active plan promotions for given set of planSlugs and plans intent.
 * Caveat: If multiple active promotions match the same planSlug and plansIntent, only the first will be returned.
 */
const useActivePlanPromotions: UseActivePlanPromotion = ( { planSlugs, plansIntent } ) => {
	const translate = useTranslate();
	const promotions = [
		{
			productSlug: 'foo',
			active: true,
			applicablePlanTypes: [ TYPE_PERSONAL, TYPE_PREMIUM ],
			applicablePlansIntents: [ 'plans-default-wpcom' ],
			price: 1,
			description: translate( 'per month, for your first 3 months' ),
		},
	] as Promotion[];

	const availablePlanPromotions = useSelector( ( state: IAppState ) => {
		// TODO - can use Calypso state for availability depending on current site plan, plan slug, etc.

		return planSlugs.reduce( ( acc, planSlug ) => {
			const availablePromotion = promotions.find(
				( { applicablePlanSlugs, applicablePlanTypes, applicablePlansIntents, active } ) => {
					const applicableForPlanSlug =
						applicablePlanSlugs?.includes( planSlug ) ||
						applicablePlanTypes?.find( ( type ) => findPlansKeys( { type } ).includes( planSlug ) );

					// TODO:
					// - may need to add a check on planSlug being available for purchase (otherwise we'd be showing promotional prices
					// for plans that are not purchasable / grayed out in the UI)
					// - see isPlanAvailableForPurchase in use-pricing-meta-for-grid-plans for same logic

					return applicableForPlanSlug && applicablePlansIntents.includes( plansIntent ) && active;
				}
			);

			if ( ! availablePromotion ) {
				return acc;
			}

			return {
				...acc,
				[ planSlug ]: availablePromotion,
			};
		}, {} as { [ planSlug: string ]: Promotion } );
	} );

	return availablePlanPromotions;
};

export default useActivePlanPromotions;
