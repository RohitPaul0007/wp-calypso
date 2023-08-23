import { useLocalizeUrl } from '@automattic/i18n-utils';
import { useTranslate } from 'i18n-calypso';
import globe from 'calypso/assets/images/domains/globe.svg';
import { Banner } from 'calypso/components/banner';
// import { useDispatch, useSelector } from 'calypso/state';

import './style.scss';

const GoogleDomainOwnerBanner = () => {
	const translate = useTranslate();
	const localizeUrl = useLocalizeUrl();

	return (
		<Banner
			className="google-domain-owner-banner"
			title={ translate( 'Reclaim your Google domains' ) }
			description={ translate(
				'Transfer your domains to WordPress.com now—we’ll lower our prices to match, and pay for an extra year'
			) }
			callToAction={ translate( 'Learn more' ) }
			disableCircle
			event="learn-more"
			iconPath={ globe }
			href={ localizeUrl( 'https://wordpress.com/transfer-google-domains/' ) }
			tracksClickName="calypso_google_domain_owner_click"
			tracksImpressionName="calypso_google_domain_owner_impression"
		/>
	);
};

export default GoogleDomainOwnerBanner;
