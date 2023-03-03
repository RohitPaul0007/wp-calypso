import { Button } from '@automattic/components';
import {
	__experimentalNavigatorBackButton as NavigatorBackButton,
	__experimentalUseNavigator as useNavigator,
} from '@wordpress/components';
import { useTranslate } from 'i18n-calypso';
import NavigatorHeader from './navigator-header';
import PatternLayout from './pattern-layout';
import type { Pattern } from './types';

interface Props {
	patterns: Pattern[];
	onDoneClick: () => void;
	onAddSection: () => void;
	onReplaceSection: ( position: number ) => void;
	onDeleteSection: ( position: number ) => void;
	onMoveUpSection: ( position: number ) => void;
	onMoveDownSection: ( position: number ) => void;
}

const ScreenHomepage = ( {
	patterns,
	onDoneClick,
	onAddSection,
	onReplaceSection,
	onDeleteSection,
	onMoveUpSection,
	onMoveDownSection,
}: Props ) => {
	const translate = useTranslate();
	const navigator = useNavigator();
	const goToPatternList = () => navigator.goTo( '/homepage/patterns' );

	return (
		<>
			<NavigatorHeader
				title={ translate( 'Create your home' ) }
				description={ translate(
					'Add patterns and then re-arrange them to create the structure of your homepage.'
				) }
			/>
			<div className="screen-container__body">
				<PatternLayout
					sections={ patterns }
					onAddSection={ () => {
						onAddSection();
						goToPatternList();
					} }
					onReplaceSection={ ( position ) => {
						onReplaceSection( position );
						goToPatternList();
					} }
					onDeleteSection={ onDeleteSection }
					onMoveUpSection={ onMoveUpSection }
					onMoveDownSection={ onMoveDownSection }
				/>
			</div>
			<div className="screen-container__footer">
				<NavigatorBackButton
					as={ Button }
					className="pattern-assembler__button"
					onClick={ onDoneClick }
					primary
				>
					{ translate( 'Done' ) }
				</NavigatorBackButton>
			</div>
		</>
	);
};

export default ScreenHomepage;
