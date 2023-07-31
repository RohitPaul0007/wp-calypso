export { noop, LICENSE_INFO_MODAL_ID } from './lib/constants';
export { default as getLicenseState } from './lib/get-license-state';
export { default as valueToEnum } from './lib/value-to-enum';
export {
	publicToInternalLicenseFilter,
	internalToPublicLicenseFilter,
} from './lib/license-filters';
export {
	publicToInternalLicenseSortField,
	internalToPublicLicenseSortField,
} from './lib/license-sorters';
export { default as ensurePartnerPortalReturnUrl } from './lib/ensure-partner-portal-return-url';
export { default as formatApiPartner } from './lib/format-api-partner';
export { default as getProductTitle } from './lib/get-product-title';
export { default as selectAlphabeticallySortedProductOptions } from './lib/select-alphabetically-sorted-product-options';
export { default as isJetpackBundle } from './lib/is-jetpack-bundle';
export { default as areLicenseKeysAssignableToMultisite } from './lib/are-license-keys-assignable-to-multisite';

/**
 * Provided a license key or a product slug, can we trust that the product is a WooCommerce product
 *
 * @param keyOrSlug string
 * @returns boolean True if WC product, false if not
 */
export function isWooCommerceProduct( keyOrSlug: string ) {
	return keyOrSlug.startsWith( 'woocommerce' );
}
