import { WpcomPlansUI } from '@automattic/data-stores';
import { CustomSelectControl } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { TranslateResult, useTranslate } from 'i18n-calypso';
import { usePlansGridContext } from '../grid-context';
import { getStorageStringFromFeature } from '../util';
import type { PlanSlug, StorageOption, WPComStorageAddOnSlug } from '@automattic/calypso-products';

type StorageAddOnDropdownProps = {
	planSlug: PlanSlug;
	storageOptions: StorageOption[];
};

export const StorageAddOnDropdown = ( { planSlug, storageOptions }: StorageAddOnDropdownProps ) => {
	const translate = useTranslate();
	const { gridPlansIndex } = usePlansGridContext();
	const { storageAddOnsForPlan } = gridPlansIndex[ planSlug ];
	const { setSelectedStorageOptionForPlan } = useDispatch( WpcomPlansUI.store );
	const selectedStorageOptionForPlan = useSelect(
		( select ) => {
			return select( WpcomPlansUI.store ).getStorageAddOnForPlan( planSlug );
		},
		[ planSlug ]
	);

	// TODO: Consider transforming storageOptions outside of this component
	const selectControlOptions = storageOptions.reduce( ( acc, storageOption ) => {
		const cost = storageAddOnsForPlan?.find( ( addOn ) => {
			return addOn?.featureSlugs?.includes( storageOption.slug );
		} )?.costData?.formattedMonthlyCost;
		const title = getStorageStringFromFeature( storageOption.slug );
		const name = `${ title } ${ cost ? cost : '' }`;
		if ( title ) {
			acc.push( {
				key: storageOption?.slug,
				name,
			} );
		}

		return acc;
	}, [] as { key: string; name: TranslateResult }[] );

	const defaultStorageOption = storageOptions.find( ( storageOption ) => ! storageOption?.isAddOn );
	const selectedOptionKey = selectedStorageOptionForPlan || defaultStorageOption?.slug || '';
	const selectedOption = {
		key: selectedOptionKey,
		name: getStorageStringFromFeature( selectedOptionKey ),
	};
	return (
		<CustomSelectControl
			label={ translate( 'Storage' ) }
			options={ selectControlOptions }
			value={ selectedOption }
			onChange={ ( { selectedItem }: { selectedItem: { key: WPComStorageAddOnSlug } } ) =>
				setSelectedStorageOptionForPlan( { addOnSlug: selectedItem?.key || '', planSlug } )
			}
		/>
	);
};

export default StorageAddOnDropdown;
