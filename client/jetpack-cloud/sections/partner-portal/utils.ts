import sortBy from 'lodash/sortBy';
import {
	LicenseFilter,
	LicenseSortField,
} from 'calypso/jetpack-cloud/sections/partner-portal/types';
import {
	APIPartner,
	Partner,
	APIProductFamily,
	APIProductFamilyProduct,
} from 'calypso/state/partner-portal/types';

/**
 * Noop which can be reused (e.g. in equality checks).
 *
 * @returns {void}
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop() {}

export { default as getLicenseState } from './lib/get-license-state';

/**
 * Convert a value to a the enum member with that value or a fallback.
 * This is a hack around TypeScript's poor support of enums as types.
 *
 * @example const enumMember = valueToEnum< SomeEnumType >( SomeEnumType, 'foo', SomeEnumType.SomeMember );
 * @template T
 * @param {Record< string, * >} enumType Enum type to search in.
 * @param {*} value The enum value we are looking to get the member for.
 * @param {*} fallback The fallback value in case value is not a member of enumType.
 * @returns {T} T for value or fallback
 */
export function valueToEnum< T >(
	enumType: Record< string, unknown >,
	value: unknown,
	fallback: unknown
): T {
	return Object.values( enumType ).includes( value ) ? ( value as T ) : ( fallback as T );
}

const internalFilterMap = {
	[ LicenseFilter.NotRevoked ]: '',
	[ LicenseFilter.Attached ]: 'assigned',
	[ LicenseFilter.Detached ]: 'unassigned',
} as { [ key: string ]: string };

const publicFilterMap = {
	[ internalFilterMap[ LicenseFilter.Attached ] ]: LicenseFilter.Attached,
	[ internalFilterMap[ LicenseFilter.Detached ] ]: LicenseFilter.Detached,
} as { [ key: string ]: LicenseFilter };

/**
 * Convert a public license filter to its internal representation.
 * Public filter differences are entirely cosmetic.
 *
 * @param {string} publicFilter Public filter value (e.g. "assigned").
 * @param {LicenseFilter} fallback Filter to return if publicFilter is invalid.
 * @returns {LicenseFilter} Internal filter.
 */
export function publicToInternalLicenseFilter(
	publicFilter: string,
	fallback: LicenseFilter
): LicenseFilter {
	return valueToEnum< LicenseFilter >(
		LicenseFilter,
		publicFilterMap[ publicFilter ] || publicFilter,
		fallback
	);
}

/**
 * Convert an internal license filter to its public representation.
 * Public filter differences are entirely cosmetic.
 *
 * @param {LicenseFilter} internalFilter Internal filter (e.g. LicenseFilter.Attached).
 * @returns {string} Public filter.
 */
export function internalToPublicLicenseFilter( internalFilter: LicenseFilter ): string {
	return internalFilterMap[ internalFilter ] || internalFilter;
}

const internalSortFieldMap = {
	[ LicenseSortField.AttachedAt ]: 'assigned_on',
} as { [ key: string ]: string };

const publicSortFieldMap = {
	[ internalSortFieldMap[ LicenseSortField.AttachedAt ] ]: LicenseSortField.AttachedAt,
} as { [ key: string ]: LicenseSortField };

/**
 * Convert a public license sort field to its internal representation.
 * Public sort field differences are entirely cosmetic.
 *
 * @param {string} publicSortField Public sort field value (e.g. "assigned_on").
 * @param {LicenseSortField} fallback Sort field to return if publicSortField is invalid.
 * @returns {LicenseSortField} Internal sort field.
 */
export function publicToInternalLicenseSortField(
	publicSortField: string,
	fallback: LicenseSortField
): LicenseSortField {
	return valueToEnum< LicenseSortField >(
		LicenseSortField,
		publicSortFieldMap[ publicSortField ] || publicSortField,
		fallback
	);
}

/**
 * Convert an internal license sort field to its public representation.
 * Public sort field differences are entirely cosmetic.
 *
 * @param {LicenseSortField} internalSortField Internal sort field (e.g. LicenseSortField.AttachedAt).
 * @returns {string} Public sort field.
 */
export function internalToPublicLicenseSortField( internalSortField: LicenseSortField ): string {
	return internalSortFieldMap[ internalSortField ] || internalSortField;
}

/**
 * Check if the given URL belongs to the Partner Portal. If true, returns the URL, otherwise it returns the
 *  Partner Portal base URL: '/partner-portal'
 *
 * @param {string} returnToUrl The URL that
 * @returns {string} The right URL to return to
 */
export function ensurePartnerPortalReturnUrl( returnToUrl: string ): string {
	return returnToUrl && returnToUrl.startsWith( '/partner-portal' )
		? returnToUrl
		: '/partner-portal';
}

/**
 * Format an APIPartner instance to a store-friendly Partner instance.
 *
 * @param {APIPartner} partner API partner object to format.
 * @returns {Partner} Formatted store-friendly Partner object.
 */
export function formatApiPartner( partner: APIPartner ): Partner {
	return {
		...partner,
		keys: partner.keys.map( ( key ) => ( {
			id: key.id,
			name: key.name,
			oAuth2Token: key.oauth2_token,
			disabledOn: key.disabled_on,
			hasLicenses: key.has_licenses,
		} ) ),
	};
}

/**
 * Format the string by removing Jetpack, (, ) from the product name
 *
 * @param product Product name
 * @returns Product title
 */
export function getProductTitle( product: string ): string {
	if ( 'Jetpack AI' === product ) {
		return 'AI Assistant';
	}

	return product.replace( /(?:Jetpack\s|[)(])/gi, '' );
}

export function selectProductOptions( families: APIProductFamily[] ): APIProductFamilyProduct[] {
	return families.flatMap( ( family ) => family.products );
}

export function selectAlphabeticallySortedProductOptions(
	families: APIProductFamily[]
): APIProductFamilyProduct[] {
	return sortBy( selectProductOptions( families ), ( product ) => product.name );
}

export { default as isJetpackBundle } from './lib/is-jetpack-bundle';

/**
 * Whether the licenses are assignable to WP multisite. This function uses key prefix to determine
 * if the license is compatible with multisite.
 *
 * @param {Array<string>} licenseKeys
 * @returns {boolean} indicating if the license keys are assignable to multisite
 */
export function areLicenseKeysAssignableToMultisite( licenseKeys: Array< string > ): boolean {
	// If any license keys are not Jetpack Backup or Scan, they can be assigned to multisite.
	return licenseKeys.some( ( key ) => ! /^jetpack-(backup|scan)/.test( key ) );
}

export const LICENSE_INFO_MODAL_ID = 'show_license_modal';

/**
 * Provided a license key or a product slug, can we trust that the product is a WooCommerce product
 *
 * @param keyOrSlug string
 * @returns boolean True if WC product, false if not
 */
export function isWooCommerceProduct( keyOrSlug: string ) {
	return keyOrSlug.startsWith( 'woocommerce' );
}
