import { Card } from '@automattic/components';
import { useTranslate } from 'i18n-calypso';
import SettingsSectionHeader from 'calypso/my-sites/site-settings/settings-section-header';
import { BlogPagesSetting, BLOG_PAGES_OPTION } from './BlogPagesSetting';

type Fields = {
	posts_per_page?: number;
};

type SiteSettingsSectionProps = {
	fields: Fields;
	onChangeField: ( field: string ) => ( event: React.ChangeEvent< HTMLInputElement > ) => void;
	handleSubmitForm: ( event: React.FormEvent< HTMLFormElement > ) => void;
	disabled?: boolean;
	isSavingSettings?: boolean;
};

export const SiteSettingsSection = ( {
	fields,
	onChangeField,
	handleSubmitForm,
	disabled,
	isSavingSettings,
}: SiteSettingsSectionProps ) => {
	const translate = useTranslate();
	const { posts_per_page } = fields;

	return (
		<>
			{ /* @ts-expect-error SettingsSectionHeader is not typed and is causing errors */ }
			<SettingsSectionHeader
				title={ translate( 'Site settings' ) }
				showButton
				onButtonClick={ handleSubmitForm }
				disabled={ disabled }
				isSaving={ isSavingSettings }
			/>
			<Card>
				<BlogPagesSetting
					value={ posts_per_page }
					onChange={ onChangeField( BLOG_PAGES_OPTION ) }
					disabled={ disabled }
				/>
			</Card>
		</>
	);
};
