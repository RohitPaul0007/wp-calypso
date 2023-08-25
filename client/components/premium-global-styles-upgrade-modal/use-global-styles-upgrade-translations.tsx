import { PLAN_PREMIUM, PLAN_PERSONAL, getPlan } from '@automattic/calypso-products';
import { useTranslate } from 'i18n-calypso';

interface Props {
	globalStylesInPersonalPlan?: boolean;
	numOfSelectedGlobalStyles?: number;
}

const useGlobalStylesUpgradeTranslations = ( {
	globalStylesInPersonalPlan,
	numOfSelectedGlobalStyles = 1,
}: Props ) => {
	const translate = useTranslate();
	const productSlug = globalStylesInPersonalPlan ? PLAN_PERSONAL : PLAN_PREMIUM;
	const plan = getPlan( productSlug );
	const features = {
		personal: [
			<strong>{ translate( 'Free domain for one year' ) }</strong>,
			<strong>{ translate( 'Style customization' ) }</strong>,
			translate( 'Support via email' ),
			translate( 'Ad-free experience' ),
		],
		premium: [
			<strong>{ translate( 'Free domain for one year' ) }</strong>,
			<strong>{ translate( 'Premium themes' ) }</strong>,
			translate( 'Style customization' ),
			translate( 'Live chat support' ),
			translate( 'Ad-free experience' ),
			translate( 'Earn with WordAds' ),
		],
	};

	return {
		featuresTitle: translate( 'Included with your %(planTitle)s plan', {
			args: { planTitle: plan?.getTitle() ?? '' },
		} ),
		features: globalStylesInPersonalPlan ? features.personal : features.premium,
		description: translate(
			'You’ve selected a custom style that will only be visible to visitors after upgrading to the %(planTitle)s plan or higher.',
			'You’ve selected custom styles that will only be visible to visitors after upgrading to the %(planTitle)s plan or higher.',
			{
				count: numOfSelectedGlobalStyles,
				args: { planTitle: plan?.getTitle() ?? '' },
			}
		),
		promotion: translate(
			'Upgrade now to unlock your custom style and get access to tons of other features. Or you can decide later and try it out first.',
			'Upgrade now to unlock your custom styles and get access to tons of other features. Or you can decide later and try them out first.',
			{ count: numOfSelectedGlobalStyles }
		),
		cancel: translate( 'Decide later' ),
		upgrade: translate( 'Upgrade plan' ),
		upgradeWithPlan: translate( 'Get %(planTitle)s', {
			args: { planTitle: plan?.getTitle() ?? '' },
		} ),
	};
};

export default useGlobalStylesUpgradeTranslations;
